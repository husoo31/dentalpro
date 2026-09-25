"use client";
import { useState } from "react";
import { updateTestimonial } from "@/lib/actions/testimonials";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import shared from "../../admin-shared.module.css";
import form from "../../admin-form.module.css";
import type { Locale, dictionaries } from "@/lib/i18n/admin-dictionary";

type Dict = (typeof dictionaries)[Locale];
type Testimonial = { id: string; patient_name: string; text: string; rating: number };

export default function EditTestimonialForm({ t, item }: { t: Dict; item: Testimonial }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData);
    if (data.rating) data.rating = parseInt(data.rating as string);

    const res = await updateTestimonial(item.id, data);
    if (res.error) {
      setError(typeof res.error === "string" ? res.error : "Validation error");
    } else {
      router.push("/admin/testimonials");
    }
    setLoading(false);
  };

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.testimonials.editTitle}</h1>
      </div>
      <div className={form.wrapper}>
        {error && <div className={form.errorBanner} role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className={form.form}>
          <div className={form.fieldGroup}>
            <label htmlFor="patient_name">{t.testimonials.patientName}</label>
            <input id="patient_name" name="patient_name" defaultValue={item.patient_name} required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="text">{t.testimonials.text}</label>
            <input id="text" name="text" defaultValue={item.text} required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="rating">{t.testimonials.rating}</label>
            <input id="rating" name="rating" type="number" min={1} max={5} defaultValue={item.rating} required />
          </div>
          <div className={form.actionsRow}>
            <Button type="submit" disabled={loading}>
              {loading ? t.common.saving : t.common.save}
            </Button>
            <Button href="/admin/testimonials" variant="outline">{t.common.cancel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
