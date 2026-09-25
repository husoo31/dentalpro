"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import Button from '../ui/Button';
import PublicLocaleSwitcher from './PublicLocaleSwitcher';
import { localizePath, publicDictionaries, stripLocalePrefix, type PublicLocale } from '@/lib/i18n/public-dictionary';

export default function Navbar({ settings, locale }: { settings: Record<string, string>; locale: PublicLocale }) {
  const t = publicDictionaries[locale].nav;
  const href = (path: string) => localizePath(locale, path);
  const [scrolled, setScrolled] = useState(false);
  // Only the homepage has a full-bleed image hero; inner pages get the solid, readable header.
  const isHome = stripLocalePrefix(usePathname() || '/') === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled || !isHome ? styles.scrolled : ''}`}>
      <div className={`container ${styles.nav}`}>
        <Link href={href("/")} className={styles.logo}>
          {settings.logo ? (
            <img src={settings.logo} alt={settings.clinicName || "Logo"} style={{ height: "40px" }} />
          ) : (
            <>{settings.clinicName || "DentalPro"}<span className="text-accent">.</span></>
          )}
        </Link>
        <div className={styles.links}>
          <Link href={href("/tedaviler")} className={styles.link}>{t.treatments}</Link>
          <Link href={href("/doktorlar")} className={styles.link}>{t.specialists}</Link>
          <Link href={href("/galeri")} className={styles.link}>{t.gallery}</Link>
        </div>
        <div className={styles.actions}>
          <span className={styles.phone}>{settings.phone}</span>
          <PublicLocaleSwitcher locale={locale} label={t.language} />
          <Button href={href("/randevu")} variant="primary" className={styles.cta}>{t.bookAppointment}</Button>
        </div>
      </div>
    </header>
  );
}
