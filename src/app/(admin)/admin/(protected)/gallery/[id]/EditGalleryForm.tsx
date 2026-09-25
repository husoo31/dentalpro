"use client";
import { useState } from "react";
import { updateGallery } from "@/lib/actions/gallery";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import shared from "../../admin-shared.module.css";
import form from "../../admin-form.module.css";
import type { Locale, dictionaries } from "@/lib/i18n/admin-dictionary";

type Dict = (typeof dictionaries)[Locale];
type Gallery = { id: string; title: string; category: string | null; image_url: string };

export default function EditGalleryForm({ t, item }: { t: Dict; item: Gallery }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData);

    const res = await updateGallery(item.id, data);
    if (res.error) {
      setError(typeof res.error === "string" ? res.error : "Validation error");
    } else {
      router.push("/admin/gallery");
    }
    setLoading(false);
  };

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.gallery.editTitle}</h1>
      </div>
      <div className={form.wrapper}>
        {error && <div className={form.errorBanner} role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className={form.form}>
          <div className={form.fieldGroup}>
            <label htmlFor="title">{t.gallery.titleField}</label>
            <input id="title" name="title" defaultValue={item.title} required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="category">{t.gallery.category}</label>
            <input id="category" name="category" defaultValue={item.category || ""} required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="image_url">{t.gallery.imageUrl}</label>
            <input id="image_url" name="image_url" defaultValue={item.image_url} required />
          </div>
          <div className={form.actionsRow}>
            <Button type="submit" disabled={loading}>
              {loading ? t.common.saving : t.common.save}
            </Button>
            <Button href="/admin/gallery" variant="outline">{t.common.cancel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
