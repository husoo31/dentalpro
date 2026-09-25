"use client";

import { useTransition } from "react";
import { setAdminLocale } from "@/lib/i18n/admin-actions";
import type { Locale } from "@/lib/i18n/admin-dictionary";
import styles from "./LocaleSwitcher.module.css";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      setAdminLocale(next);
    });
  };

  return (
    <div className={styles.switcher} role="group" aria-label="Language / Dil">
      <button
        type="button"
        className={`${styles.option} ${locale === "tr" ? styles.active : ""}`}
        onClick={() => handleSwitch("tr")}
        disabled={isPending}
        aria-pressed={locale === "tr"}
      >
        TR
      </button>
      <button
        type="button"
        className={`${styles.option} ${locale === "en" ? styles.active : ""}`}
        onClick={() => handleSwitch("en")}
        disabled={isPending}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
