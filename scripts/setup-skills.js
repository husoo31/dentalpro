const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const geminiDir = path.join(root, '.gemini');
const skillsDir = path.join(geminiDir, 'skills');

// Create directories
['frontend', 'backend', 'database', 'security', 'design', 'testing', 'code-review'].forEach(skill => {
  fs.mkdirSync(path.join(skillsDir, skill), { recursive: true });
});

// AGENTS.md
fs.writeFileSync(path.join(geminiDir, 'AGENTS.md'), `
# DentalPro Orchestration (AGENTS.md)

## Project Sources of Truth
1. \`PROJECT_ARCHITECTURE.md\`
2. \`PROJECT_STANDARDS.md\`
3. \`ENGINEERING_WORKFLOW.md\`
4. ilgili skill
5. mevcut kod

Çelişki varsa architecture ve standards dosyaları esas alınmalı.

## Görev Analizi
1. Görevi analiz et.
2. Hangi uzmanlıkların gerektiğini belirle.
3. Yalnızca gerekli skill'leri kullan.
4. Gereksiz skill'leri yükleme/okuma.
5. Mevcut mimariyi kontrol et.
6. Implement et.
7. İlgili testleri çalıştır.
8. Gerekirse code review yap.
9. Build doğrula.
10. Sonucu gerçek PASS / FAIL / BLOCKED olarak raporla.

**Önemli:**
- Test edilmeyen hiçbir şey PASS olarak raporlanamaz.
- Mock/fake functionality gerçek functionality gibi raporlanamaz.
- Database bağlantısı yoksa database gerektiren testler PASS değildir.
- Browser testi yapılmadıysa browser testi PASS değildir.
- Build başarılı olması tek başına uygulamanın tamamen çalıştığını kanıtlamaz.
`.trim());

// ENGINEERING_WORKFLOW.md
fs.writeFileSync(path.join(root, 'ENGINEERING_WORKFLOW.md'), `
# DentalPro Engineering Workflow

\`\`\`text
REQUEST
   ↓
TASK ANALYSIS
   ↓
ARCHITECTURE CHECK
   ↓
SELECT REQUIRED SKILLS
   ↓
IMPLEMENT
   ↓
TARGETED TESTS
   ↓
SECURITY CHECK
   ↓
CODE REVIEW
   ↓
BUILD
   ↓
FINAL VERIFICATION
   ↓
DONE
\`\`\`

## Görev Ölçeklendirmesi (Token Efficiency)
- **Small task (CSS/text/minor UI):** architecture check -> relevant skill -> targeted test
- **Medium task (Component/form/CMS change):** architecture -> relevant skills -> testing -> build
- **Large task (New feature/module):** architecture -> frontend/backend/database/security -> testing -> code review -> build -> browser E2E
`.trim());

// PROJECT_STANDARDS.md
fs.writeFileSync(path.join(root, 'PROJECT_STANDARDS.md'), `
# DentalPro Project Standards

## Design & UX
- Premium, modern, dental/medical, elegant, trustworthy, custom, professional, editorial quality.
- KAÇINILACAKLAR: Generic SaaS görünümü, AI-generated görünüm, hazır template hissi, aşırı gradient, aşırı glassmorphism, aşırı rounded card, gereksiz glow, emoji ağırlıklı UI, Bootstrap dashboard görünümü.
- Animasyonlar kontrollü olmalı ve \`prefers-reduced-motion\` desteklenmeli.

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
`.trim());

// Frontend Skill
fs.writeFileSync(path.join(skillsDir, 'frontend/SKILL.md'), `
---
name: DentalPro Frontend Engineer
description: UI/UX implementasyonu, Next.js rendering stratejileri, responsive ve accessible bileşen geliştirme.
---

# Frontend Skill Guidelines
- Next.js App Router standartlarını izle (Server Components varsayılan, Client Components gerektiğinde).
- Minimal client-side JavaScript kullan.
- Mobile-first yaklaşımı (375/390/430/768/1024/1440 viewport'ları hesaba kat).
- State'leri yönet: Loading, Empty, Error, Form states.
- Accessibility: Semantic HTML, keyboard navigation, focus states.
- Image optimization (next/image) ve SEO-friendly rendering kullan.
- Reusable component'ler geliştir.
- Mevcut design system'e uyum sağla. Generic template veya hazır dashboard görünümünden kaçın.
`.trim());

