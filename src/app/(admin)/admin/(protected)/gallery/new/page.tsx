import { getDictionary } from "@/lib/i18n/admin-server";
import NewGalleryForm from "./NewGalleryForm";

export default async function NewGalleryPage() {
  const { t } = await getDictionary();
  return <NewGalleryForm t={t} />;
}
