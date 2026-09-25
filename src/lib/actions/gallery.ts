"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import { gallerySchema } from "@/lib/zod";

export async function createGallery(data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");

    const parsed = gallerySchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.gallery.create({ data: parsed.data });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateGallery(id: string, data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    const parsed = gallerySchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.gallery.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteGallery(id: string) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    await prisma.gallery.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
