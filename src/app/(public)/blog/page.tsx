import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { buildPageMetadata, getPublicLocale } from "@/lib/i18n/public-server";
import { publicDictionaries } from "@/lib/i18n/public-dictionary";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = publicDictionaries[await getPublicLocale()].blog;
  return buildPageMetadata("/blog", t.title, t.subtitle);
}

export default async function BlogPage() {
  const t = publicDictionaries[await getPublicLocale()].blog;
  const posts = await prisma.post.findMany({
    where: { is_published: true },
    orderBy: { published_at: 'desc' },
  });

  return (
    <section className="section-padding container">
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
        <h1>{t.title}</h1>
        <p style={{ maxWidth: "600px", margin: "0 auto" }}>{t.subtitle}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--spacing-8)" }}>
        {posts.length === 0 && <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-text-muted)" }}>{t.empty}</p>}
        {posts.map((post) => (
          <article key={post.id} style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
            <div style={{ height: "200px", background: "var(--color-surface-hover)" }}>
              {post.image_url && (
                <img src={post.image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )}
            </div>
            <div style={{ padding: "var(--spacing-5)" }}>
              {post.published_at && (
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "var(--spacing-2)" }}>
                  {new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(post.published_at)}
                </p>
              )}
              <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--spacing-2)" }}>{post.title}</h3>
              {post.summary && <p style={{ marginBottom: 0 }}>{post.summary}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
