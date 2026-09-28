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
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || '/';
  // Only the homepage has a full-bleed image hero; inner pages get the solid, readable header.
  const isHome = stripLocalePrefix(pathname) === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the drawer on navigation and on viewport resize past the mobile breakpoint.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className={`${styles.header} ${scrolled || !isHome || mobileOpen ? styles.scrolled : ''}`}>
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
          <div className={styles.desktopActions}>
            <span className={styles.phone}>{settings.phone}</span>
            <PublicLocaleSwitcher locale={locale} label={t.language} />
            <Button href={href("/randevu")} variant="primary" className={styles.cta}>{t.bookAppointment}</Button>
          </div>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? t.closeMenu : t.openMenu}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className={`${styles.menuIcon} ${mobileOpen ? styles.menuIconOpen : ''}`} />
          </button>
        </div>
      </div>
      <div
        id="mobile-nav-menu"
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}
      >
        <Link href={href("/tedaviler")} className={styles.mobileLink}>{t.treatments}</Link>
        <Link href={href("/doktorlar")} className={styles.mobileLink}>{t.specialists}</Link>
        <Link href={href("/galeri")} className={styles.mobileLink}>{t.gallery}</Link>
        {settings.phone && <span className={styles.mobilePhone}>{settings.phone}</span>}
        <PublicLocaleSwitcher locale={locale} label={t.language} />
        <Button href={href("/randevu")} variant="primary" className={styles.mobileCta}>{t.bookAppointment}</Button>
      </div>
    </header>
  );
}
