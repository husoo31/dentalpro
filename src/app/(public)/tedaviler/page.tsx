
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { buildPageMetadata, getPublicLocale } from "@/lib/i18n/public-server";
import { localizePath, publicDictionaries } from "@/lib/i18n/public-dictionary";
import Button from "@/components/ui/Button";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = publicDictionaries[await getPublicLocale()].treatments;
  return buildPageMetadata("/tedaviler", t.title, t.subtitle);
}

export default async function TreatmentsPage() {
  const locale = await getPublicLocale();
  const t = publicDictionaries[locale].treatments;
  const treatments = await prisma.treatment.findMany({
    where: { is_active: true },
    orderBy: { sort_order: 'asc' }
  });

  return (
    <>
      <section className="section-padding bg-alt">
        <div className="container" style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
          <h1 className="reveal active">{t.title}</h1>
          <p style={{ maxWidth: "600px", margin: "0 auto" }}>{t.subtitle}</p>
        </div>
        
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--spacing-8)" }}>
          {treatments.length === 0 && <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-text-muted)" }}>{t.empty}</p>}
          {treatments.map((item) => (
            <div key={item.id} style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
              <div style={{ height: "200px", background: "var(--color-surface-hover)", position: "relative" }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-text-muted)" }}>{t.noImage}</div>
                )}
              </div>
              <div style={{ padding: "var(--spacing-5)" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--spacing-2)" }}>{item.name}</h3>
                <p style={{ fontSize: "0.9rem", marginBottom: "var(--spacing-4)" }}>{item.short_description || t.fallbackDesc}</p>
                <Button href={localizePath(locale, `/tedaviler/${item.slug}`)} variant="ghost" style={{ paddingLeft: 0 }}>{t.discover} &rarr;</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
