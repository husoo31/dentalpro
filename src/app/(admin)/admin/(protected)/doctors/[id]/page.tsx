import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/admin-server";
import EditDoctorForm from "./EditDoctorForm";

export default async function EditDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [doctor, { t }] = await Promise.all([
    prisma.doctor.findUnique({ where: { id } }),
    getDictionary(),
  ]);

  if (!doctor) notFound();

  return <EditDoctorForm t={t} doctor={doctor} />;
}
