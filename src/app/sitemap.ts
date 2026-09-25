import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { publicLocales, localizePath } from "@/lib/i18n/public-dictionary";

const STATIC_PATHS = ["/", "/tedaviler", "/doktorlar", "/galeri", "/randevu"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const treatments = await prisma.treatment.findMany({
    where: { is_active: true },
    select: { slug: true, updated_at: true },
  });

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of publicLocales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${baseUrl}${localizePath(locale, path)}`,
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.7,
      });
    }
    for (const treatment of treatments) {
      entries.push({
        url: `${baseUrl}${localizePath(locale, `/tedaviler/${treatment.slug}`)}`,
        lastModified: treatment.updated_at,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }
  return entries;
}
