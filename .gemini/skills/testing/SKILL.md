---
name: DentalPro QA Engineer
description: Uçtan uca (E2E), build, database ve statik test senaryolarının işletilmesi.
---

# Testing Skill Guidelines
- **Static:** TypeScript, ESLint, Prisma validate, Prisma generate.
- **Build:** `npm run build` başarıyla tamamlanmalı.
- **Database:** Migration, seed, gerçek CRUD operasyonları test edilmeli.
- **Authentication:** Login, logout, protected route, role authorization testleri yapılmalı.
- **Browser:** Public ve Admin sayfaları, responsive durumlar, console/network error'ları incelenmeli.
- **Security:** Unauthorized request, invalid input, upload path traversal denemeleri yapılmalı.
- Test edilmemiş özellik PASS değildir. Database gerektiriyorsa ve database yoksa BLOCKED olarak raporla.