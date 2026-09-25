"use client";
import { useState } from "react";
import { updatePost } from "@/lib/actions/blog";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import shared from "../../admin-shared.module.css";
import form from "../../admin-form.module.css";
import type { Locale, dictionaries } from "@/lib/i18n/admin-dictionary";

type Dict = (typeof dictionaries)[Locale];
type Post = { id: string; title: string; slug: string; content: string; is_published: boolean };

export default function EditPostForm({ t, post }: { t: Dict; post: Post }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData);
    data.is_published = formData.get("is_published") === "on";

    const res = await updatePost(post.id, data);
    if (res.error) {
      setError(typeof res.error === "string" ? res.error : "Validation error");
    } else {
      router.push("/admin/blog");
    }
    setLoading(false);
  };

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.blog.editTitle}</h1>
      </div>
      <div className={form.wrapper}>
        {error && <div className={form.errorBanner} role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className={form.form}>
          <div className={form.fieldGroup}>
            <label htmlFor="title">{t.blog.titleField}</label>
            <input id="title" name="title" defaultValue={post.title} required />
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="slug">{t.blog.slug}</label>
            <input id="slug" name="slug" defaultValue={post.slug} required />
            <span className={form.hint}>{t.blog.slugHint}</span>
          </div>
          <div className={form.fieldGroup}>
            <label htmlFor="content">{t.blog.content}</label>
            <textarea id="content" name="content" defaultValue={post.content} required />
          </div>
          <label className={form.checkboxRow}>
            <input type="checkbox" name="is_published" defaultChecked={post.is_published} />
            {t.common.published}
          </label>
          <div className={form.actionsRow}>
            <Button type="submit" disabled={loading}>
              {loading ? t.common.saving : t.common.save}
            </Button>
            <Button href="/admin/blog" variant="outline">{t.common.cancel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
