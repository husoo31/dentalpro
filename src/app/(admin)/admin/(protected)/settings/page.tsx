import { getSettings } from "@/lib/actions/settings";
import SettingsForm from "./SettingsForm";
import shared from "../admin-shared.module.css";
import { getDictionary } from "@/lib/i18n/admin-server";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await getSettings();
  const { t } = await getDictionary();

  return (
    <div className={shared.container}>
      <div className={shared.pageHeader}>
        <div>
          <h1 className={shared.title}>{t.settings.title}</h1>
          <p className={shared.subtitle}>{t.settings.subtitle}</p>
        </div>
      </div>

      <SettingsForm initialData={settings} t={t} />
    </div>
  );
}
