"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTestimonial(data: any) {
  try {
    await prisma.testimonial.create({ data });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateTestimonial(id: string, data: any) {
  try {
    await prisma.testimonial.update({ where: { id }, data });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
