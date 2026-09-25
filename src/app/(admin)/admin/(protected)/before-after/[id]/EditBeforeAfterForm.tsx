"use client";
import { useState } from "react";
import { updateBeforeAfter } from "@/lib/actions/before-after";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import shared from "../../admin-shared.module.css";
import form from "../../admin-form.module.css";
import type { Locale, dictionaries } from "@/lib/i18n/admin-dictionary";

type Dict = (typeof dictionaries)[Locale];
type BeforeAfter = { id: string; title: string; before_image: string; after_image: string; is_active: boolean };

export default function EditBeforeAfterForm({ t, item }: { t: Dict; item: BeforeAfter }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData);
    data.is_active = formData.get("is_active") === "on";

    const res = await updateBeforeAfter(item.id, data);
    if (res.error) {
      setError(typeof res.error === "string" ? res.error : "Validation error");
    } else {
      router.push("/admin/before-after");
    }
    setLoading(false);
  };

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.beforeAfter.editTitle}</h1>
      </div>
      <div className={form.wrapper}>
        {error && <div className={form.errorBanner} role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className={form.form}>
          <div className={form.fieldGroup}>
            <label htmlFor="title">{t.beforeAfter.titleField}</label>
            <input id="title" name="title" defaultValue={item.title} required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="before_image">{t.beforeAfter.beforeImage}</label>
            <input id="before_image" name="before_image" defaultValue={item.before_image} required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="after_image">{t.beforeAfter.afterImage}</label>
            <input id="after_image" name="after_image" defaultValue={item.after_image} required />
          </div>
          <label className={form.checkboxRow}>
            <input type="checkbox" name="is_active" defaultChecked={item.is_active} />
            {t.common.active}
          </label>
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
