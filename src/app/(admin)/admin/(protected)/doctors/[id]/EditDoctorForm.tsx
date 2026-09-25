"use client";
import { useState } from "react";
import { updateDoctor } from "@/lib/actions/doctors";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import shared from "../../admin-shared.module.css";
import form from "../../admin-form.module.css";
import type { Locale, dictionaries } from "@/lib/i18n/admin-dictionary";

type Dict = (typeof dictionaries)[Locale];
type Doctor = { id: string; full_name: string; slug: string; title: string; is_active: boolean };

export default function EditDoctorForm({ t, doctor }: { t: Dict; doctor: Doctor }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData);
    data.is_active = formData.get("is_active") === "on";

    const res = await updateDoctor(doctor.id, data);
    if (res.error) {
      setError(typeof res.error === "string" ? res.error : "Validation error");
    } else {
      router.push("/admin/doctors");
    }
    setLoading(false);
  };

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.doctors.editTitle}</h1>
      </div>
      <div className={form.wrapper}>
        {error && <div className={form.errorBanner} role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className={form.form}>
          <div className={form.fieldGroup}>
            <label htmlFor="full_name">{t.doctors.fullName}</label>
            <input id="full_name" name="full_name" defaultValue={doctor.full_name} required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="slug">{t.doctors.slug}</label>
            <input id="slug" name="slug" defaultValue={doctor.slug} required />
            <span className={form.hint}>{t.doctors.slugHint}</span>
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="title">{t.doctors.titleField}</label>
            <input id="title" name="title" defaultValue={doctor.title} required placeholder={t.doctors.titlePlaceholder} />
          </div>
          <label className={form.checkboxRow}>
            <input type="checkbox" name="is_active" defaultChecked={doctor.is_active} />
            {t.common.active}
          </label>
          <div className={form.actionsRow}>
            <Button type="submit" disabled={loading}>
              {loading ? t.common.saving : t.common.save}
            </Button>
            <Button href="/admin/doctors" variant="outline">{t.common.cancel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
