"use client";
import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import styles from "./BeforeAfterSlider.module.css";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  compareLabel: string;
  alt: string;
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeLabel, afterLabel, compareLabel, alt }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(50);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };
  const endDrag = () => {
    draggingRef.current = false;
  };
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") { setPosition((p) => Math.max(0, p - 5)); e.preventDefault(); }
    if (e.key === "ArrowRight") { setPosition((p) => Math.min(100, p + 5)); e.preventDefault(); }
    if (e.key === "Home") { setPosition(0); e.preventDefault(); }
    if (e.key === "End") { setPosition(100); e.preventDefault(); }
  };

  return (
    <div
      ref={containerRef}
      className={styles.slider}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={beforeSrc} alt={`${alt} — ${beforeLabel}`} className={styles.baseImage} draggable={false} />
      <div className={styles.afterLayer} style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={afterSrc} alt={`${alt} — ${afterLabel}`} className={styles.baseImage} draggable={false} />
      </div>

      <span className={styles.badgeBefore}>{beforeLabel}</span>
      <span className={styles.badgeAfter}>{afterLabel}</span>

      <div
        className={styles.handle}
        style={{ left: `${position}%` }}
        role="slider"
        tabIndex={0}
        aria-label={compareLabel}
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
      >
        <span className={styles.handleGrip} aria-hidden="true" />
      </div>
    </div>
  );
}
