"use client";

import React from "react";
import styles from "./Button.module.css";

interface ConfirmSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  confirmMessage: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function ConfirmSubmitButton({
  confirmMessage,
  variant = "danger",
  size = "sm",
  className = "",
  onClick,
  children,
  ...props
}: ConfirmSubmitButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(confirmMessage)) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const btnClass = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;

  return (
    <button type="submit" className={btnClass} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
