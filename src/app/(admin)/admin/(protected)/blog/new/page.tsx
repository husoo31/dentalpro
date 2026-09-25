import { getDictionary } from "@/lib/i18n/admin-server";
import NewPostForm from "./NewPostForm";

export default async function NewPostPage() {
  const { t } = await getDictionary();
  return <NewPostForm t={t} />;
}
