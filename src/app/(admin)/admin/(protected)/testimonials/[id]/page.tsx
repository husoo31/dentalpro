import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/admin-server";
import EditTestimonialForm from "./EditTestimonialForm";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, { t }] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id } }),
    getDictionary(),
  ]);

  if (!item) notFound();

  return <EditTestimonialForm t={t} item={item} />;
}
