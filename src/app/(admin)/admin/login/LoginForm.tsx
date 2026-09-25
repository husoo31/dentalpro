"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import styles from "./login.module.css";
import type { Locale, dictionaries } from "@/lib/i18n/admin-dictionary";

type Dict = (typeof dictionaries)[Locale];

export default function LoginForm({ t, locale }: { t: Dict; locale: Locale }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(t.login.invalidCredentials);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.localeRow}>
        <LocaleSwitcher locale={locale} />
      </div>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>{t.login.title}</h1>
        <p className={styles.subtitle}>{t.login.subtitle}</p>

        {error && <div className={styles.error} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">{t.login.email}</label>
            <input type="email" id="email" name="email" required placeholder="admin@dentalpro.com" />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">{t.login.password}</label>
            <input type="password" id="password" name="password" required />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? t.login.submitting : t.login.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
