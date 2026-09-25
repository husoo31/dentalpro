"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import { beforeAfterSchema } from "@/lib/zod";

export async function createBeforeAfter(data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");

    const parsed = beforeAfterSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.beforeAfter.create({ data: parsed.data });
    revalidatePath("/admin/before-after");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateBeforeAfter(id: string, data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    const parsed = beforeAfterSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.beforeAfter.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/before-after");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteBeforeAfter(id: string) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    await prisma.beforeAfter.delete({ where: { id } });
    revalidatePath("/admin/before-after");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
