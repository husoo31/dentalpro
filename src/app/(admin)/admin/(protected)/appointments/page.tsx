import { prisma } from "@/lib/prisma";
import { updateAppointmentStatus } from "@/lib/actions/appointments";
import shared from "../admin-shared.module.css";
import filterStyles from "./appointments.module.css";
import { format } from "date-fns";
import Button from "@/components/ui/Button";
import ConfirmSubmitButton from "@/components/ui/ConfirmSubmitButton";
import { appointmentStatusBadge } from "../badges";
import { getDictionary } from "@/lib/i18n/admin-server";
import { formatMessage } from "@/lib/i18n/admin-dictionary";

export default async function AppointmentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const VALID_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"] as const;
  const activeStatus = VALID_STATUSES.find((s) => s === status);
  const where = activeStatus ? { status: activeStatus } : {};
  const { t } = await getDictionary();

  const appointments = await prisma.appointment.findMany({
    where,
    include: { treatment: true },
    orderBy: { created_at: 'desc' }
  });

  const filters = [
    { label: t.appointments.filterAll, value: undefined },
    { label: t.appointments.filterPending, value: "PENDING" },
    { label: t.appointments.filterConfirmed, value: "CONFIRMED" },
    { label: t.appointments.filterCancelled, value: "CANCELLED" },
  ];

  const emptyMessage =
    status === 'PENDING' ? t.appointments.emptyPending :
    status === 'CONFIRMED' ? t.appointments.emptyConfirmed :
    status === 'CANCELLED' ? t.appointments.emptyCancelled :
    t.appointments.emptyAll;

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <h1 className={shared.title}>{t.appointments.title}</h1>
      </div>

      <div className={filterStyles.filterRow} aria-label={t.appointments.title}>
        {filters.map((f) => {
          const isActive = (status ?? undefined) === f.value;
          const href = f.value ? `/admin/appointments?status=${f.value}` : "/admin/appointments";
          return (
            <Button
              key={f.label}
              href={href}
              variant={isActive ? "primary" : "outline"}
              size="sm"
              aria-current={isActive ? "page" : undefined}
            >
              {f.label}
            </Button>
          );
        })}
      </div>

      <div className={shared.panel}>
        {appointments.length === 0 ? (
          <div className={shared.emptyState}>
            <svg className={shared.emptyIcon} width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className={shared.tableWrapper}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>{t.appointments.colDate}</th>
                  <th>{t.appointments.colPatient}</th>
                  <th>{t.appointments.colPhone}</th>
                  <th>{t.appointments.colTreatment}</th>
                  <th>{t.appointments.colStatus}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => {
                  const badge = appointmentStatusBadge(app.status, t.appointmentStatus);
                  return (
                    <tr key={app.id}>
                      <td data-label={t.appointments.colDate}>{format(app.desired_date, 'dd.MM.yyyy HH:mm')}</td>
                      <td data-label={t.appointments.colPatient}>{app.patient_name}</td>
                      <td data-label={t.appointments.colPhone}>{app.phone}</td>
                      <td data-label={t.appointments.colTreatment}>{app.treatment?.name || '-'}</td>
                      <td data-label={t.appointments.colStatus}>
                        <span className={`${shared.badge} ${shared[badge.variant]}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td data-label={t.common.actions}>
                        <div className={shared.actionsCell}>
                          {app.status === 'PENDING' && (
                            <form action={async () => {
                              "use server";
                              await updateAppointmentStatus(app.id, 'CONFIRMED');
                            }}>
                              <button type="submit" className={filterStyles.confirmAction}>{t.appointments.confirm}</button>
                            </form>
                          )}
                          {app.status !== 'CANCELLED' && (
                            <form action={async () => {
                              "use server";
                              await updateAppointmentStatus(app.id, 'CANCELLED');
                            }}>
                              <ConfirmSubmitButton
                                confirmMessage={formatMessage(t.appointments.cancelConfirm, { name: app.patient_name })}
                                variant="danger"
                                size="sm"
                              >
                                {t.appointments.cancelAppointment}
                              </ConfirmSubmitButton>
                            </form>
                          )}
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
