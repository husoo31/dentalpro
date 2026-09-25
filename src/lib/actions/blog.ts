"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(data: any) {
  try {
    await prisma.post.create({ data });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updatePost(id: string, data: any) {
  try {
    await prisma.post.update({ where: { id }, data });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
