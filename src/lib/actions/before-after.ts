"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBeforeAfter(data: any) {
  try {
    await prisma.beforeAfter.create({ data });
    revalidatePath("/admin/before-after");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateBeforeAfter(id: string, data: any) {
  try {
    await prisma.beforeAfter.update({ where: { id }, data });
    revalidatePath("/admin/before-after");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteBeforeAfter(id: string) {
  try {
    await prisma.beforeAfter.delete({ where: { id } });
    revalidatePath("/admin/before-after");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
