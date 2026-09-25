const fs = require('fs');
const path = require('path');

const models = [
  { name: 'Treatment', route: 'treatments', title: 'Tedavi', fields: ['name', 'slug'] },
  { name: 'Doctor', route: 'doctors', title: 'Doktor', fields: ['full_name', 'slug', 'title'] },
  { name: 'Post', route: 'blog', title: 'Blog Yazısı', fields: ['title', 'slug'] },
  { name: 'Gallery', route: 'gallery', title: 'Galeri Görseli', fields: ['title', 'category', 'image_url'] },
  { name: 'Testimonial', route: 'testimonials', title: 'Hasta Yorumu', fields: ['patient_name', 'text', 'rating'] },
  { name: 'BeforeAfter', route: 'before-after', title: 'Öncesi/Sonrası', fields: ['title', 'before_image', 'after_image'] }
];

for (const model of models) {
  const newDir = path.join(__dirname, `../src/app/(admin)/admin/(protected)/${model.route}/new`);
  fs.mkdirSync(newDir, { recursive: true });

  const formContent = `"use client";
import { useState } from "react";
import { create${model.name} } from "@/lib/actions/${model.route}";
import { useRouter } from "next/navigation";

export default function New${model.name}Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Convert numeric fields if needed
    if (data.rating) data.rating = parseInt(data.rating as string);
    if (data.sort_order) data.sort_order = parseInt(data.sort_order as string);

    const res = await create${model.name}(data);
    if (res.error) {
      setError(typeof res.error === 'string' ? res.error : "Validation error");
    } else {
      router.push("/admin/${model.route}");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Yeni ${model.title} Ekle</h1>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        ${model.fields.map(f => `
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>${f}</label>
          <input name="${f}" required style={{ padding: "0.5rem" }} />
        </div>`).join('')}
        <button type="submit" disabled={loading} style={{ padding: "0.5rem", background: "blue", color: "white" }}>
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(newDir, `page.tsx`), formContent);
}

console.log("Forms scaffolded successfully.");
