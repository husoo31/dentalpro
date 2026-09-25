const fs = require('fs');
const path = require('path');

const models = [
  { name: 'Treatment', route: 'treatments', title: 'Tedaviler', fields: ['name', 'slug', 'is_active', 'sort_order'] },
  { name: 'Doctor', route: 'doctors', title: 'Doktorlar', fields: ['full_name', 'slug', 'title', 'is_active'] },
  { name: 'Post', route: 'blog', title: 'Blog', fields: ['title', 'slug', 'is_published'] },
  { name: 'Gallery', route: 'gallery', title: 'Galeri', fields: ['title', 'category', 'image_url'] },
  { name: 'Testimonial', route: 'testimonials', title: 'Hasta Yorumları', fields: ['patient_name', 'text', 'rating'] },
  { name: 'BeforeAfter', route: 'before-after', title: 'Öncesi/Sonrası', fields: ['title', 'before_image', 'after_image'] }
];

const libDir = path.join(__dirname, '../src/lib/actions');
fs.mkdirSync(libDir, { recursive: true });

for (const model of models) {
  const actionContent = `"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function create${model.name}(data: any) {
  try {
    await prisma.${model.name.toLowerCase()}.create({ data });
    revalidatePath("/admin/${model.route}");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function update${model.name}(id: string, data: any) {
  try {
    await prisma.${model.name.toLowerCase()}.update({ where: { id }, data });
    revalidatePath("/admin/${model.route}");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function delete${model.name}(id: string) {
  try {
    await prisma.${model.name.toLowerCase()}.delete({ where: { id } });
    revalidatePath("/admin/${model.route}");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
`;
  fs.writeFileSync(path.join(libDir, `${model.route}.ts`), actionContent);

  const routeDir = path.join(__dirname, `../src/app/(admin)/admin/(protected)/${model.route}`);
  fs.mkdirSync(routeDir, { recursive: true });

  const pageContent = `import { prisma } from "@/lib/prisma";
import { delete${model.name} } from "@/lib/actions/${model.route}";
import Link from "next/link";
import styles from "../dashboard.module.css";

export default async function ${model.name}Page() {
  const items = await prisma.${model.name.toLowerCase()}.findMany();

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className={styles.title}>${model.title}</h1>
        <Link href="/admin/${model.route}/new" className="button primary">Yeni Ekle</Link>
      </div>
      
      <div className={styles.recentSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                ${model.fields.map(f => `<th>${f}</th>`).join('')}
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id}>
                  ${model.fields.map(f => `<td>{String(item['${f}'])}</td>`).join('')}
                  <td>
                    <Link href={\`/admin/${model.route}/\${item.id}\`} style={{ marginRight: 10, color: 'blue' }}>Düzenle</Link>
                    <form action={async () => {
                      "use server";
                      await delete${model.name}(item.id);
                    }} style={{ display: 'inline' }}>
                      <button type="submit" style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Sil</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(routeDir, `page.tsx`), pageContent);
}

console.log("Scaffolding complete.");
