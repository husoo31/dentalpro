import styles from './Footer.module.css';
import Link from 'next/link';
import { localizePath, publicDictionaries, fillClinic, type PublicLocale } from '@/lib/i18n/public-dictionary';

export default function Footer({ settings, locale }: { settings: Record<string, string>; locale: PublicLocale }) {
  const t = publicDictionaries[locale].footer;
  const href = (path: string) => localizePath(locale, path);
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <h2 className={styles.logo}>
            {settings.logo ? (
              <img src={settings.logo} alt={settings.clinicName || "Logo"} style={{ height: "40px" }} />
            ) : (
              <>{settings.clinicName || "DentalPro"}<span className="text-accent">.</span></>
            )}
          </h2>
          <p className={styles.desc}>{settings.footerText || t.defaultDesc}</p>
        </div>
        <div className={styles.links}>
          <h3>{t.clinic}</h3>
          <Link href={href("/hakkimizda")}>{t.about}</Link>
          <Link href={href("/doktorlar")}>{t.specialists}</Link>
          <Link href={href("/galeri")}>{t.gallery}</Link>
          <Link href={href("/once-sonra")}>{t.beforeAfter}</Link>
        </div>
        <div className={styles.links}>
          <h3>{t.services}</h3>
          <Link href={href("/tedaviler")}>{t.allTreatments}</Link>
          <Link href={href("/randevu")}>{t.bookAppointment}</Link>
          <Link href={href("/blog")}>{t.blog}</Link>
          <Link href={href("/iletisim")}>{t.contact}</Link>
        </div>
        <div className={styles.contact}>
          <h3>{t.visitUs}</h3>
          <p>{settings.address || "123 Premium Dental Ave, NY 10001"}</p>
          <p>{settings.email || "hello@dentalpro.com"}<br/>{settings.phone || "+1 (555) 123-4567"}</p>
          {settings.whatsapp && <p>WhatsApp: {settings.whatsapp}</p>}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {settings.instagram && <a href={settings.instagram} target="_blank">IG</a>}
            {settings.facebook && <a href={settings.facebook} target="_blank">FB</a>}
            {settings.youtube && <a href={settings.youtube} target="_blank">YT</a>}
            {settings.linkedin && <a href={settings.linkedin} target="_blank">IN</a>}
          </div>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>&copy; {new Date().getFullYear()} {settings.clinicName || "DentalPro"}. {t.rights}</p>
      </div>
    </footer>
  );
}
