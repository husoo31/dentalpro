import { getDictionary } from "@/lib/i18n/admin-server";
import NewTreatmentForm from "./NewTreatmentForm";

export default async function NewTreatmentPage() {
  const { t } = await getDictionary();
  return <NewTreatmentForm t={t} />;
}
