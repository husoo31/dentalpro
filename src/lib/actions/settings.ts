"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";

export async function getSettings() {
  const settings = await prisma.settings.findMany();
  const settingsMap: Record<string, string> = {};
  settings.forEach(s => {
    settingsMap[s.key] = s.value;
  });
  return settingsMap;
}

export async function updateSettings(data: Record<string, string>) {
  try {
    await requireRole("ADMIN", "EDITOR");

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
