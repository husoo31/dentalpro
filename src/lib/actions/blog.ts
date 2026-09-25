"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import { postSchema } from "@/lib/zod";
import { sanitizeRichText } from "@/lib/sanitize";

export async function createPost(data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");

    const parsed = postSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.post.create({
      data: {
        ...parsed.data,
        content: sanitizeRichText(parsed.data.content),
      },
    });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updatePost(id: string, data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    const parsed = postSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.post.update({
      where: { id },
      data: {
        ...parsed.data,
        content: parsed.data.content !== undefined ? sanitizeRichText(parsed.data.content) : undefined,
      },
    });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deletePost(id: string) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
