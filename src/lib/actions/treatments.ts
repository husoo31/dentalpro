"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import { treatmentSchema } from "@/lib/zod";
import { sanitizeRichText } from "@/lib/sanitize";

export async function createTreatment(data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");

    const parsed = treatmentSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.treatment.create({
      data: {
        ...parsed.data,
        full_description: sanitizeRichText(parsed.data.full_description) || undefined,
      },
    });
    revalidatePath("/admin/treatments");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateTreatment(id: string, data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    const parsed = treatmentSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.treatment.update({
      where: { id },
      data: {
        ...parsed.data,
        full_description: parsed.data.full_description !== undefined ? sanitizeRichText(parsed.data.full_description) : undefined,
      },
    });
    revalidatePath("/admin/treatments");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteTreatment(id: string) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    await prisma.treatment.delete({ where: { id } });
    revalidatePath("/admin/treatments");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
