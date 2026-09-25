import { prisma } from "@/lib/prisma";
import { deleteGallery } from "@/lib/actions/gallery";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ConfirmSubmitButton from "@/components/ui/ConfirmSubmitButton";
import shared from "../admin-shared.module.css";
import { getDictionary } from "@/lib/i18n/admin-server";
import { formatMessage } from "@/lib/i18n/admin-dictionary";

export default async function GalleryPage() {
  const items = await prisma.gallery.findMany();
  const { t } = await getDictionary();

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.gallery.title}</h1>
        <Button href="/admin/gallery/new" variant="primary">{t.common.addNew}</Button>
      </div>

      <div className={shared.panel}>
        {items.length === 0 ? (
          <div className={shared.emptyState}>{t.gallery.empty}</div>
        ) : (
          <div className={shared.tableWrapper}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>{t.gallery.colTitle}</th><th>{t.gallery.colCategory}</th><th>{t.gallery.colImage}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id}>
                    <td data-label={t.gallery.colTitle}>{String(item.title)}</td>
                    <td data-label={t.gallery.colCategory}>{String(item.category)}</td>
                    <td data-label={t.gallery.colImage}>{String(item.image_url)}</td>
                    <td data-label={t.common.actions}>
                      <div className={shared.actionsCell}>
                        <Link href={`/admin/gallery/${item.id}`} className={shared.editLink}>{t.common.edit}</Link>
                        <form action={async () => {
                          "use server";
                          await deleteGallery(item.id);
                        }}>
                          <ConfirmSubmitButton confirmMessage={formatMessage(t.common.deleteConfirm, { name: item.title })}>
                            {t.common.delete}
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
