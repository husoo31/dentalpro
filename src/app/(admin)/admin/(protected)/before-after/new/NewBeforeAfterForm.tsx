"use client";
import { useState } from "react";
import { createBeforeAfter } from "@/lib/actions/before-after";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import shared from "../../admin-shared.module.css";
import form from "../../admin-form.module.css";
import type { Locale, dictionaries } from "@/lib/i18n/admin-dictionary";

type Dict = (typeof dictionaries)[Locale];

export default function NewBeforeAfterForm({ t }: { t: Dict }) {
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

    const res = await createBeforeAfter(data);
    if (res.error) {
      setError(typeof res.error === 'string' ? res.error : "Validation error");
    } else {
      router.push("/admin/before-after");
    }
    setLoading(false);
  };

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.beforeAfter.newTitle}</h1>
      </div>
      <div className={form.wrapper}>
        {error && <div className={form.errorBanner} role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className={form.form}>
          <div className={form.fieldGroup}>
            <label htmlFor="title">{t.beforeAfter.titleField}</label>
            <input id="title" name="title" required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="before_image">{t.beforeAfter.beforeImage}</label>
            <input id="before_image" name="before_image" required placeholder="/uploads/before-1.jpg" />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="after_image">{t.beforeAfter.afterImage}</label>
            <input id="after_image" name="after_image" required placeholder="/uploads/after-1.jpg" />
          </div>
          <div className={form.actionsRow}>
            <Button type="submit" disabled={loading}>
              {loading ? t.common.saving : t.common.save}
            </Button>
            <Button href="/admin/before-after" variant="outline">{t.common.cancel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
