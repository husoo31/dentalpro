# DentalPro Orchestration (AGENTS.md)

## Project Sources of Truth
1. `PROJECT_ARCHITECTURE.md`
2. `PROJECT_STANDARDS.md`
3. `ENGINEERING_WORKFLOW.md`
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