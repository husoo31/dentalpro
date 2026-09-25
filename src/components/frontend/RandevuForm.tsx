"use client";
import { useState } from "react";
import { createAppointment } from "@/lib/actions/appointments";
import styles from "./RandevuForm.module.css";
import Button from "../ui/Button";
import { publicDictionaries, type PublicLocale } from "@/lib/i18n/public-dictionary";

export default function RandevuForm({ treatments, selectedTreatmentId, locale }: { treatments: any[], selectedTreatmentId?: string, locale: PublicLocale }) {
  const t = publicDictionaries[locale].appointment;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    const res = await createAppointment(data);
    
    if (res.error) {
      // The action returns Turkish/technical strings; show localized messages instead.
      const fieldErrors = typeof res.error === 'string' ? null : (res.error as Record<string, { _errors?: string[] }>);
      const firstField = fieldErrors && (["patient_name", "phone", "desired_date"] as const).find(k => fieldErrors[k]?._errors?.length);
      setError(!fieldErrors ? t.errors.server : firstField ? t.errors[firstField] : t.errors.generic);
    } else {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className={styles.successState}>
        <div className={styles.checkIcon}>✓</div>
        <h3>{t.successTitle}</h3>
        <p>{t.successText}</p>
        <Button variant="outline" onClick={() => setSuccess(false)}>{t.another}</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.errorAlert}>{error}</div>}
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>{t.fullName} <span className="text-accent">*</span></label>
        <input name="patient_name" required className={styles.input} placeholder={t.fullNamePlaceholder} />
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>{t.phone} <span className="text-accent">*</span></label>
        <input name="phone" required className={styles.input} placeholder={t.phonePlaceholder} />
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>{t.treatment}</label>
        <select name="treatment_id" className={styles.select} defaultValue={selectedTreatmentId || ""}>
          <option value="">{t.generalConsultation}</option>
          {treatments.map(tr => (
            <option key={tr.id} value={tr.id}>{tr.name}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>{t.preferredDate} <span className="text-accent">*</span></label>
        <input type="datetime-local" name="desired_date" required className={styles.input} />
      </div>
      
      <Button type="submit" disabled={loading} size="lg" className={styles.submitBtn}>
        {loading ? t.processing : t.submit}
      </Button>
    </form>
  );
}
