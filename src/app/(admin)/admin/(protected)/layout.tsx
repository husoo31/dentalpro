import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import styles from "./admin-layout.module.css";
import AdminSidebar from "./AdminSidebar";
import { getDictionary } from "@/lib/i18n/admin-server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  const displayName = session.user?.name || session.user?.email || "Admin";
  const initial = displayName.charAt(0).toUpperCase();
  const { locale, t } = await getDictionary();

  return (
    <div className={styles.adminContainer}>
      <AdminSidebar displayName={displayName} initial={initial} locale={locale} nav={t.nav} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
