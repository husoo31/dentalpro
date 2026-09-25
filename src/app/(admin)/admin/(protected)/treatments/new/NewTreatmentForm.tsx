"use client";
import { useState } from "react";
import { createTreatment } from "@/lib/actions/treatments";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import shared from "../../admin-shared.module.css";
import form from "../../admin-form.module.css";
import type { Locale, dictionaries } from "@/lib/i18n/admin-dictionary";

type Dict = (typeof dictionaries)[Locale];

export default function NewTreatmentForm({ t }: { t: Dict }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data: any = Object.fromEntries(formData);

    if (data.rating) data.rating = parseInt(data.rating as string);
    if (data.sort_order) data.sort_order = parseInt(data.sort_order as string);

    const res = await createTreatment(data);
    if (res.error) {
      setError(typeof res.error === 'string' ? res.error : "Validation error");
    } else {
      router.push("/admin/treatments");
    }
    setLoading(false);
  };

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.treatments.newTitle}</h1>
      </div>
      <div className={form.wrapper}>
        {error && <div className={form.errorBanner} role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className={form.form}>
          <div className={form.fieldGroup}>
            <label htmlFor="name">{t.treatments.name}</label>
            <input id="name" name="name" required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="slug">{t.treatments.slug}</label>
            <input id="slug" name="slug" required />
            <span className={form.hint}>{t.treatments.slugHint}</span>
          </div>
          <div className={form.actionsRow}>
            <Button type="submit" disabled={loading}>
              {loading ? t.common.saving : t.common.save}
            </Button>
            <Button href="/admin/treatments" variant="outline">{t.common.cancel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
