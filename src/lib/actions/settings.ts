"use server";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  // Settings are read from the DB on every request (white-label values can change
  // at any time via /admin/settings). connection() also excludes this call from
  // `next build`'s static prerendering pass — without it, the root layout's
  // generateMetadata/RootLayout call this before any request exists, so build
  // would need real DB access (see /_not-found prerender failures on Coolify).
  await connection();
  const settings = await prisma.settings.findMany();
  const settingsMap: Record<string, string> = {};
  settings.forEach(s => {
    settingsMap[s.key] = s.value;
  });
  return settingsMap;
}

export async function updateSettings(data: Record<string, string>) {
  try {
    for (const [key, value] of Object.entries(data)) {
      // Security Validation
      
      // Hex Color Validation
      if (key.endsWith('Color')) {
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (value && !hexRegex.test(value)) {
          return { error: `Geçersiz renk formatı: ${key}` };
        }
      }
      
      // URL Validation
      if (['instagram', 'facebook', 'youtube', 'linkedin'].includes(key)) {
        if (value && value !== "") {
          try {
            new URL(value);
          } catch {
            return { error: `Geçersiz URL: ${key}` };
          }
        }
      }

      await prisma.settings.upsert({
        where: { key },
        update: { value },
        create: {
          key,
          value,
          group: 'general'
        }
      });
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
