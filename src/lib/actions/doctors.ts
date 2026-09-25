"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import { doctorSchema } from "@/lib/zod";

export async function createDoctor(data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");

    const parsed = doctorSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.doctor.create({ data: parsed.data });
    revalidatePath("/admin/doctors");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateDoctor(id: string, data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    const parsed = doctorSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.doctor.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/doctors");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteDoctor(id: string) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    await prisma.doctor.delete({ where: { id } });
    revalidatePath("/admin/doctors");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
