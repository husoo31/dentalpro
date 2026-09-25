import { prisma } from "@/lib/prisma";
import Link from "next/link";
import shared from "./admin-shared.module.css";
import styles from "./dashboard.module.css";
import { format } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import { appointmentStatusBadge } from "./badges";
import { getDictionary } from "@/lib/i18n/admin-server";

export default async function AdminDashboard() {
  const { locale, t } = await getDictionary();
  const dateLocale = locale === "tr" ? tr : enUS;

  const [
    totalAppointments,
    pendingAppointments,
    totalTreatments,
    totalPosts,
    activeDoctors,
    galleryItems,
    recentAppointments
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: 'PENDING' } }),
    prisma.treatment.count({ where: { is_active: true } }),
    prisma.post.count({ where: { is_published: true } }),
    prisma.doctor.count({ where: { is_active: true } }),
    prisma.gallery.count(),
    prisma.appointment.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: { treatment: true }
    })
  ]);

  return (
    <div className={shared.container}>
      <header className={shared.pageHeader}>
        <div>
          <h1 className={shared.title}>{t.dashboard.welcomeTitle}</h1>
          <p className={shared.subtitle}>{t.dashboard.welcomeSubtitle}</p>
        </div>
      </header>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <h3>{t.dashboard.totalAppointments}</h3>
          </div>
          <p className={styles.kpiValue}>{totalAppointments}</p>
          <p className={styles.kpiTrend}>{t.dashboard.totalAppointmentsTrend}</p>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiHighlight}`}>
          <div className={styles.kpiHeader}>
            <h3>{t.dashboard.actionRequired}</h3>
          </div>
          <p className={styles.kpiValue}>{pendingAppointments}</p>
          <p className={styles.kpiTrend}>{t.dashboard.actionRequiredTrend}</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <h3>{t.dashboard.activeTreatments}</h3>
          </div>
          <p className={styles.kpiValue}>{totalTreatments}</p>
          <p className={styles.kpiTrend}>{t.dashboard.activeTreatmentsTrend}</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <h3>{t.dashboard.publishedArticles}</h3>
          </div>
          <p className={styles.kpiValue}>{totalPosts}</p>
          <p className={styles.kpiTrend}>{t.dashboard.publishedArticlesTrend}</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <h3>{t.dashboard.activeDoctors}</h3>
          </div>
          <p className={styles.kpiValue}>{activeDoctors}</p>
          <p className={styles.kpiTrend}>{t.dashboard.activeDoctorsTrend}</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <h3>{t.dashboard.galleryItems}</h3>
          </div>
          <p className={styles.kpiValue}>{galleryItems}</p>
          <p className={styles.kpiTrend}>{t.dashboard.galleryItemsTrend}</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainPanel}>
          <div className={styles.panelHeader}>
            <h2>{t.dashboard.recentAppointments}</h2>
            <Link href="/admin/appointments" className={styles.viewAllLink}>{t.dashboard.viewAll}</Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className={shared.emptyState}>{t.dashboard.noRecentAppointments}</div>
          ) : (
            <div className={shared.tableWrapper}>
              <table className={shared.table}>
                <thead>
                  <tr>
                    <th>{t.dashboard.colPatient}</th>
                    <th>{t.dashboard.colContact}</th>
                    <th>{t.dashboard.colDateTime}</th>
                    <th>{t.dashboard.colTreatment}</th>
                    <th>{t.dashboard.colStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map(app => {
                    const badge = appointmentStatusBadge(app.status, t.appointmentStatus);
                    return (
                      <tr key={app.id}>
                        <td data-label={t.dashboard.colPatient}>
                          <div className={styles.patientInfo}>
                            <div className={styles.avatar} aria-hidden="true">{app.patient_name.charAt(0).toUpperCase()}</div>
                            <span>{app.patient_name}</span>
                          </div>
                        </td>
                        <td data-label={t.dashboard.colContact}>{app.phone}</td>
                        <td data-label={t.dashboard.colDateTime}>{format(app.desired_date, 'd MMM yyyy HH:mm', { locale: dateLocale })}</td>
                        <td data-label={t.dashboard.colTreatment}>{app.treatment?.name || 'General'}</td>
                        <td data-label={t.dashboard.colStatus}>
                          <span className={`${shared.badge} ${shared[badge.variant]}`}>
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={styles.sidePanel}>
          <div className={styles.panelHeader}>
            <h2>{t.dashboard.quickActions}</h2>
          </div>
          <div className={styles.actionList}>
            <Link href="/admin/treatments/new" className={styles.actionCard}>
              <span className={styles.actionIcon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </span>
              <div className={styles.actionText}>
                <h4>{t.dashboard.addTreatmentTitle}</h4>
                <p>{t.dashboard.addTreatmentDesc}</p>
              </div>
              <span className={styles.actionChevron} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
            <Link href="/admin/blog/new" className={styles.actionCard}>
              <span className={styles.actionIcon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20h4L18 10l-4-4L4 16v4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
              </span>
              <div className={styles.actionText}>
                <h4>{t.dashboard.writeBlogTitle}</h4>
                <p>{t.dashboard.writeBlogDesc}</p>
              </div>
              <span className={styles.actionChevron} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
            <Link href="/admin/before-after/new" className={styles.actionCard}>
              <span className={styles.actionIcon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><circle cx="9" cy="10" r="1.5" fill="currentColor" /><path d="M4 17l5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div className={styles.actionText}>
                <h4>{t.dashboard.uploadBeforeAfterTitle}</h4>
                <p>{t.dashboard.uploadBeforeAfterDesc}</p>
              </div>
              <span className={styles.actionChevron} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
          </div>

          <div className={`${styles.panelHeader} ${styles.panelHeaderSpaced}`}>
            <h2>{t.dashboard.analyticsOverview}</h2>
          </div>
          <div className={styles.analyticsPlaceholder}>
            <p>{t.dashboard.analyticsPlaceholder}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
