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
- Secrets ve environment değişkenlerini (`.env`, `.gitignore`) kontrol et. Sensitive data exposure'a izin verme.
- Security kontrolü yapılmadan kritik authentication/upload özellikleri tamamlandı kabul edilmemeli.