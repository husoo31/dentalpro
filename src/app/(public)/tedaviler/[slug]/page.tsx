
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import type { Metadata } from "next";
import { buildPageMetadata, getPublicLocale } from "@/lib/i18n/public-server";
import { localizePath, publicDictionaries } from "@/lib/i18n/public-dictionary";


export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const treatment = await prisma.treatment.findUnique({ where: { slug } });
  if (!treatment) return {};
  return buildPageMetadata(`/tedaviler/${slug}`, treatment.name, treatment.short_description || publicDictionaries[await getPublicLocale()].treatments.subtitle);
}

export default async function TreatmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getPublicLocale();
  const t = publicDictionaries[locale].treatments;
  const treatment = await prisma.treatment.findUnique({
    where: { slug }
  });

  if (!treatment) notFound();

  return (
    <article>
      <section style={{ padding: "var(--spacing-16) 0", background: "linear-gradient(135deg, #0b1220 0%, color-mix(in srgb, var(--color-primary) 22%, #0b1220) 100%)", color: "var(--color-text-inverse)" }}>
        <div className="container">
          <Button href={localizePath(locale, "/tedaviler")} variant="ghost" style={{ color: "rgba(255,255,255,0.88)", marginBottom: "var(--spacing-4)", paddingLeft: 0 }}>&larr; {t.back}</Button>
          <h1 style={{ color: "var(--color-text-inverse)" }}>{treatment.name}</h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "600px", color: "rgba(255,255,255,0.9)" }}>{treatment.short_description}</p>
        </div>
      </section>

      <section className="section-padding container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--spacing-12)" }}>
        <div>
          <h2>{t.overview}</h2>
          <div style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--color-text-main)" }} dangerouslySetInnerHTML={{ __html: treatment.full_description || `<p>${t.descriptionSoon}</p>` }} />
        </div>
        <div>
          <div style={{ background: "var(--color-surface-alt)", padding: "var(--spacing-6)", borderRadius: "var(--radius-lg)", position: "sticky", top: "100px" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--spacing-4)" }}>{t.ctaTitle}</h3>
            <Button href={`${localizePath(locale, "/randevu")}?treatment=${treatment.id}`} variant="primary" style={{ width: "100%" }}>{t.ctaButton}</Button>
          </div>
        </div>
      </section>
    </article>
  );
}
