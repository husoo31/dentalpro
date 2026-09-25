import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions/blog";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ConfirmSubmitButton from "@/components/ui/ConfirmSubmitButton";
import shared from "../admin-shared.module.css";
import { publishedBadge } from "../badges";
import { getDictionary } from "@/lib/i18n/admin-server";
import { formatMessage } from "@/lib/i18n/admin-dictionary";

export default async function PostPage() {
  const items = await prisma.post.findMany();
  const { t } = await getDictionary();

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.blog.title}</h1>
        <Button href="/admin/blog/new" variant="primary">{t.common.addNew}</Button>
      </div>

      <div className={shared.panel}>
        {items.length === 0 ? (
          <div className={shared.emptyState}>{t.blog.empty}</div>
        ) : (
          <div className={shared.tableWrapper}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>{t.blog.colTitle}</th><th>{t.blog.colSlug}</th><th>{t.blog.colStatus}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => {
                  const badge = publishedBadge(item.is_published, t.common);
                  return (
                    <tr key={item.id}>
                      <td data-label={t.blog.colTitle}>{String(item.title)}</td>
                      <td data-label={t.blog.colSlug}>{String(item.slug)}</td>
                      <td data-label={t.blog.colStatus}><span className={`${shared.badge} ${shared[badge.variant]}`}>{badge.label}</span></td>
                      <td data-label={t.common.actions}>
                        <div className={shared.actionsCell}>
                          <Link href={`/admin/blog/${item.id}`} className={shared.editLink}>{t.common.edit}</Link>
                          <form action={async () => {
                            "use server";
                            await deletePost(item.id);
                          }}>
                            <ConfirmSubmitButton confirmMessage={formatMessage(t.common.deleteConfirm, { name: item.title })}>
                              {t.common.delete}
                            </ConfirmSubmitButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
