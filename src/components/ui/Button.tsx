
import React from 'react';
import styles from './Button.module.css';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', size = 'md', href, children, className = '', ...props }: ButtonProps) {
  const btnClass = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;

  if (href) {
    const { type: _type, ...linkProps } = props as Record<string, unknown>;
    return <Link href={href} className={btnClass} {...linkProps}>{children}</Link>;
  }

  return (
    <button className={btnClass} {...props}>
      {children}
    </button>
  );
}
