import { getDictionary } from "@/lib/i18n/admin-server";
import NewBeforeAfterForm from "./NewBeforeAfterForm";

export default async function NewBeforeAfterPage() {
  const { t } = await getDictionary();
  return <NewBeforeAfterForm t={t} />;
}
