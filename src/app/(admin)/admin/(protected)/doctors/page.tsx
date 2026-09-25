import { prisma } from "@/lib/prisma";
import { deleteDoctor } from "@/lib/actions/doctors";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ConfirmSubmitButton from "@/components/ui/ConfirmSubmitButton";
import shared from "../admin-shared.module.css";
import { activeBadge } from "../badges";
import { getDictionary } from "@/lib/i18n/admin-server";
import { formatMessage } from "@/lib/i18n/admin-dictionary";

export default async function DoctorPage() {
  const items = await prisma.doctor.findMany();
  const { t } = await getDictionary();

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.doctors.title}</h1>
        <Button href="/admin/doctors/new" variant="primary">{t.common.addNew}</Button>
      </div>

      <div className={shared.panel}>
        {items.length === 0 ? (
          <div className={shared.emptyState}>{t.doctors.empty}</div>
        ) : (
          <div className={shared.tableWrapper}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>{t.doctors.colFullName}</th><th>{t.doctors.colTitle}</th><th>{t.doctors.colSlug}</th><th>{t.doctors.colStatus}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => {
                  const badge = activeBadge(item.is_active, t.common);
                  return (
                    <tr key={item.id}>
                      <td data-label={t.doctors.colFullName}>{String(item.full_name)}</td>
                      <td data-label={t.doctors.colTitle}>{String(item.title)}</td>
                      <td data-label={t.doctors.colSlug}>{String(item.slug)}</td>
                      <td data-label={t.doctors.colStatus}><span className={`${shared.badge} ${shared[badge.variant]}`}>{badge.label}</span></td>
                      <td data-label={t.common.actions}>
                        <div className={shared.actionsCell}>
                          <Link href={`/admin/doctors/${item.id}`} className={shared.editLink}>{t.common.edit}</Link>
                          <form action={async () => {
                            "use server";
                            await deleteDoctor(item.id);
                          }}>
                            <ConfirmSubmitButton confirmMessage={formatMessage(t.common.deleteConfirm, { name: item.full_name })}>
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
