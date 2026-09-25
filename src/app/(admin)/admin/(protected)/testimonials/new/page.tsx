import { getDictionary } from "@/lib/i18n/admin-server";
import NewTestimonialForm from "./NewTestimonialForm";

export default async function NewTestimonialPage() {
  const { t } = await getDictionary();
  return <NewTestimonialForm t={t} />;
}
