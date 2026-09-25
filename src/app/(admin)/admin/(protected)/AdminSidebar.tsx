"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import type { Locale } from "@/lib/i18n/admin-dictionary";
import styles from "./admin-layout.module.css";

interface AdminSidebarProps {
  displayName: string;
  initial: string;
  locale: Locale;
  nav: {
    dashboard: string;
    appointments: string;
    treatments: string;
    doctors: string;
    blog: string;
    gallery: string;
    beforeAfter: string;
    testimonials: string;
    settings: string;
    logout: string;
    openMenu: string;
    closeMenu: string;
  };
}

export default function AdminSidebar({ displayName, initial, locale, nav }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const items = [
    { href: "/admin", label: nav.dashboard, exact: true },
    { href: "/admin/appointments", label: nav.appointments },
    { href: "/admin/treatments", label: nav.treatments },
    { href: "/admin/doctors", label: nav.doctors },
    { href: "/admin/blog", label: nav.blog },
    { href: "/admin/gallery", label: nav.gallery },
    { href: "/admin/before-after", label: nav.beforeAfter },
    { href: "/admin/testimonials", label: nav.testimonials },
    { href: "/admin/settings", label: nav.settings },
  ];

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC to close, trap Tab inside the drawer while open, restore focus on close.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      hamburgerRef.current?.focus();
    };
  }, [open]);

  const navList = (onNavigate?: () => void) => (
    <nav className={styles.nav}>
      {items.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname?.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const userBlock = (
    <div className={styles.user}>
      <div className={styles.userRow}>
        <div className={styles.userAvatar} aria-hidden="true">{initial}</div>
        <p className={styles.userName} title={displayName}>{displayName}</p>
      </div>
      <div className={styles.userFooterRow}>
        <Link href="/api/auth/signout" className={styles.logout}>{nav.logout}</Link>
        <LocaleSwitcher locale={locale} />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className={styles.mobileTopBar}>
        <span className={styles.logo}>DentalPro</span>
        <button
          ref={hamburgerRef}
          type="button"
          className={styles.hamburger}
          aria-label={nav.openMenu}
          aria-expanded={open}
          aria-controls="admin-mobile-drawer"
          onClick={() => setOpen(true)}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </header>

      {/* Desktop static sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>DentalPro</div>
        {navList()}
        {userBlock}
      </aside>

      {/* Mobile drawer + backdrop */}
      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        id="admin-mobile-drawer"
        ref={drawerRef}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={nav.dashboard}
        aria-hidden={!open}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.logo}>DentalPro</span>
          <button
            ref={closeRef}
            type="button"
            className={styles.drawerCloseButton}
            aria-label={nav.closeMenu}
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
        {navList(() => setOpen(false))}
        {userBlock}
      </aside>
    </>
  );
}
