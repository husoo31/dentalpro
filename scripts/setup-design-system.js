const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'src');
const app = path.join(src, 'app');
const publicDir = path.join(app, '(public)');
const componentsDir = path.join(src, 'components');
const uiDir = path.join(componentsDir, 'ui');
const layoutDir = path.join(componentsDir, 'layout');

// Create directories
[publicDir, uiDir, layoutDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

// Move public pages into (public) route group
const safeMove = (srcPath, destPath) => {
  if (fs.existsSync(srcPath)) {
    fs.renameSync(srcPath, destPath);
  }
};
safeMove(path.join(app, 'page.tsx'), path.join(publicDir, 'page.tsx'));
safeMove(path.join(app, 'page.module.css'), path.join(publicDir, 'page.module.css'));
safeMove(path.join(app, 'randevu'), path.join(publicDir, 'randevu'));

// Write (public)/layout.tsx
fs.writeFileSync(path.join(publicDir, 'layout.tsx'), `
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
`);

// Write globals.css (WOW Design Tokens)
const globalsCss = `
:root {
  /* WHITE-LABEL DESIGN TOKENS */
  /* Primary Brand: Deep Slate/Navy - Trustworthy & Professional */
  --color-primary-h: 215;
  --color-primary-s: 30%;
  --color-primary-l: 15%;
  --color-primary: hsl(var(--color-primary-h) var(--color-primary-s) var(--color-primary-l));
  --color-primary-light: hsl(var(--color-primary-h) var(--color-primary-s) 30%);
  --color-primary-dark: hsl(var(--color-primary-h) var(--color-primary-s) 10%);

  /* Accent: Soft Gold/Champagne - Premium & Elegant */
  --color-accent-h: 40;
  --color-accent-s: 40%;
  --color-accent-l: 60%;
  --color-accent: hsl(var(--color-accent-h) var(--color-accent-s) var(--color-accent-l));
  --color-accent-hover: hsl(var(--color-accent-h) var(--color-accent-s) 50%);

  /* Backgrounds & Surfaces */
  --color-background: #FAFAFA; /* Off-white, clinical clean */
  --color-surface: #FFFFFF;
  --color-surface-hover: #F3F4F6;
  --color-surface-alt: #F8FAFC;

  /* Typography Colors */
  --color-text-main: #111827;
  --color-text-muted: #6B7280;
  --color-text-inverse: #FFFFFF;

  /* Borders & Shadows */
  --color-border: #E5E7EB;
  --color-border-focus: var(--color-primary);
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05);
  --shadow-elegant: 0 20px 40px -10px rgb(0 0 0 / 0.08);

  /* Border Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 1rem;
  --spacing-4: 1.5rem;
  --spacing-5: 2rem;
  --spacing-6: 3rem;
  --spacing-8: 4rem;
  --spacing-12: 6rem;
  --spacing-16: 8rem;
  --spacing-20: 12rem;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-color-scheme: dark) {
  /* Admin panel supports dark mode, public site is usually locked to light/premium for dental */
  :root {
    --color-background: #0B0F19;
    --color-surface: #111827;
    --color-surface-hover: #1F2937;
    --color-surface-alt: #1F2937;
    --color-text-main: #F9FAFB;
    --color-text-muted: #9CA3AF;
    --color-border: #374151;
  }
}

/* RESET & BASE */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-background);
  color: var(--color-text-main);
  font-family: var(--font-inter), -apple-system, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* TYPOGRAPHY */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-outfit), serif;
  font-weight: 400;
  line-height: 1.1;
  color: var(--color-primary);
  margin-bottom: var(--spacing-3);
  letter-spacing: -0.02em;
}

h1 { font-size: clamp(2.5rem, 6vw, 5rem); }
h2 { font-size: clamp(2rem, 4.5vw, 3.5rem); }
h3 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
h4 { font-size: clamp(1.25rem, 2vw, 1.75rem); }

p {
  margin-bottom: var(--spacing-3);
  color: var(--color-text-muted);
  font-size: 1.125rem;
}

a {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}

/* UTILITIES */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.text-accent { color: var(--color-accent); }
.text-primary { color: var(--color-primary); }
.bg-primary { background-color: var(--color-primary); color: var(--color-text-inverse); }
.bg-surface { background-color: var(--color-surface); }
.bg-alt { background-color: var(--color-surface-alt); }

/* ANIMATIONS (Controlled Motion) */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.active {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; }
}

/* SECTION PADDING */
.section-padding {
  padding-top: var(--spacing-16);
  padding-bottom: var(--spacing-16);
}
@media (min-width: 768px) {
  .section-padding {
    padding-top: var(--spacing-20);
    padding-bottom: var(--spacing-20);
  }
}
`;
fs.writeFileSync(path.join(app, 'globals.css'), globalsCss);

// Write base UI components
const buttonCode = `
import React from 'react';
import styles from './Button.module.css';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', size = 'md', href, children, className = '', ...props }: ButtonProps) {
  const btnClass = \`\${styles.btn} \${styles[variant]} \${styles[size]} \${className}\`;
  
  if (href) {
    return <Link href={href} className={btnClass}>{children}</Link>;
  }
  
  return (
    <button className={btnClass} {...props}>
      {children}
    </button>
  );
}
`;
fs.writeFileSync(path.join(uiDir, 'Button.tsx'), buttonCode);

const buttonCss = `
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-weight: 500;
  transition: all var(--transition-normal);
  cursor: pointer;
  border: 1px solid transparent;
  font-family: var(--font-inter);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Sizes */
.sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
.md { padding: 0.75rem 1.5rem; font-size: 1rem; }
.lg { padding: 1rem 2rem; font-size: 1.125rem; }

/* Variants */
.primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}
.primary:hover {
  background-color: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.secondary {
  background-color: var(--color-accent);
  color: var(--color-primary-dark);
}
.secondary:hover {
  background-color: var(--color-accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.outline {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-primary);
}
.outline:hover {
  border-color: var(--color-primary);
  background-color: var(--color-surface-hover);
}

.ghost {
  background-color: transparent;
  color: var(--color-primary);
}
.ghost:hover {
  background-color: var(--color-surface-hover);
}
`;
fs.writeFileSync(path.join(uiDir, 'Button.module.css'), buttonCss);

// Layout Components
const navbarCode = `
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import Button from '../ui/Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={\`\${styles.header} \${scrolled ? styles.scrolled : ''}\`}>
      <div className={\`container \${styles.nav}\`}>
        <Link href="/" className={styles.logo}>
          DentalPro<span className="text-accent">.</span>
        </Link>
        <div className={styles.links}>
          <Link href="/tedaviler" className={styles.link}>Treatments</Link>
          <Link href="/doktorlar" className={styles.link}>Our Specialists</Link>
          <Link href="/galeri" className={styles.link}>Gallery</Link>
          <Link href="/hakkimizda" className={styles.link}>Our Clinic</Link>
        </div>
        <div className={styles.actions}>
          <Button href="/randevu" variant="primary">Book Appointment</Button>
        </div>
      </div>
    </header>
  );
}
`;
fs.writeFileSync(path.join(layoutDir, 'Navbar.tsx'), navbarCode);

const navbarCss = `
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  transition: all var(--transition-normal);
  background: transparent;
  padding: var(--spacing-4) 0;
}

.header.scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-2) 0;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-family: var(--font-outfit);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.links {
  display: none;
  gap: var(--spacing-6);
}

.link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-main);
  position: relative;
}

.link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-accent);
  transition: width var(--transition-fast);
}

.link:hover::after {
  width: 100%;
}

@media (min-width: 1024px) {
  .links {
    display: flex;
  }
}
`;
fs.writeFileSync(path.join(layoutDir, 'Navbar.module.css'), navbarCss);

const footerCode = `
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={\`container \${styles.grid}\`}>
        <div className={styles.brand}>
          <h2 className={styles.logo}>DentalPro<span className="text-accent">.</span></h2>
          <p className={styles.desc}>Elevating dental care to an art form. We provide premium, personalized treatments in a state-of-the-art facility.</p>
        </div>
        <div className={styles.links}>
          <h3>Clinic</h3>
          <Link href="/hakkimizda">About Us</Link>
          <Link href="/doktorlar">Specialists</Link>
          <Link href="/galeri">Gallery</Link>
          <Link href="/iletisim">Contact</Link>
        </div>
        <div className={styles.links}>
          <h3>Services</h3>
          <Link href="/tedaviler/implant">Dental Implants</Link>
          <Link href="/tedaviler/estetik">Cosmetic Dentistry</Link>
          <Link href="/tedaviler/ortodonti">Orthodontics</Link>
          <Link href="/tedaviler">All Treatments</Link>
        </div>
        <div className={styles.contact}>
          <h3>Visit Us</h3>
          <p>123 Premium Dental Ave,<br/>Suite 400, NY 10001</p>
          <p>hello@dentalpro.com<br/>+1 (555) 123-4567</p>
        </div>
      </div>
      <div className={\`container \${styles.bottom}\`}>
        <p>&copy; {new Date().getFullYear()} DentalPro Clinic. All rights reserved.</p>
      </div>
    </footer>
  );
}
`;
fs.writeFileSync(path.join(layoutDir, 'Footer.tsx'), footerCode);

const footerCss = `
.footer {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  padding-top: var(--spacing-16);
  padding-bottom: var(--spacing-6);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-12);
}

@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .grid { grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: var(--spacing-12); }
}

.logo {
  color: var(--color-text-inverse);
  margin-bottom: var(--spacing-4);
}

.desc {
  color: rgba(255, 255, 255, 0.7);
  max-width: 320px;
}

.links h3, .contact h3 {
  color: var(--color-text-inverse);
  font-family: var(--font-inter);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-4);
}

.links a, .contact p {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-2);
}

.links a:hover {
  color: var(--color-accent);
}

.bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: var(--spacing-6);
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}
`;
fs.writeFileSync(path.join(layoutDir, 'Footer.module.css'), footerCss);

console.log("Design System, Tokens, Layout restructuring and Base Components created.");
