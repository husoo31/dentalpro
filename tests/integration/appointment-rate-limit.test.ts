// Integration test against a real local PostgreSQL instance (see tests/setup.ts).
// Confirms the rate limiter is actually wired into createAppointment, not just unit-tested
// in isolation: same simulated IP repeated past the limit, then a different IP unaffected.
import { describe, it, expect, afterAll, vi } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn(async () => null) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

let currentIp = "203.0.113.10";
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Map([["x-forwarded-for", currentIp]])),
}));

import { prisma } from "@/lib/prisma";
import { createAppointment } from "@/lib/actions/appointments";

function futureDate() {
  return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
}

function submit(patientSuffix: string) {
  return createAppointment({
    patient_name: `RateLimit Test ${patientSuffix}`,
    phone: "05551234567",
    desired_date: futureDate(),
  });
}

afterAll(async () => {
  await prisma.appointment.deleteMany({ where: { patient_name: { startsWith: "RateLimit Test" } } });
  await prisma.$disconnect();
});

describe("createAppointment rate limiting", () => {
  it("allows requests up to the limit from the same IP, and blocks the next one", async () => {
    currentIp = "203.0.113.20"; // dedicated IP for this test, isolated from other tests

    const results = [];
    for (let i = 0; i < 5; i++) {
      results.push(await submit(`limit-${i}`));
    }
    // All 5 within the limit should succeed.
    for (const res of results) {
      expect(res.success).toBe(true);
    }

    const blocked = await submit("limit-6th");
    expect(blocked.error).toBe("RATE_LIMITED");

    const savedCount = await prisma.appointment.count({
      where: { patient_name: { startsWith: "RateLimit Test limit-" } },
    });
    // Exactly 5 rows written — the blocked 6th request never reached the DB.
    expect(savedCount).toBe(5);
  });

  it("does not rate-limit a different IP even if another IP is exhausted", async () => {
    currentIp = "203.0.113.30";
    for (let i = 0; i < 5; i++) {
      await submit(`other-ip-a-${i}`);
    }
    expect((await submit("other-ip-a-6th")).error).toBe("RATE_LIMITED");

    currentIp = "203.0.113.31"; // distinct IP, should be unaffected
    const res = await submit("other-ip-b-1");
    expect(res.success).toBe(true);
  });

  it("a normal single submission is never rate-limited", async () => {
    currentIp = "203.0.113.40";
    const res = await submit("normal-single");
    expect(res.success).toBe(true);
  });

  it("existing validation (past date) still applies alongside rate limiting", async () => {
    currentIp = "203.0.113.50";
    const res = await createAppointment({
      patient_name: "RateLimit Test past-date",
      phone: "05551234567",
      desired_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    });
    expect(res.success).toBeUndefined();
    expect(res.error).toBeTruthy();
    expect(res.error).not.toBe("RATE_LIMITED");
  });
});
