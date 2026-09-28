import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import BeforeAfterSlider from '@/components/public/BeforeAfterSlider';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/actions/settings';
import { getPublicLocale } from '@/lib/i18n/public-server';
import { fillClinic, localizePath, publicDictionaries } from '@/lib/i18n/public-dictionary';

export const dynamic = 'force-dynamic';

const TREATMENT_IMAGES = [
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1667133295352-ef4c83620e8e?q=80&w=600&auto=format&fit=crop",
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
  const tBeforeAfter = publicDictionaries[locale].beforeAfter;
  const settings = await getSettings();
  const clinic = settings.clinicName || 'DentalPro';
  const href = (path: string) => localizePath(locale, path);

  const [testimonials, doctors, beforeAfterCases, galleryImages] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { created_at: 'desc' }, take: 6 }),
    prisma.doctor.findMany({ where: { is_active: true }, orderBy: { sort_order: 'asc' }, take: 3 }),
    prisma.beforeAfter.findMany({ where: { is_active: true }, orderBy: { created_at: 'desc' }, take: 2 }),
    prisma.gallery.findMany({ orderBy: { sort_order: 'asc' }, take: 5 }),
  ]);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <div className={styles.heroOverlay}></div>
          <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2000&auto=format&fit=crop" alt={t.heroImageAlt} className={styles.heroImage} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <Reveal as="p" trigger="mount" className={`kicker ${styles.heroKicker}`}>{fillClinic(t.welcome, clinic).toLocaleUpperCase(locale)}</Reveal>
          <Reveal as="h1" trigger="mount" delay={80}>{t.heroTitleLine1}<br />{t.heroTitleLine2}</Reveal>
          <Reveal as="p" trigger="mount" delay={160} className={styles.heroDesc}>{t.heroDesc}</Reveal>
          <Reveal trigger="mount" delay={240} className={styles.heroActions}>
            <Button href={href("/randevu")} size="lg" variant="primary">{publicDictionaries[locale].nav.bookAppointment}</Button>
            <Button href={href("/tedaviler")} size="lg" variant="outline" className={styles.heroSecondaryBtn}>{t.ourExpertise}</Button>
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className={`container ${styles.introGrid}`}>
          <Reveal className={styles.introText}>
            <span className="kicker">{t.philosophyKicker}</span>
            <h2>{t.introTitleLine1} <br/> {t.introTitleLine2}</h2>
            <p>{fillClinic(t.introText, clinic)}</p>
            <Button href={href("/hakkimizda")} variant="ghost">{t.philosophyLink} &rarr;</Button>
          </Reveal>
          <Reveal delay={120} className={styles.introImageWrapper}>
            <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1000&auto=format&fit=crop" alt={t.introImageAlt} className={styles.introImage} />
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-alt">
        <div className="container">
          <Reveal as="div" className={styles.sectionHeader}>
            <span className="kicker">{t.treatmentsKicker}</span>
            <h2>{t.treatmentsTitle}</h2>
            <p>{t.treatmentsSubtitle}</p>
          </Reveal>

          <div className={styles.treatmentsGrid}>
            {t.treatments.map((item, i) => (
              <Reveal as="div" key={i} delay={i * 90} className={styles.treatmentCard}>
                <div className={styles.treatmentImgWrapper}>
                  <img src={TREATMENT_IMAGES[i]} alt={item.title} />
                </div>
                <div className={styles.treatmentCardContent}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <Button variant="ghost" className={styles.treatmentBtn}>{t.learnMore} &rarr;</Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {doctors.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container">
            <Reveal as="div" className={styles.sectionHeader}>
              <span className="kicker">{t.doctorsKicker}</span>
              <h2>{t.doctorsTitle}</h2>
              <p>{t.doctorsSubtitle}</p>
            </Reveal>

            <div className={styles.doctorsGrid}>
              {doctors.map((doc, i) => (
                <Reveal as="div" key={doc.id} delay={i * 90} className={styles.doctorCard}>
                  <Link href={href(`/doktorlar/${doc.slug}`)} className={styles.doctorImgWrapper}>
                    {doc.image_url ? (
                      <img src={doc.image_url} alt={doc.full_name} />
                    ) : (
                      <div className={styles.doctorImgFallback} aria-hidden="true">
                        {doc.full_name.replace(/^(Dr\.?|Prof\.?|Op\.?\s*Dr\.?)\s*/i, "").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div className={styles.doctorCardContent}>
                    <h3>{doc.full_name}</h3>
                    <p className={styles.doctorTitle}>{doc.title}</p>
                    <Button href={href(`/doktorlar/${doc.slug}`)} variant="ghost" className={styles.treatmentBtn}>{publicDictionaries[locale].doctors.viewProfile} &rarr;</Button>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className={styles.sectionFooterLink}>
              <Button href={href("/doktorlar")} variant="outline">{t.viewAllDoctors}</Button>
            </div>
          </div>
        </section>
      )}

      {beforeAfterCases.length > 0 && (
        <section className="section-padding bg-alt">
          <div className="container">
            <Reveal as="div" className={styles.sectionHeader}>
              <span className="kicker">{t.beforeAfterKicker}</span>
              <h2>{t.beforeAfterTitle}</h2>
              <p>{t.beforeAfterSubtitle}</p>
            </Reveal>

            <div className={styles.beforeAfterGrid}>
              {beforeAfterCases.map((item, i) => (
                <Reveal as="div" key={item.id} delay={i * 120} className={styles.beforeAfterItem}>
                  <BeforeAfterSlider
                    beforeSrc={item.before_image}
                    afterSrc={item.after_image}
                    beforeLabel={tBeforeAfter.before}
                    afterLabel={tBeforeAfter.after}
                    compareLabel={tBeforeAfter.compareLabel}
                    alt={item.title}
                  />
                  <h3 className={styles.beforeAfterCaption}>{item.title}</h3>
                </Reveal>
              ))}
            </div>

            <div className={styles.sectionFooterLink}>
              <Button href={href("/once-sonra")} variant="outline">{t.viewAllBeforeAfter}</Button>
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section-padding bg-surface" id="testimonials">
          <div className="container">
            <Reveal as="div" className={styles.sectionHeader}>
              <span className="kicker">{t.testimonialsKicker}</span>
              <h2>{t.testimonialsTitle}</h2>
              <p>{t.testimonialsSubtitle}</p>
            </Reveal>
            <div className={styles.testimonialsGrid}>
              {testimonials.map((item, i) => (
                <Reveal as="figure" key={item.id} delay={(i % 3) * 90} className={styles.testimonialCard}>
                  <div className={styles.testimonialStars} aria-label={`${item.rating} / 5`}>
                    {'★'.repeat(item.rating)}{'☆'.repeat(Math.max(0, 5 - item.rating))}
                  </div>
                  <blockquote>{item.text}</blockquote>
                  <figcaption>{item.patient_name}</figcaption>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {galleryImages.length > 0 && (
        <section className="section-padding bg-alt">
          <div className="container">
            <Reveal as="div" className={styles.sectionHeader}>
              <span className="kicker">{t.galleryKicker}</span>
              <h2>{t.galleryTitle}</h2>
              <p>{t.gallerySubtitle}</p>
            </Reveal>

            <div className={styles.galleryMosaic}>
              {galleryImages.map((img, i) => (
                <Reveal as="div" key={img.id} delay={i * 60} className={styles.galleryMosaicItem}>
                  <Link href={href("/galeri")} className={styles.galleryMosaicLink}>
                    <img src={img.image_url} alt={img.title} />
                  </Link>
                </Reveal>
              ))}
            </div>

            <div className={styles.sectionFooterLink}>
              <Button href={href("/galeri")} variant="outline">{t.viewGallery}</Button>
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
