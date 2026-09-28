import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { getSettings } from "@/lib/actions/settings";
import { buildPageMetadata, getPublicLocale } from "@/lib/i18n/public-server";
import { localizePath, publicDictionaries } from "@/lib/i18n/public-dictionary";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = publicDictionaries[await getPublicLocale()].contact;
  return buildPageMetadata("/iletisim", t.title, t.subtitle);
}

export default async function ContactPage() {
  const locale = await getPublicLocale();
  const t = publicDictionaries[locale].contact;
  const settings = await getSettings();
  const href = (path: string) => localizePath(locale, path);

  const rows: { label: string; value: string }[] = [];
  if (settings.address) rows.push({ label: t.addressLabel, value: settings.address });
  if (settings.phone) rows.push({ label: t.phoneLabel, value: settings.phone });
  if (settings.email) rows.push({ label: t.emailLabel, value: settings.email });
  if (settings.workingHours) rows.push({ label: t.hoursLabel, value: settings.workingHours });

  return (
    <>
      <section className="section-padding bg-alt">
        <div className="container" style={{ textAlign: "center" }}>
          <h1>{t.title}</h1>
          <p style={{ maxWidth: "600px", margin: "0 auto" }}>{t.subtitle}</p>
        </div>
      </section>

      <section className="section-padding container">
        <div style={{ maxWidth: "560px", margin: "0 auto", display: "grid", gap: "var(--spacing-6)" }}>
          {rows.map((row) => (
            <div key={row.label} style={{ background: "var(--color-surface-alt)", padding: "var(--spacing-5)", borderRadius: "var(--radius-lg)" }}>
              <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "var(--spacing-2)" }}>{row.label}</h3>
              <p style={{ marginBottom: 0, fontSize: "1.1rem", whiteSpace: "pre-line" }}>{row.value}</p>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "var(--spacing-4)" }}>
            <h2 style={{ fontSize: "1.5rem" }}>{t.ctaTitle}</h2>
            <Button href={href("/randevu")} size="lg" variant="primary">{t.ctaButton}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
