"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTreatment(data: any) {
  try {
    await prisma.treatment.create({ data });
    revalidatePath("/admin/treatments");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateTreatment(id: string, data: any) {
  try {
    await prisma.treatment.update({ where: { id }, data });
    revalidatePath("/admin/treatments");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteTreatment(id: string) {
  try {
    await prisma.treatment.delete({ where: { id } });
    revalidatePath("/admin/treatments");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