// Backend Skill
fs.writeFileSync(path.join(skillsDir, 'backend/SKILL.md'), `
---
name: DentalPro Backend Engineer
description: Server Actions, API routes, Zod validation ve business logic geliştirme.
---

# Backend Skill Guidelines
- Next.js Server Actions ana veri mutasyon aracıdır. Gerekliyse API routes kullan.
- Business logic ile UI'ı birbirinden ayır.
- Tüm input'lar için Zod validation zorunludur.
- Graceful error handling uygula.
- Authorization (ADMIN/EDITOR rolleri) kontrollerini Server Action/API seviyesinde yap.
- Prisma kullanırken transaction gerektiğinde transaction uygula.
- Güvenli data handling yap (veri sızıntısını önle).
- GERÇEK CRUD yaz, mock/fake implementation yapma.
`.trim());

// Database Skill
fs.writeFileSync(path.join(skillsDir, 'database/SKILL.md'), `
---
name: DentalPro Database Engineer
description: PostgreSQL, Prisma schema design ve data integrity yönetimi.
---

# Database Skill Guidelines
- PostgreSQL & Prisma standartlarına uy.
- Schema design, relations, indexes, unique constraints ve foreign keys yapılarını hatasız kur.
- Değişiklik yapmadan önce mevcut schema'yı kontrol et.
- Query performance (N+1 prevention), pagination ve filtering yapılarına dikkat et.
- \`db push\` yalnızca uygun development ortamında kullanılabilir. Migration gerektiren değişikliklerde migration oluşturulmalı.
- Gerçek database bağlantısı olmadan database davranışı doğrulanmış kabul edilemez.
`.trim());

// Security Skill
fs.writeFileSync(path.join(skillsDir, 'security/SKILL.md'), `
---
name: DentalPro Security Engineer
description: Auth.js, authorization, upload security ve zafiyet engelleme.
---

# Security Skill Guidelines
- Auth.js güvenliğini, session handling, protected routes kontrollerini yap.
- Passwords MUST be hashed (bcrypt).
- ADMIN / EDITOR rollerini doğru denetle.
- XSS (sanitize), SQL injection (Prisma), CSRF korumalarını doğrula.
- File upload security: MIME validation, extension validation, file size limits, filename sanitization, path traversal önleme zorunludur.
- Secrets ve environment değişkenlerini (\`.env\`, \`.gitignore\`) kontrol et. Sensitive data exposure'a izin verme.
- Security kontrolü yapılmadan kritik authentication/upload özellikleri tamamlandı kabul edilmemeli.
`.trim());

// Design Skill
fs.writeFileSync(path.join(skillsDir, 'design/SKILL.md'), `
---
name: DentalPro UI/UX Designer
description: Görsel kimliğin ve premium görünümün korunması.
---

# Design Skill Guidelines
- Temel Yön: Premium, modern, dental/medical, elegant, trustworthy, custom, professional, editorial quality.
- \`PROJECT_STANDARDS.md\` kurallarına sıkı sıkıya bağlı kal.
- Aşırı süslemelerden (glow, abartılı glassmorphism, emoji UI) kaçın.
- Typography, spacing, layout, ve component consistency kurallarını standartlar üzerinden takip et.
`.trim());

// Testing Skill
fs.writeFileSync(path.join(skillsDir, 'testing/SKILL.md'), `
---
name: DentalPro QA Engineer
description: Uçtan uca (E2E), build, database ve statik test senaryolarının işletilmesi.
---

# Testing Skill Guidelines
- **Static:** TypeScript, ESLint, Prisma validate, Prisma generate.
- **Build:** \`npm run build\` başarıyla tamamlanmalı.
- **Database:** Migration, seed, gerçek CRUD operasyonları test edilmeli.
- **Authentication:** Login, logout, protected route, role authorization testleri yapılmalı.
- **Browser:** Public ve Admin sayfaları, responsive durumlar, console/network error'ları incelenmeli.
- **Security:** Unauthorized request, invalid input, upload path traversal denemeleri yapılmalı.
- Test edilmemiş özellik PASS değildir. Database gerektiriyorsa ve database yoksa BLOCKED olarak raporla.
`.trim());

// Code Review Skill
fs.writeFileSync(path.join(skillsDir, 'code-review/SKILL.md'), `
---
name: DentalPro Code Reviewer
description: Mimari uygunluk, performans ve maintainability kontrolleri.
---

# Code Review Skill Guidelines
- Architecture ve \`PROJECT_STANDARDS.md\` compliance'ı denetle.
- TypeScript strictness, code duplication, ve unnecessary abstraction durumlarını kontrol et.
- Security, database correctness, performance, ve accessibility onayı ver.
- Fake/mock functionality veya dead code bırakılmasına izin verme.
- Kendi başına gereksiz refactor yapma. Gerçek bir problem varsa düzeltme öner/uygula.
`.trim());

console.log('Skills and orchestration files created successfully.');
