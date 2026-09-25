"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import { testimonialSchema } from "@/lib/zod";

export async function createTestimonial(data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");

    const parsed = testimonialSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.testimonial.create({ data: parsed.data });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateTestimonial(id: string, data: any) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    const parsed = testimonialSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.format() };
    }

    await prisma.testimonial.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await requireRole("ADMIN", "EDITOR");
    if (typeof id !== "string" || !id) {
      return { error: "Invalid request" };
    }

    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
