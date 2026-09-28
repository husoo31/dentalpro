import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { getSettings } from "@/lib/actions/settings";
import { buildPageMetadata, getPublicLocale } from "@/lib/i18n/public-server";
import { fillClinic, localizePath, publicDictionaries } from "@/lib/i18n/public-dictionary";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = publicDictionaries[await getPublicLocale()].about;
  return buildPageMetadata("/hakkimizda", t.title, t.subtitle);
}

export default async function AboutPage() {
  const locale = await getPublicLocale();
  const t = publicDictionaries[locale].about;
  const settings = await getSettings();
  const clinic = settings.clinicName || "DentalPro";
  const href = (path: string) => localizePath(locale, path);

  return (
    <>
      <section className="section-padding bg-alt">
        <div className="container" style={{ textAlign: "center" }}>
          <h1>{t.title}</h1>
          <p style={{ maxWidth: "640px", margin: "0 auto" }}>{t.subtitle}</p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container" style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <h2>{t.philosophyTitle}</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>{fillClinic(t.philosophyText, clinic)}</p>
        </div>
      </section>

      <section className="section-padding bg-alt">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
            <h2>{t.valuesTitle}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--spacing-8)" }}>
            {t.values.map((v, i) => (
              <div key={i} style={{ background: "var(--color-surface)", padding: "var(--spacing-6)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ fontSize: "1.15rem", marginBottom: "var(--spacing-2)" }}>{v.title}</h3>
                <p style={{ marginBottom: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container" style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
          <h2>{t.teamTitle}</h2>
          <p>{t.teamText}</p>
          <Button href={href("/doktorlar")} variant="outline">{t.teamCta}</Button>
        </div>
      </section>

      <section className="section-padding bg-primary">
        <div className="container" style={{ textAlign: "center" }}>
          <h2>{t.ctaTitle}</h2>
          <Button href={href("/randevu")} size="lg" variant="secondary">{t.ctaButton}</Button>
        </div>
      </section>
    </>
  );
}
