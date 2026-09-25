import { getDictionary } from "@/lib/i18n/admin-server";
import NewDoctorForm from "./NewDoctorForm";

export default async function NewDoctorPage() {
  const { t } = await getDictionary();
  return <NewDoctorForm t={t} />;
}
