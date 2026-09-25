"use client";

import { useEffect, useState } from "react";
import styles from "./WhatsAppBubble.module.css";

const STORAGE_KEY = "dentalpro_wa_bubble";
const OPEN_DELAY_MS = 2500;

// Small message bubble attached to the WhatsApp floating button. Opens once per browser
// session (sessionStorage), whether or not it was dismissed, so it never nags.
export default function WhatsAppBubble({ url, title, text, closeLabel }: { url: string; title: string; text: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return; // storage blocked: skip the auto-open rather than risk repeating it
    }
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setOpen(true);
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <aside className={styles.bubble} aria-label={title}>
      <a href={url} target="_blank" rel="noopener noreferrer" className={styles.content}>
        <span className={styles.title}>{title}</span>
        <span className={styles.text}>{text}</span>
      </a>
      <button type="button" className={styles.close} aria-label={closeLabel} onClick={() => setOpen(false)}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </aside>
  );
}
