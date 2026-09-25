import { prisma } from "@/lib/prisma";
import { deleteBeforeAfter } from "@/lib/actions/before-after";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ConfirmSubmitButton from "@/components/ui/ConfirmSubmitButton";
import shared from "../admin-shared.module.css";
import { getDictionary } from "@/lib/i18n/admin-server";
import { formatMessage } from "@/lib/i18n/admin-dictionary";

export default async function BeforeAfterPage() {
  const items = await prisma.beforeAfter.findMany();
  const { t } = await getDictionary();

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.beforeAfter.title}</h1>
        <Button href="/admin/before-after/new" variant="primary">{t.common.addNew}</Button>
      </div>

      <div className={shared.panel}>
        {items.length === 0 ? (
          <div className={shared.emptyState}>{t.beforeAfter.empty}</div>
        ) : (
          <div className={shared.tableWrapper}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>{t.beforeAfter.colTitle}</th><th>{t.beforeAfter.colBefore}</th><th>{t.beforeAfter.colAfter}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id}>
                    <td data-label={t.beforeAfter.colTitle}>{String(item.title)}</td>
                    <td data-label={t.beforeAfter.colBefore}>{String(item.before_image)}</td>
                    <td data-label={t.beforeAfter.colAfter}>{String(item.after_image)}</td>
                    <td data-label={t.common.actions}>
                      <div className={shared.actionsCell}>
                        <Link href={`/admin/before-after/${item.id}`} className={shared.editLink}>{t.common.edit}</Link>
                        <form action={async () => {
                          "use server";
                          await deleteBeforeAfter(item.id);
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
