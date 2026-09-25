"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGallery(data: any) {
  try {
    await prisma.gallery.create({ data });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateGallery(id: string, data: any) {
  try {
    await prisma.gallery.update({ where: { id }, data });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteGallery(id: string) {
  try {
    await prisma.gallery.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
