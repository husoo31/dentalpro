import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import type { Metadata } from "next";
import { buildPageMetadata, getPublicLocale } from "@/lib/i18n/public-server";
import { localizePath, publicDictionaries } from "@/lib/i18n/public-dictionary";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await prisma.doctor.findUnique({ where: { slug } });
  if (!doctor) return {};
  const t = publicDictionaries[await getPublicLocale()].doctors;
  return buildPageMetadata(`/doktorlar/${slug}`, `${doctor.title} ${doctor.full_name}`, doctor.bio?.slice(0, 160) || t.subtitle);
}

export default async function DoctorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getPublicLocale();
  const t = publicDictionaries[locale].doctors;
  const href = (path: string) => localizePath(locale, path);
  const doctor = await prisma.doctor.findUnique({ where: { slug } });

  if (!doctor || !doctor.is_active) notFound();

  return (
    <article>
      <section className="section-padding container" style={{ paddingTop: "var(--spacing-16)" }}>
        <Button href={href("/doktorlar")} variant="ghost" style={{ paddingLeft: 0, marginBottom: "var(--spacing-6)" }}>&larr; {t.back}</Button>

        <div className={styles.grid}>
          <div className={styles.photoWrapper}>
            {doctor.image_url ? (
              <img src={doctor.image_url} alt={doctor.full_name} className={styles.photo} />
            ) : (
              <div className={styles.photoFallback}>{t.photo}</div>
            )}
          </div>
          <div>
            <p className="text-accent" style={{ fontWeight: 600, marginBottom: "var(--spacing-2)" }}>{doctor.title}</p>
            <h1>{doctor.full_name}</h1>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", whiteSpace: "pre-line" }}>{doctor.bio || t.bioFallback}</p>

            <div className={styles.ctaBox}>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "var(--spacing-3)" }}>{t.ctaTitle}</h3>
              <Button href={href("/randevu")} variant="primary">{t.ctaButton}</Button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
