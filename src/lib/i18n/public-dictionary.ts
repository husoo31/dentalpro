export const publicLocales = ["tr", "en"] as const;
export type PublicLocale = (typeof publicLocales)[number];
export const defaultPublicLocale: PublicLocale = "tr";
export const PUBLIC_LOCALE_COOKIE = "public_locale";

export function isPublicLocale(value: unknown): value is PublicLocale {
  return publicLocales.includes(value as PublicLocale);
}

/** Turkish (default) is unprefixed, English lives under /en. */
export function localizePath(locale: PublicLocale, path: string): string {
  if (locale === "tr") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** Strips the /en prefix from a browser pathname, returning the default-locale path. */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

const tr = {
  nav: {
    treatments: "Tedaviler",
    specialists: "Uzmanlarımız",
    gallery: "Galeri",
    bookAppointment: "Randevu Al",
    language: "Dil",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
  },
  home: {
    welcome: "{clinic} Kliniğine Hoş Geldiniz",
    heroTitleLine1: "Diş Sağlığını",
    heroTitleLine2: "Bir Sanat Formuna Dönüştürüyoruz.",
    heroDesc:
      "Konforunuz için özenle tasarlanmış, huzurlu ve son teknoloji donanımlı bir ortamda dünya standartlarında diş hekimliği deneyimi yaşayın.",
    ourExpertise: "Uzmanlık Alanlarımız",
    heroImageAlt: "Premium klinik",
    philosophyKicker: "Felsefemiz",
    introTitleLine1: "Diş Hekimi Deneyiminizi",
    introTitleLine2: "Yeniden Tanımlıyoruz",
    introText:
      "{clinic} olarak diş hekimi ziyaretinin sabırsızlıkla beklenen bir deneyim olması gerektiğine inanıyoruz. En güncel klinik yenilikleri, spa huzurunda lüks bir atmosferle bir araya getirerek mükemmel bir gülüşe giden yolculuğunuzu tamamen stressiz hale getiriyoruz.",
    philosophyLink: "Yaklaşımımızı keşfedin",
    introImageAlt: "Klinik iç mekanı",
    treatmentsKicker: "Tedaviler",
    treatmentsTitle: "İmza Tedavilerimiz",
    treatmentsSubtitle: "Size özel gülüşünüze uygun kapsamlı bakım.",
    treatments: [
      { title: "Diş İmplantı", desc: "Kalıcı ve doğal görünümlü diş eksikliği çözümü." },
      { title: "Estetik Diş Hekimliği", desc: "Lamine, beyazlatma ve eksiksiz gülüş tasarımı." },
      { title: "Ortodonti", desc: "Mükemmel düzgün dişler için şeffaf plaklar." },
    ],
    learnMore: "Detaylı Bilgi",
    doctorsKicker: "Ekibimiz",
    doctorsTitle: "Uzman Kadromuzla Tanışın",
    doctorsSubtitle: "Gülüşünüz için çalışan, alanında öncü diş hekimlerimiz.",
    viewAllDoctors: "Tüm Uzmanlarımız",
    beforeAfterKicker: "Gerçek Sonuçlar",
    beforeAfterTitle: "Dönüşümü Kendi Gözlerinizle Görün",
    beforeAfterSubtitle: "Kaydırıcıyı hareket ettirerek öncesi ve sonrasını karşılaştırın.",
    viewAllBeforeAfter: "Tüm Vaka Çalışmaları",
    testimonialsKicker: "Hasta Deneyimleri",
    testimonialsTitle: "Hasta Yorumları",
    testimonialsSubtitle: "Hastalarımızın deneyimleri hakkında söyledikleri.",
    galleryKicker: "Kliniğimiz",
    galleryTitle: "Kliniğimizin İçinden",
    gallerySubtitle: "Son teknoloji donanımlı, huzurlu bir ortam.",
    viewGallery: "Galeriyi Görüntüle",
    ctaTitle: "Yeni gülüşünüze hazır mısınız?",
    ctaSubtitle: "Özel muayene randevunuzu bugün planlayın.",
    ctaButton: "Randevu Talep Et",
  },
  footer: {
    defaultDesc:
      "Diş sağlığını bir sanat formuna dönüştürüyoruz. Son teknoloji donanımlı kliniğimizde premium ve kişiye özel tedaviler sunuyoruz.",
    clinic: "Klinik",
    specialists: "Uzmanlar",
    gallery: "Galeri",
    about: "Hakkımızda",
    blog: "Blog",
    beforeAfter: "Önce / Sonra",
    services: "Hizmetler",
    allTreatments: "Tüm Tedaviler",
    bookAppointment: "Randevu Al",
    contact: "İletişim",
    visitUs: "Bizi Ziyaret Edin",
    rights: "Tüm hakları saklıdır.",
  },
  whatsapp: {
    label: "WhatsApp üzerinden bize ulaşın",
    message: "Merhaba {clinic}, bilgi almak istiyorum.",
    bubbleTitle: "Bizimle iletişime geçin",
    bubbleText: "Size nasıl yardımcı olabiliriz?",
    closeLabel: "Mesajı kapat",
  },
  appointment: {
    eyebrow: "ÖNCELİKLİ RANDEVU",
    title: "Kusursuz gülüşünüze giden yol burada başlıyor.",
    description:
      "Özel bir konsültasyon talep etmek için formu doldurun. Hasta koordinatörümüz 24 saat içinde sizinle iletişime geçerek randevu saatinizi doğrulayacak ve varsa ön sorularınızı yanıtlayacaktır.",
    callUs: "Bizi Doğrudan Arayın",
    clinicHours: "Çalışma Saatleri",
    defaultHours: "Pzt - Cum: 09:00 - 18:00\nCmt: 10:00 - 14:00",
    formTitle: "Konsültasyon Talep Et",
    formSubtitle: "Uzmanlarımızla görüşmek için randevunuzu oluşturun.",
    fullName: "Ad Soyad",
    fullNamePlaceholder: "Ahmet Yılmaz",
    phone: "Telefon Numarası",
    phonePlaceholder: "+90 5XX XXX XX XX",
    treatment: "İlgilendiğiniz Tedavi",
    generalConsultation: "Genel Konsültasyon",
    preferredDate: "Tercih Edilen Tarih",
    submit: "Randevu Talebi Gönder",
    processing: "Gönderiliyor...",
    successTitle: "Talebiniz Alındı",
    successText:
      "Randevu talebiniz başarıyla iletildi. Ekibimiz kesin saati onaylamak için kısa süre içinde sizinle iletişime geçecektir.",
    another: "Yeni Randevu Talebi",
    errors: {
      patient_name: "Ad soyad en az 2 karakter olmalıdır.",
      phone: "Lütfen geçerli bir telefon numarası girin.",
      desired_date: "Lütfen geçerli bir tarih seçin.",
      generic: "Lütfen formdaki alanları kontrol edin.",
      server: "Talebiniz şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    },
  },
  treatments: {
    title: "Uzmanlık Alanlarımız",
    subtitle:
      "Kusursuz gülüşünüzü yenilemek, güzelleştirmek ve korumak için tasarlanmış kapsamlı premium diş tedavilerimizi keşfedin.",
    noImage: "Görsel Yok",
    fallbackDesc: "İhtiyaçlarınıza yönelik premium diş bakımı.",
    discover: "Tedaviyi Keşfedin",
    empty: "Şu anda listelenecek tedavi bulunmuyor.",
    back: "Tedavilere Dön",
    overview: "Tedaviye Genel Bakış",
    descriptionSoon: "Ayrıntılı açıklama yakında eklenecek.",
    ctaTitle: "Gülüşünüzü dönüştürmeye hazır mısınız?",
    ctaButton: "Konsültasyon Randevusu Al",
  },
  doctors: {
    title: "Uzmanlarımız",
    subtitle: "Gülüşünüz için çalışan, alanında öncü diş hekimlerimizle tanışın.",
    photo: "Fotoğraf",
    specialist: "Uzman Hekim",
    viewProfile: "Profili Görüntüle",
    empty: "Şu anda listelenecek hekim bulunmuyor.",
    back: "Uzmanlarımıza Dön",
    bioFallback: "Bu hekim için ayrıntılı biyografi yakında eklenecek.",
    ctaTitle: "Bu hekimimizle görüşmek ister misiniz?",
    ctaButton: "Randevu Al",
  },
  gallery: {
    title: "Klinik Galerisi",
    subtitle: "Son teknoloji donanımlı kliniğimizi yakından tanıyın.",
    empty: "Şu anda görüntülenecek fotoğraf bulunmuyor.",
  },
  about: {
    title: "Hakkımızda",
    subtitle: "Diş sağlığını bir sanat formuna dönüştürme yolculuğumuz.",
    philosophyTitle: "Felsefemiz",
    philosophyText:
      "{clinic} olarak diş hekimi ziyaretinin sabırsızlıkla beklenen bir deneyim olması gerektiğine inanıyoruz. En güncel klinik yenilikleri, spa huzurunda lüks bir atmosferle bir araya getirerek mükemmel bir gülüşe giden yolculuğunuzu tamamen stressiz hale getiriyoruz.",
    valuesTitle: "Değerlerimiz",
    values: [
      { title: "Hasta Odaklı Bakım", desc: "Her tedavi planı, sizin ihtiyaçlarınıza ve konforunuza göre özelleştirilir." },
      { title: "Son Teknoloji", desc: "En güncel klinik ekipman ve tekniklerle güvenli, hassas tedaviler sunuyoruz." },
      { title: "Şeffaflık", desc: "Tedavi süreciniz boyunca her adımda açık ve dürüst iletişim kurarız." },
    ],
    teamTitle: "Ekibimizle Tanışın",
    teamText: "Alanında deneyimli, öncü diş hekimlerimizle tanışın.",
    teamCta: "Uzmanlarımızı Görüntüle",
    ctaTitle: "Yeni gülüşünüze hazır mısınız?",
    ctaButton: "Randevu Al",
  },
  blog: {
    title: "Blog",
    subtitle: "Diş sağlığı ve klinik güncellemelerimiz hakkında yazılarımız.",
    empty: "Şu anda listelenecek yazı bulunmuyor.",
  },
  beforeAfter: {
    title: "Önce / Sonra",
    subtitle: "Hastalarımızın tedavi öncesi ve sonrası gerçek sonuçları.",
    empty: "Şu anda listelenecek önce/sonra çalışması bulunmuyor.",
    before: "Önce",
    after: "Sonra",
    compareLabel: "Önce ve sonra karşılaştırma kaydırıcısı",
  },
  contact: {
    title: "İletişim",
    subtitle: "Sorularınız için bize ulaşın, size yardımcı olmaktan mutluluk duyarız.",
    addressLabel: "Adres",
    phoneLabel: "Telefon",
    emailLabel: "E-posta",
    hoursLabel: "Çalışma Saatleri",
    ctaTitle: "Randevu almak ister misiniz?",
    ctaButton: "Randevu Al",
  },
  seo: {
    title: "Premium Diş Kliniği",
    description:
      "{clinic}: modern ve profesyonel diş hekimliği hizmetleri. İmplant, estetik diş hekimliği ve ortodonti için randevu alın.",
    ogLocale: "tr_TR",
  },
};

const en: typeof tr = {
  nav: {
    treatments: "Treatments",
    specialists: "Our Specialists",
    gallery: "Gallery",
    bookAppointment: "Book Appointment",
    language: "Language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  home: {
    welcome: "Welcome to {clinic}",
    heroTitleLine1: "Elevating Dental Care",
    heroTitleLine2: "To An Art Form.",
    heroDesc:
      "Experience world-class dentistry in a serene, state-of-the-art environment designed for your absolute comfort.",
    ourExpertise: "Our Expertise",
    heroImageAlt: "Premium clinic",
    philosophyKicker: "Our Philosophy",
    introTitleLine1: "Redefining Your",
    introTitleLine2: "Dental Experience",
    introText:
      "At {clinic}, we believe that a visit to the dentist should be something you look forward to. We combine the latest clinical advancements with a luxurious, spa-like atmosphere to ensure your journey to a perfect smile is completely stress-free.",
    philosophyLink: "Discover our philosophy",
    introImageAlt: "Clinic interior",
    treatmentsKicker: "Treatments",
    treatmentsTitle: "Signature Treatments",
    treatmentsSubtitle: "Comprehensive care tailored to your unique smile.",
    treatments: [
      { title: "Dental Implants", desc: "Permanent, natural-looking tooth replacement." },
      { title: "Cosmetic Dentistry", desc: "Veneers, whitening, and complete smile makeovers." },
      { title: "Orthodontics", desc: "Clear aligners for perfectly straight teeth." },
    ],
    learnMore: "Learn More",
    doctorsKicker: "Our Team",
    doctorsTitle: "Meet Our Specialists",
    doctorsSubtitle: "World-class dental experts dedicated to your smile.",
    viewAllDoctors: "All Our Specialists",
    beforeAfterKicker: "Real Results",
    beforeAfterTitle: "See the Transformation Yourself",
    beforeAfterSubtitle: "Drag the slider to compare before and after.",
    viewAllBeforeAfter: "All Case Studies",
    testimonialsKicker: "Patient Stories",
    testimonialsTitle: "Patient Testimonials",
    testimonialsSubtitle: "What our patients say about their experience.",
    galleryKicker: "Our Clinic",
    galleryTitle: "Inside Our Clinic",
    gallerySubtitle: "A state-of-the-art, serene environment.",
    viewGallery: "View Gallery",
    ctaTitle: "Ready for your new smile?",
    ctaSubtitle: "Schedule your private consultation today.",
    ctaButton: "Request an Appointment",
  },
  footer: {
    defaultDesc:
      "Elevating dental care to an art form. We provide premium, personalized treatments in a state-of-the-art facility.",
    clinic: "Clinic",
    specialists: "Specialists",
    gallery: "Gallery",
    about: "About Us",
    blog: "Blog",
    beforeAfter: "Before / After",
    services: "Services",
    allTreatments: "All Treatments",
    bookAppointment: "Book Appointment",
    contact: "Contact",
    visitUs: "Visit Us",
    rights: "All rights reserved.",
  },
  whatsapp: {
    label: "Contact us on WhatsApp",
    message: "Hello {clinic}, I would like to get more information.",
    bubbleTitle: "Get in touch with us",
    bubbleText: "How can we help you?",
    closeLabel: "Close message",
  },
  appointment: {
    eyebrow: "PRIORITY BOOKING",
    title: "Your Journey to a Perfect Smile Starts Here.",
    description:
      "Fill out the form to request a private consultation. Our patient care coordinator will contact you within 24 hours to confirm your appointment time and discuss any preliminary questions you might have.",
    callUs: "Call Us Directly",
    clinicHours: "Clinic Hours",
    defaultHours: "Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 2:00 PM",
    formTitle: "Request Consultation",
    formSubtitle: "Secure your spot with our specialists.",
    fullName: "Full Name",
    fullNamePlaceholder: "John Doe",
    phone: "Phone Number",
    phonePlaceholder: "+90 5XX XXX XX XX",
    treatment: "Treatment of Interest",
    generalConsultation: "General Consultation",
    preferredDate: "Preferred Date",
    submit: "Request Appointment",
    processing: "Processing...",
    successTitle: "Request Received",
    successText:
      "Your appointment request has been successfully submitted. Our team will contact you shortly to confirm the exact time.",
    another: "Book Another Appointment",
    errors: {
      patient_name: "Full name must be at least 2 characters.",
      phone: "Please enter a valid phone number.",
      desired_date: "Please choose a valid date.",
      generic: "Please check the highlighted fields.",
      server: "We could not send your request right now. Please try again later.",
    },
  },
  treatments: {
    title: "Our Expertise",
    subtitle:
      "Explore our comprehensive range of premium dental treatments designed to restore, enhance, and maintain your perfect smile.",
    noImage: "No Image",
    fallbackDesc: "Premium dental care for your needs.",
    discover: "Discover Treatment",
    empty: "There are no treatments to show right now.",
    back: "Back to Treatments",
    overview: "Treatment Overview",
    descriptionSoon: "Detailed description coming soon.",
    ctaTitle: "Ready to transform your smile?",
    ctaButton: "Book a Consultation",
  },
  doctors: {
    title: "Our Specialists",
    subtitle: "Meet the world-class dental experts dedicated to your smile.",
    photo: "Photo",
    specialist: "Specialist",
    viewProfile: "View Profile",
    empty: "There are no doctors to show right now.",
    back: "Back to Specialists",
    bioFallback: "A detailed biography for this doctor is coming soon.",
    ctaTitle: "Want to meet with this doctor?",
    ctaButton: "Book Appointment",
  },
  gallery: {
    title: "Clinic Gallery",
    subtitle: "Take a tour of our state-of-the-art facility.",
    empty: "There are no photos to show right now.",
  },
  about: {
    title: "About Us",
    subtitle: "Our journey to elevate dental care to an art form.",
    philosophyTitle: "Our Philosophy",
    philosophyText:
      "At {clinic}, we believe that a visit to the dentist should be something you look forward to. We combine the latest clinical advancements with a luxurious, spa-like atmosphere to ensure your journey to a perfect smile is completely stress-free.",
    valuesTitle: "Our Values",
    values: [
      { title: "Patient-Centered Care", desc: "Every treatment plan is tailored to your needs and comfort." },
      { title: "Cutting-Edge Technology", desc: "We use the latest clinical equipment and techniques for safe, precise treatments." },
      { title: "Transparency", desc: "We keep communication clear and honest at every step of your treatment." },
    ],
    teamTitle: "Meet Our Team",
    teamText: "Get to know our experienced, world-class dental specialists.",
    teamCta: "View Our Specialists",
    ctaTitle: "Ready for your new smile?",
    ctaButton: "Book Appointment",
  },
  blog: {
    title: "Blog",
    subtitle: "Our articles on dental health and clinic updates.",
    empty: "There are no posts to show right now.",
  },
  beforeAfter: {
    title: "Before / After",
    subtitle: "Real results from our patients' treatments.",
    empty: "There are no before/after cases to show right now.",
    before: "Before",
    after: "After",
    compareLabel: "Before and after comparison slider",
  },
  contact: {
    title: "Contact",
    subtitle: "Reach out with any questions — we're happy to help.",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Working Hours",
    ctaTitle: "Would you like to book an appointment?",
    ctaButton: "Book Appointment",
  },
  seo: {
    title: "Premium Dental Clinic",
    description:
      "{clinic}: modern and professional dental care. Book an appointment for implants, cosmetic dentistry and orthodontics.",
    ogLocale: "en_US",
  },
};

export const publicDictionaries: Record<PublicLocale, typeof tr> = { tr, en };

export function fillClinic(text: string, clinic: string): string {
  return text.replace("{clinic}", clinic);
}
