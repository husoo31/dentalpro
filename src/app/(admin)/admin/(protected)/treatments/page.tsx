import { prisma } from "@/lib/prisma";
import { deleteTreatment } from "@/lib/actions/treatments";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ConfirmSubmitButton from "@/components/ui/ConfirmSubmitButton";
import shared from "../admin-shared.module.css";
import { activeBadge } from "../badges";
import { getDictionary } from "@/lib/i18n/admin-server";
import { formatMessage } from "@/lib/i18n/admin-dictionary";

export default async function TreatmentPage() {
  const items = await prisma.treatment.findMany();
  const { t } = await getDictionary();

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.treatments.title}</h1>
        <Button href="/admin/treatments/new" variant="primary">{t.common.addNew}</Button>
      </div>

      <div className={shared.panel}>
        {items.length === 0 ? (
          <div className={shared.emptyState}>{t.treatments.empty}</div>
        ) : (
          <div className={shared.tableWrapper}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>{t.treatments.colName}</th><th>{t.treatments.colSlug}</th><th>{t.treatments.colStatus}</th><th>{t.treatments.colSortOrder}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => {
                  const badge = activeBadge(item.is_active, t.common);
                  return (
                    <tr key={item.id}>
                      <td data-label={t.treatments.colName}>{String(item.name)}</td>
                      <td data-label={t.treatments.colSlug}>{String(item.slug)}</td>
                      <td data-label={t.treatments.colStatus}><span className={`${shared.badge} ${shared[badge.variant]}`}>{badge.label}</span></td>
                      <td data-label={t.treatments.colSortOrder}>{String(item.sort_order)}</td>
                      <td data-label={t.common.actions}>
                        <div className={shared.actionsCell}>
                          <Link href={`/admin/treatments/${item.id}`} className={shared.editLink}>{t.common.edit}</Link>
                          <form action={async () => {
                            "use server";
                            await deleteTreatment(item.id);
                          }}>
                            <ConfirmSubmitButton confirmMessage={formatMessage(t.common.deleteConfirm, { name: item.name })}>
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
