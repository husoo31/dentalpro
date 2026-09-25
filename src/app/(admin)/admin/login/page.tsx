import { getDictionary } from "@/lib/i18n/admin-server";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const { t, locale } = await getDictionary();
  return <LoginForm t={t} locale={locale} />;
}
