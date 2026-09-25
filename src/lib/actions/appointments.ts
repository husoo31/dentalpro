"use server";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import type { AppointmentStatus } from "@prisma/client";

export async function createAppointment(data: any) {
  try {
    const parsed = appointmentSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }
    
    await prisma.appointment.create({
      data: {
        patient_name: parsed.data.patient_name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        desired_date: parsed.data.desired_date,
        treatment_id: parsed.data.treatment_id || null,
        message: parsed.data.message || null
      }
    });
    
    return { success: true };
  } catch (e: any) {
    return { error: "Sunucu hatası: " + e.message };
  }
}

// Allowed admin transitions. A cancelled appointment is final in the current UI.
const ADMIN_TRANSITIONS: Partial<Record<AppointmentStatus, AppointmentStatus[]>> = {
  CONFIRMED: ["PENDING"],
  CANCELLED: ["PENDING", "CONFIRMED"],
};

/**
 * Admin-only status change. Authorization lives here (not only in the admin layout), because
 * server actions are reachable by direct POST regardless of which page rendered the form.
 */
export async function updateAppointmentStatus(id: string, newStatus: "CONFIRMED" | "CANCELLED") {
  await requireRole("ADMIN", "EDITOR");

  const from = ADMIN_TRANSITIONS[newStatus];
  if (typeof id !== "string" || !from) {
    throw new Error("Invalid request");
  }

  // updateMany with the current-status guard: only an existing appointment in an allowed
  // state is touched, and the id can never address any other table or row.
  await prisma.appointment.updateMany({
    where: { id, status: { in: from } },
    data: { status: newStatus },
  });
  revalidatePath("/admin/appointments");
}
