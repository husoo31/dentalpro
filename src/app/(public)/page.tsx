import type { Metadata } from 'next';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/actions/settings';
import { getPublicLocale } from '@/lib/i18n/public-server';
import { fillClinic, localizePath, publicDictionaries } from '@/lib/i18n/public-dictionary';

export const dynamic = 'force-dynamic';

const TREATMENT_IMAGES = [
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598256989800-fea5f6c8d0bd?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522849595462-805118b628c4?q=80&w=600&auto=format&fit=crop",
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getPublicLocale();
  const settings = await getSettings();
  const t = publicDictionaries[locale].seo;
  const clinic = settings.clinicName || 'DentalPro';
  // Admin-entered SEO texts are single-language, so they are used for the default (TR) locale only.
  const title = locale === 'tr' && settings.seoTitle ? settings.seoTitle : `${clinic} | ${t.title}`;
  const description = locale === 'tr' && settings.seoDescription ? settings.seoDescription : fillClinic(t.description, clinic);
  const url = localizePath(locale, '/');

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { tr: '/', en: '/en', 'x-default': '/' },
    },
    openGraph: { title, description, url, siteName: clinic, locale: t.ogLocale, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function Home() {
  const locale = await getPublicLocale();
  const t = publicDictionaries[locale].home;
  const settings = await getSettings();
  const clinic = settings.clinicName || 'DentalPro';
  const href = (path: string) => localizePath(locale, path);

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { created_at: 'desc' },
    take: 6,
  });

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <div className={styles.heroOverlay}></div>
          <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2000&auto=format&fit=crop" alt={t.heroImageAlt} className={styles.heroImage} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <p className={`${styles.subtitle} reveal active`}>{fillClinic(t.welcome, clinic).toLocaleUpperCase(locale)}</p>
          <h1 className="reveal active">{t.heroTitleLine1}<br />{t.heroTitleLine2}</h1>
          <p className={`${styles.heroDesc} reveal active`}>{t.heroDesc}</p>
          <div className={`${styles.heroActions} reveal active`}>
            <Button href={href("/randevu")} size="lg" variant="primary">{publicDictionaries[locale].nav.bookAppointment}</Button>
            <Button href={href("/tedaviler")} size="lg" variant="outline" className={styles.heroSecondaryBtn}>{t.ourExpertise}</Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className={`container ${styles.introGrid}`}>
          <div className={styles.introText}>
            <h2>{t.introTitleLine1} <br/> {t.introTitleLine2}</h2>
            <p>{fillClinic(t.introText, clinic)}</p>
            <Button href={href("/hakkimizda")} variant="ghost">{t.philosophyLink} &rarr;</Button>
          </div>
          <div className={styles.introImageWrapper}>
            <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1000&auto=format&fit=crop" alt={t.introImageAlt} className={styles.introImage} />
          </div>
        </div>
      </section>

      <section className="section-padding bg-alt">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>{t.treatmentsTitle}</h2>
            <p>{t.treatmentsSubtitle}</p>
          </div>

          <div className={styles.treatmentsGrid}>
            {t.treatments.map((item, i) => (
              <div key={i} className={styles.treatmentCard}>
                <div className={styles.treatmentImgWrapper}>
                  <img src={TREATMENT_IMAGES[i]} alt={item.title} />
                </div>
                <div className={styles.treatmentCardContent}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <Button variant="ghost" className={styles.treatmentBtn}>{t.learnMore} &rarr;</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section-padding bg-surface" id="testimonials">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>{t.testimonialsTitle}</h2>
              <p>{t.testimonialsSubtitle}</p>
            </div>
            <div className={styles.testimonialsGrid}>
              {testimonials.map((item) => (
                <figure key={item.id} className={styles.testimonialCard}>
                  <div className={styles.testimonialStars} aria-label={`${item.rating} / 5`}>
                    {'★'.repeat(item.rating)}{'☆'.repeat(Math.max(0, 5 - item.rating))}
                  </div>
                  <blockquote>{item.text}</blockquote>
                  <figcaption>{item.patient_name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-primary">
        <div className={`container ${styles.ctaSection}`}>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaSubtitle}</p>
          <Button href={href("/randevu")} size="lg" variant="secondary">{t.ctaButton}</Button>
        </div>
      </section>
    </>
  );
}
