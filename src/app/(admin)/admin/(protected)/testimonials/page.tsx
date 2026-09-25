import { prisma } from "@/lib/prisma";
import { deleteTestimonial } from "@/lib/actions/testimonials";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ConfirmSubmitButton from "@/components/ui/ConfirmSubmitButton";
import shared from "../admin-shared.module.css";
import { getDictionary } from "@/lib/i18n/admin-server";
import { formatMessage } from "@/lib/i18n/admin-dictionary";

export default async function TestimonialPage() {
  const items = await prisma.testimonial.findMany();
  const { t } = await getDictionary();

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.testimonials.title}</h1>
        <Button href="/admin/testimonials/new" variant="primary">{t.common.addNew}</Button>
      </div>

      <div className={shared.panel}>
        {items.length === 0 ? (
          <div className={shared.emptyState}>{t.testimonials.empty}</div>
        ) : (
          <div className={shared.tableWrapper}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>{t.testimonials.colPatientName}</th><th>{t.testimonials.colText}</th><th>{t.testimonials.colRating}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id}>
                    <td data-label={t.testimonials.colPatientName}>{String(item.patient_name)}</td>
                    <td data-label={t.testimonials.colText}>{String(item.text)}</td>
                    <td data-label={t.testimonials.colRating}>{String(item.rating)}</td>
                    <td data-label={t.common.actions}>
                      <div className={shared.actionsCell}>
                        <Link href={`/admin/testimonials/${item.id}`} className={shared.editLink}>{t.common.edit}</Link>
                        <form action={async () => {
                          "use server";
                          await deleteTestimonial(item.id);
                        }}>
                          <ConfirmSubmitButton confirmMessage={formatMessage(t.common.deleteConfirm, { name: item.patient_name })}>
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
