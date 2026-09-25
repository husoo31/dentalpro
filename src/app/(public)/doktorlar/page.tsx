
import { prisma } from "@/lib/prisma";
import Button from "@/components/ui/Button";
import type { Metadata } from "next";
import { buildPageMetadata, getPublicLocale } from "@/lib/i18n/public-server";
import { localizePath, publicDictionaries } from "@/lib/i18n/public-dictionary";


export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = publicDictionaries[await getPublicLocale()].doctors;
  return buildPageMetadata("/doktorlar", t.title, t.subtitle);
}

export default async function DoctorsPage() {
  const locale = await getPublicLocale();
  const t = publicDictionaries[locale].doctors;
  const doctors = await prisma.doctor.findMany({
    where: { is_active: true },
    orderBy: { sort_order: 'asc' }
  });

  return (
    <section className="section-padding container">
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
        <h1>{t.title}</h1>
        <p style={{ maxWidth: "600px", margin: "0 auto" }}>{t.subtitle}</p>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--spacing-8)" }}>
        {doctors.length === 0 && <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-text-muted)" }}>{t.empty}</p>}
        {doctors.map((d) => (
          <div key={d.id} style={{ textAlign: "center" }}>
            <div style={{ width: "200px", height: "200px", borderRadius: "50%", margin: "0 auto var(--spacing-4)", background: "var(--color-surface-alt)", overflow: "hidden" }}>
              {d.image_url ? (
                <img src={d.image_url} alt={d.full_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                 <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>{t.photo}</div>
              )}
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--spacing-1)" }}>{d.title} {d.full_name}</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "var(--spacing-3)" }}>{d.bio ? d.bio.substring(0, 50) + "..." : t.specialist}</p>
            <Button href={localizePath(locale, `/doktorlar/${d.slug}`)} variant="outline" size="sm">{t.viewProfile}</Button>
          </div>
        ))}
      </div>
    </section>
  );
}
