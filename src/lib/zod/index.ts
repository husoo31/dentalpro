import { z } from "zod";

// Appointments are created with a form-local clock; a few minutes of grace absorbs
// submission lag and small client/server clock drift without allowing genuinely past dates.
const PAST_DATE_GRACE_MS = 5 * 60 * 1000;

export const appointmentSchema = z.object({
  patient_name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz").optional().or(z.literal('')),
  desired_date: z.coerce.date().refine(
    (date) => date.getTime() >= Date.now() - PAST_DATE_GRACE_MS,
    "Randevu tarihi geçmiş bir tarih olamaz"
  ),
  treatment_id: z.string().optional().or(z.literal('')),
  message: z.string().optional(),
});

// Shared helpers for the admin CRUD schemas below: forms submit plain FormData, so empty
// strings stand in for "not provided" and numbers/booleans may arrive as strings.
const optionalText = (max = 5000) =>
  z.preprocess((v) => (v === "" || v === undefined || v === null ? undefined : v), z.string().max(max).trim().optional());
const optionalInt = () =>
  z.preprocess((v) => (v === "" || v === undefined || v === null ? undefined : v), z.coerce.number().int().optional());
const optionalBool = () => z.boolean().optional();

export const doctorSchema = z.object({
  full_name: z.string().trim().min(1, "Ad soyad zorunludur"),
  slug: z.string().trim().min(1, "Slug zorunludur").regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir"),
  title: z.string().trim().min(1, "Unvan zorunludur"),
  bio: optionalText(5000),
  image_url: optionalText(2048),
  is_active: optionalBool(),
  sort_order: optionalInt(),
});

export const treatmentSchema = z.object({
  name: z.string().trim().min(1, "İsim zorunludur"),
  slug: z.string().trim().min(1, "Slug zorunludur").regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir"),
  short_description: optionalText(500),
  full_description: optionalText(50000),
  icon_url: optionalText(2048),
  image_url: optionalText(2048),
  is_active: optionalBool(),
  sort_order: optionalInt(),
});

export const postSchema = z.object({
  title: z.string().trim().min(1, "Başlık zorunludur"),
  slug: z.string().trim().min(1, "Slug zorunludur").regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir"),
  content: z.string().min(1, "İçerik zorunludur").max(200000),
  summary: optionalText(1000),
  image_url: optionalText(2048),
  doctor_id: optionalText(64),
  seo_title: optionalText(200),
  seo_description: optionalText(500),
  is_published: optionalBool(),
});

export const gallerySchema = z.object({
  title: z.string().trim().min(1, "Başlık zorunludur"),
  category: optionalText(200),
  image_url: z.string().trim().min(1, "Görsel URL zorunludur").max(2048),
  sort_order: optionalInt(),
});

export const beforeAfterSchema = z.object({
  title: z.string().trim().min(1, "Başlık zorunludur"),
  before_image: z.string().trim().min(1, "Öncesi görseli zorunludur").max(2048),
  after_image: z.string().trim().min(1, "Sonrası görseli zorunludur").max(2048),
  treatment_id: optionalText(64),
  description: optionalText(5000),
  is_active: optionalBool(),
});

export const testimonialSchema = z.object({
  patient_name: z.string().trim().min(1, "Ad soyad zorunludur"),
  text: z.string().trim().min(1, "Yorum metni zorunludur").max(2000),
  treatment_id: optionalText(64),
  rating: z.coerce.number().int().min(1).max(5),
  is_featured: optionalBool(),
});
