"use client";

import { usePathname } from "next/navigation";
import {
  PUBLIC_LOCALE_COOKIE,
  localizePath,
  publicLocales,
  stripLocalePrefix,
  type PublicLocale,
} from "@/lib/i18n/public-dictionary";
import styles from "./PublicLocaleSwitcher.module.css";

export default function PublicLocaleSwitcher({ locale, label }: { locale: PublicLocale; label: string }) {
  const pathname = usePathname() || "/";
  const basePath = stripLocalePrefix(pathname);

  const remember = (next: PublicLocale) => {
    document.cookie = `${PUBLIC_LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  };

  // Plain anchors on purpose: a full navigation avoids the client router reusing the other
  // locale's rewritten page segment.
  return (
    <div className={styles.switcher} role="group" aria-label={label}>
      {publicLocales.map((l) => (
        <a
          key={l}
          href={localizePath(l, basePath)}
          hrefLang={l}
          lang={l}
          className={`${styles.option} ${l === locale ? styles.active : ""}`}
          aria-current={l === locale ? "true" : undefined}
          onClick={() => remember(l)}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
