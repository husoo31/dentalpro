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