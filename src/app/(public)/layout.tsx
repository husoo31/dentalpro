import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { getSettings } from "@/lib/actions/settings";
import { getPublicLocale } from "@/lib/i18n/public-server";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const locale = await getPublicLocale();

  return (
    <>
      <Navbar settings={settings} locale={locale} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} locale={locale} />
      <WhatsAppButton phone={settings.whatsapp} clinicName={settings.clinicName} locale={locale} />
    </>
  );
}
