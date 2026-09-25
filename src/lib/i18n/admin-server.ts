import { cookies } from "next/headers";
import { dictionaries, locales, type Locale } from "./admin-dictionary";

export const LOCALE_COOKIE = "admin_locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return locales.includes(value as Locale) ? (value as Locale) : "tr";
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
