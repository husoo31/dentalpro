# DentalPro Project Standards

## Design & UX
- Premium, modern, dental/medical, elegant, trustworthy, custom, professional, editorial quality.
- KAÇINILACAKLAR: Generic SaaS görünümü, AI-generated görünüm, hazır template hissi, aşırı gradient, aşırı glassmorphism, aşırı rounded card, gereksiz glow, emoji ağırlıklı UI, Bootstrap dashboard görünümü.
- Animasyonlar kontrollü olmalı ve `prefers-reduced-motion` desteklenmeli.

## Coding Standards
- Next.js App Router, React Server Components.
- Vanilla CSS / CSS Modules (Tailwind YASAK).
- TypeScript strict mode.
- Zod for validations.

## Security & Performance
- SSR for public pages (SEO).
- Minimal client-side JS.
- Image optimization.
- Semantic HTML, keyboard navigation, focus states.
- Sensible rate limiting, complete input sanitization.