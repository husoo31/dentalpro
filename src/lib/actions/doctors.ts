"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDoctor(data: any) {
  try {
    await prisma.doctor.create({ data });
    revalidatePath("/admin/doctors");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateDoctor(id: string, data: any) {
  try {
    await prisma.doctor.update({ where: { id }, data });
    revalidatePath("/admin/doctors");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteDoctor(id: string) {
  try {
    await prisma.doctor.delete({ where: { id } });
    revalidatePath("/admin/doctors");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
