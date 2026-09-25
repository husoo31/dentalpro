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
  },
  home: {
    welcome: "{clinic} Kliniğine Hoş Geldiniz",
    heroTitleLine1: "Diş Sağlığını",
    heroTitleLine2: "Bir Sanat Formuna Dönüştürüyoruz.",
    heroDesc:
      "Konforunuz için özenle tasarlanmış, huzurlu ve son teknoloji donanımlı bir ortamda dünya standartlarında diş hekimliği deneyimi yaşayın.",
    ourExpertise: "Uzmanlık Alanlarımız",
    heroImageAlt: "Premium klinik",
    introTitleLine1: "Diş Hekimi Deneyiminizi",
    introTitleLine2: "Yeniden Tanımlıyoruz",
    introText:
      "{clinic} olarak diş hekimi ziyaretinin sabırsızlıkla beklenen bir deneyim olması gerektiğine inanıyoruz. En güncel klinik yenilikleri, spa huzurunda lüks bir atmosferle bir araya getirerek mükemmel bir gülüşe giden yolculuğunuzu tamamen stressiz hale getiriyoruz.",
    philosophyLink: "Yaklaşımımızı keşfedin",
    introImageAlt: "Klinik iç mekanı",
    treatmentsTitle: "İmza Tedavilerimiz",
    treatmentsSubtitle: "Size özel gülüşünüze uygun kapsamlı bakım.",
    treatments: [
      { title: "Diş İmplantı", desc: "Kalıcı ve doğal görünümlü diş eksikliği çözümü." },
      { title: "Estetik Diş Hekimliği", desc: "Lamine, beyazlatma ve eksiksiz gülüş tasarımı." },
      { title: "Ortodonti", desc: "Mükemmel düzgün dişler için şeffaf plaklar." },
    ],
    learnMore: "Detaylı Bilgi",
    testimonialsTitle: "Hasta Yorumları",
    testimonialsSubtitle: "Hastalarımızın deneyimleri hakkında söyledikleri.",
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
    services: "Hizmetler",
    allTreatments: "Tüm Tedaviler",
    bookAppointment: "Randevu Al",
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
  },
  gallery: {
    title: "Klinik Galerisi",
    subtitle: "Son teknoloji donanımlı kliniğimizi yakından tanıyın.",
    empty: "Şu anda görüntülenecek fotoğraf bulunmuyor.",
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
  },
  home: {
    welcome: "Welcome to {clinic}",
    heroTitleLine1: "Elevating Dental Care",
    heroTitleLine2: "To An Art Form.",
    heroDesc:
      "Experience world-class dentistry in a serene, state-of-the-art environment designed for your absolute comfort.",
    ourExpertise: "Our Expertise",
    heroImageAlt: "Premium clinic",
    introTitleLine1: "Redefining Your",
    introTitleLine2: "Dental Experience",
    introText:
      "At {clinic}, we believe that a visit to the dentist should be something you look forward to. We combine the latest clinical advancements with a luxurious, spa-like atmosphere to ensure your journey to a perfect smile is completely stress-free.",
    philosophyLink: "Discover our philosophy",
    introImageAlt: "Clinic interior",
    treatmentsTitle: "Signature Treatments",
    treatmentsSubtitle: "Comprehensive care tailored to your unique smile.",
    treatments: [
      { title: "Dental Implants", desc: "Permanent, natural-looking tooth replacement." },
      { title: "Cosmetic Dentistry", desc: "Veneers, whitening, and complete smile makeovers." },
      { title: "Orthodontics", desc: "Clear aligners for perfectly straight teeth." },
    ],
    learnMore: "Learn More",
    testimonialsTitle: "Patient Testimonials",
    testimonialsSubtitle: "What our patients say about their experience.",
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
    services: "Services",
    allTreatments: "All Treatments",
    bookAppointment: "Book Appointment",
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
  },
  gallery: {
    title: "Clinic Gallery",
    subtitle: "Take a tour of our state-of-the-art facility.",
    empty: "There are no photos to show right now.",
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
