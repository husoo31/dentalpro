import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { buildPageMetadata, getPublicLocale } from "@/lib/i18n/public-server";
import { publicDictionaries } from "@/lib/i18n/public-dictionary";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = publicDictionaries[await getPublicLocale()].beforeAfter;
  return buildPageMetadata("/once-sonra", t.title, t.subtitle);
}

export default async function BeforeAfterPage() {
  const t = publicDictionaries[await getPublicLocale()].beforeAfter;
  const cases = await prisma.beforeAfter.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
  });

  return (
    <section className="section-padding container">
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
        <h1>{t.title}</h1>
        <p style={{ maxWidth: "600px", margin: "0 auto" }}>{t.subtitle}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--spacing-8)" }}>
        {cases.length === 0 && <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-text-muted)" }}>{t.empty}</p>}
        {cases.map((c) => (
          <div key={c.id} style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ aspectRatio: "1", background: "var(--color-surface-hover)", position: "relative" }}>
                <img src={c.before_image} alt={`${c.title} - ${t.before}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <span style={{ position: "absolute", top: "8px", left: "8px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "0.75rem", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>{t.before}</span>
              </div>
              <div style={{ aspectRatio: "1", background: "var(--color-surface-hover)", position: "relative" }}>
                <img src={c.after_image} alt={`${c.title} - ${t.after}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <span style={{ position: "absolute", top: "8px", left: "8px", background: "var(--color-accent)", color: "var(--color-primary-dark)", fontSize: "0.75rem", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>{t.after}</span>
              </div>
            </div>
            <div style={{ padding: "var(--spacing-4)" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: c.description ? "var(--spacing-2)" : 0 }}>{c.title}</h3>
              {c.description && <p style={{ marginBottom: 0, fontSize: "0.95rem" }}>{c.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
