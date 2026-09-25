import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/actions/settings";
import { buildPageMetadata, getPublicLocale } from "@/lib/i18n/public-server";
import { publicDictionaries } from "@/lib/i18n/public-dictionary";
import RandevuForm from "@/components/frontend/RandevuForm";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = publicDictionaries[await getPublicLocale()].appointment;
  return buildPageMetadata("/randevu", t.formTitle, t.description);
}

export default async function RandevuPage({ searchParams }: { searchParams?: Promise<{ treatment?: string }> }) {
  const locale = await getPublicLocale();
  const t = publicDictionaries[locale].appointment;
  const settings = await getSettings();
  const { treatment } = (await searchParams) ?? {};

  const treatments = await prisma.treatment.findMany({
    where: { is_active: true },
    orderBy: { sort_order: 'asc' }
  });

  const hours = (settings.workingHours || t.defaultHours).split("\n");

  return (
    <main className={styles.main}>
      <div className={styles.heroBackground}></div>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.content}>
            <p className={styles.subtitle}>{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className={styles.description}>{t.description}</p>

            <div className={styles.contactInfo}>
              {settings.phone && (
                <div className={styles.infoBlock}>
                  <h4>{t.callUs}</h4>
                  <p>{settings.phone}</p>
                </div>
              )}
              <div className={styles.infoBlock}>
                <h4>{t.clinicHours}</h4>
                <p>{hours.map((line, i) => (<span key={i}>{i > 0 && <br />}{line}</span>))}</p>
              </div>
            </div>
          </div>

          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h3>{t.formTitle}</h3>
              <p>{t.formSubtitle}</p>
            </div>
            <RandevuForm treatments={treatments} selectedTreatmentId={treatment} locale={locale} />
          </div>
        </div>
      </div>
    </main>
  );
}
