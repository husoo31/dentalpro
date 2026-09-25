import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/admin-server";
import EditBeforeAfterForm from "./EditBeforeAfterForm";

export default async function EditBeforeAfterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, { t }] = await Promise.all([
    prisma.beforeAfter.findUnique({ where: { id } }),
    getDictionary(),
  ]);

  if (!item) notFound();

  return <EditBeforeAfterForm t={t} item={item} />;
}
