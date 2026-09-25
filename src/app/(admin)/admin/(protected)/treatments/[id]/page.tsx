import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/admin-server";
import EditTreatmentForm from "./EditTreatmentForm";

export default async function EditTreatmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [treatment, { t }] = await Promise.all([
    prisma.treatment.findUnique({ where: { id } }),
    getDictionary(),
  ]);

  if (!treatment) notFound();

  return <EditTreatmentForm t={t} treatment={treatment} />;
}
