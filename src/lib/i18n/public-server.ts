import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSettings } from "@/lib/actions/settings";
import {
  defaultPublicLocale,
  isPublicLocale,
  localizePath,
  publicDictionaries,
  type PublicLocale,
} from "./public-dictionary";

/** Locale resolved by src/proxy.ts (URL prefix is the source of truth). */
export async function getPublicLocale(): Promise<PublicLocale> {
  const value = (await headers()).get("x-public-locale");
  return isPublicLocale(value) ? value : defaultPublicLocale;
}

export async function getPublicDictionary() {
  const locale = await getPublicLocale();
  return { locale, t: publicDictionaries[locale] };
}

/** Locale-aware metadata (canonical + hreflang + OG/Twitter) for inner public pages. */
export async function buildPageMetadata(path: string, pageTitle: string, description: string): Promise<Metadata> {
  const locale = await getPublicLocale();
  const clinic = (await getSettings()).clinicName || "DentalPro";
  const title = `${pageTitle} | ${clinic}`;
  const url = localizePath(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { tr: path, en: localizePath("en", path), "x-default": path },
    },
    openGraph: { title, description, url, siteName: clinic, locale: publicDictionaries[locale].seo.ogLocale, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
