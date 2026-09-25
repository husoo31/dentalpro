import { z } from "zod";

export const appointmentSchema = z.object({
  patient_name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz").optional().or(z.literal('')),
  desired_date: z.coerce.date(),
  treatment_id: z.string().optional().or(z.literal('')),
  message: z.string().optional(),
});
