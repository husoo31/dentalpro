// Integration tests against a real local PostgreSQL instance (see tests/setup.ts).
import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { getServerSession } from "next-auth";
const mockedSession = getServerSession as unknown as ReturnType<typeof vi.fn>;

import { prisma } from "@/lib/prisma";
import { createAppointment, updateAppointmentStatus } from "@/lib/actions/appointments";

function asAdmin() {
  mockedSession.mockResolvedValue({ user: { role: "ADMIN" } });
}
function asAnonymous() {
  mockedSession.mockResolvedValue(null);
}

async function makeAppointment() {
  const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const patient_name = "Test Patient " + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  const res = await createAppointment({ patient_name, phone: "05551234567", desired_date: future });
  expect(res.success).toBe(true);
  return prisma.appointment.findFirstOrThrow({ where: { patient_name } });
}

beforeEach(() => mockedSession.mockReset());
afterAll(async () => {
  await prisma.$disconnect();
});

describe("appointment creation (public, unauthenticated)", () => {
  it("createAppointment does not require authentication", async () => {
    asAnonymous();
    const appt = await makeAppointment();
    expect(appt.status).toBe("PENDING");
  });
});

describe("appointment status transitions (admin-only)", () => {
  it("PENDING -> CONFIRMED as ADMIN", async () => {
    const appt = await makeAppointment();
    asAdmin();
    await updateAppointmentStatus(appt.id, "CONFIRMED");
    expect((await prisma.appointment.findUniqueOrThrow({ where: { id: appt.id } })).status).toBe("CONFIRMED");
  });

  it("PENDING -> CANCELLED as ADMIN", async () => {
    const appt = await makeAppointment();
    asAdmin();
    await updateAppointmentStatus(appt.id, "CANCELLED");
    expect((await prisma.appointment.findUniqueOrThrow({ where: { id: appt.id } })).status).toBe("CANCELLED");
  });

  it("CONFIRMED -> CANCELLED as ADMIN", async () => {
    const appt = await makeAppointment();
    asAdmin();
    await updateAppointmentStatus(appt.id, "CONFIRMED");
    await updateAppointmentStatus(appt.id, "CANCELLED");
    expect((await prisma.appointment.findUniqueOrThrow({ where: { id: appt.id } })).status).toBe("CANCELLED");
  });

  it("rejects an unauthenticated status update and leaves the status unchanged", async () => {
    const appt = await makeAppointment();
    asAnonymous();
    await expect(updateAppointmentStatus(appt.id, "CONFIRMED")).rejects.toThrow();
    expect((await prisma.appointment.findUniqueOrThrow({ where: { id: appt.id } })).status).toBe("PENDING");
  });
});
