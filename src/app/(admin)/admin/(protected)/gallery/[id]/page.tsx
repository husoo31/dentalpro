import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/admin-server";
import EditGalleryForm from "./EditGalleryForm";

export default async function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, { t }] = await Promise.all([
    prisma.gallery.findUnique({ where: { id } }),
    getDictionary(),
  ]);

  if (!item) notFound();

  return <EditGalleryForm t={t} item={item} />;
}
