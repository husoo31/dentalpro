"use client";
import { useState } from "react";
import { updateTreatment } from "@/lib/actions/treatments";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import shared from "../../admin-shared.module.css";
import form from "../../admin-form.module.css";
import type { Locale, dictionaries } from "@/lib/i18n/admin-dictionary";

type Dict = (typeof dictionaries)[Locale];
type Treatment = { id: string; name: string; slug: string; is_active: boolean; sort_order: number };

export default function EditTreatmentForm({ t, treatment }: { t: Dict; treatment: Treatment }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData);
    data.is_active = formData.get("is_active") === "on";
    if (data.sort_order) data.sort_order = parseInt(data.sort_order as string);

    const res = await updateTreatment(treatment.id, data);
    if (res.error) {
      setError(typeof res.error === "string" ? res.error : "Validation error");
    } else {
      router.push("/admin/treatments");
    }
    setLoading(false);
  };

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.treatments.editTitle}</h1>
      </div>
      <div className={form.wrapper}>
        {error && <div className={form.errorBanner} role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className={form.form}>
          <div className={form.fieldGroup}>
            <label htmlFor="name">{t.treatments.name}</label>
            <input id="name" name="name" defaultValue={treatment.name} required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="slug">{t.treatments.slug}</label>
            <input id="slug" name="slug" defaultValue={treatment.slug} required />
            <span className={form.hint}>{t.treatments.slugHint}</span>
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="sort_order">{t.treatments.colSortOrder}</label>
            <input id="sort_order" name="sort_order" type="number" defaultValue={treatment.sort_order} />
          </div>
          <label className={form.checkboxRow}>
            <input type="checkbox" name="is_active" defaultChecked={treatment.is_active} />
            {t.common.active}
          </label>
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
