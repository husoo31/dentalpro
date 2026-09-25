import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { getSettings } from "@/lib/actions/settings";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export async function generateMetadata() {
  const settings = await getSettings();
  
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: settings.seoTitle || settings.clinicName || "DentalPro | Premium Dental Clinic",
    description: settings.seoDescription || "Modern and professional dental clinic services.",
    icons: {
      icon: settings.favicon || "/favicon.ico",
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  // Public locale is set by src/proxy.ts; admin routes keep their existing lang.
  const htmlLang = (await headers()).get("x-public-locale") || "en";

  // Helper to convert hex to HSL components for CSS variables
  const hexToHSL = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l };
  };

  // WCAG relative luminance / contrast, used to keep text readable for any brand color.
  const luminance = (hex: string) => {
    const full = hex.length === 4 ? "#" + [...hex.slice(1)].map((c) => c + c).join("") : hex;
    const [r, g, b] = [1, 3, 5].map((i) => {
      const v = parseInt(full.substring(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (l1: number, l2: number) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const hslToLuminance = (h: number, s: number, l: number) => {
    const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return "#" + Math.round(c * 255).toString(16).padStart(2, "0");
    };
    const hex = f(0) + f(8).slice(1) + f(4).slice(1);
    return luminance(hex);
  };

  let primaryStyle = "";
  if (settings.primaryColor) {
    const hsl = hexToHSL(settings.primaryColor);
    // Text/icon color to place ON the primary color (buttons, active pills).
    const primaryLum = luminance(settings.primaryColor);
    const DARK = "#0B1220";
    const whiteRatio = contrast(primaryLum, 1);
    const darkRatio = contrast(primaryLum, luminance(DARK));
    const onPrimary = whiteRatio >= 4.5 || whiteRatio >= darkRatio ? "#FFFFFF" : DARK;
    // Brand color darkened until it is readable (>= 4.5:1) as text on white (logo, phone).
    let textL = hsl.l;
    while (textL > 0 && contrast(hslToLuminance(hsl.h, hsl.s, textL), 1) < 4.5) textL -= 1;
    // Same idea for the dark theme (surface #111827): lighten until readable on it.
    const darkSurfaceLum = luminance("#111827");
    let textDarkL = hsl.l;
    while (textDarkL < 100 && contrast(hslToLuminance(hsl.h, hsl.s, textDarkL), darkSurfaceLum) < 4.5) textDarkL += 1;
    primaryStyle = `--color-primary-h: ${hsl.h}; --color-primary-s: ${hsl.s}%; --color-primary-l: ${hsl.l}%; --color-on-primary: ${onPrimary}; --color-primary-text: hsl(${hsl.h} ${hsl.s}% ${Math.max(textL, 0)}%); --color-primary-text-on-dark: hsl(${hsl.h} ${hsl.s}% ${Math.min(textDarkL, 100)}%);`;
  }
  let accentStyle = "";
  if (settings.accentColor) {
    const hsl = hexToHSL(settings.accentColor);
    accentStyle = `--color-accent-h: ${hsl.h}; --color-accent-s: ${hsl.s}%; --color-accent-l: ${hsl.l}%;`;
  }

  return (
    <html lang={htmlLang}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              ${primaryStyle}
              ${accentStyle}
              ${settings.backgroundColor ? `--color-background: ${settings.backgroundColor};` : ''}
              ${settings.textColor ? `--color-text-main: ${settings.textColor};` : ''}
            }
          `
        }} />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
