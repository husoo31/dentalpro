
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { buildPageMetadata, getPublicLocale } from "@/lib/i18n/public-server";
import { publicDictionaries } from "@/lib/i18n/public-dictionary";


export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = publicDictionaries[await getPublicLocale()].gallery;
  return buildPageMetadata("/galeri", t.title, t.subtitle);
}

export default async function GalleryPage() {
  const t = publicDictionaries[await getPublicLocale()].gallery;
  const items = await prisma.gallery.findMany({
    orderBy: { sort_order: 'asc' }
  });

  return (
    <section className="section-padding container">
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--spacing-4)" }}>
        {items.length === 0 && <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-text-muted)" }}>{t.empty}</p>}
        {items.map((img) => (
          <div key={img.id} style={{ aspectRatio: "1", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--color-surface-alt)" }}>
            <img src={img.image_url} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>
    </section>
  );
}
