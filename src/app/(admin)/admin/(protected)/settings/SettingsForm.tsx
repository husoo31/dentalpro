"use client";
import { useState } from "react";
import { updateSettings } from "@/lib/actions/settings";
import Button from "@/components/ui/Button";
import styles from "./settings.module.css";
import type { Locale, dictionaries } from "@/lib/i18n/admin-dictionary";

type Dict = (typeof dictionaries)[Locale];

const HEX_REGEX = /^#([0-9A-F]{3}){1,2}$/i;
const COLOR_FIELDS = ["primaryColor", "accentColor", "backgroundColor", "textColor"] as const;
const URL_FIELDS = ["instagram", "facebook", "youtube", "linkedin"] as const;

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function SettingsForm({ initialData, t }: { initialData: Record<string, string>; t: Dict }) {
  const s = t.settings;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [data, setData] = useState(initialData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [imageMode, setImageMode] = useState<{ logo: "upload" | "url"; favicon: "upload" | "url" }>({
    logo: "upload",
    favicon: "upload",
  });
  const [uploadStatus, setUploadStatus] = useState<{ logo?: "uploading" | "error"; favicon?: "uploading" | "error" }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validateField = (key: string, value: string): string => {
    if (!value) return "";
    if ((COLOR_FIELDS as readonly string[]).includes(key) && !HEX_REGEX.test(value)) {
      return s.invalidHex;
    }
    if ((URL_FIELDS as readonly string[]).includes(key) && !isValidUrl(value)) {
      return s.invalidUrl;
    }
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const message = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: "logo" | "favicon") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus((prev) => ({ ...prev, [key]: "uploading" }));
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        setData((prev) => ({ ...prev, [key]: result.url }));
        setUploadStatus((prev) => ({ ...prev, [key]: undefined }));
      } else {
        setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
        setError(result.error || s.uploadFailed);
      }
    } catch (err: any) {
      setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
      setError(err.message || s.uploadFailed);
    }
  };

  const handleRemoveImage = (key: "logo" | "favicon") => {
    setData((prev) => ({ ...prev, [key]: "" }));
    setUploadStatus((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation for every color/url field up front — surfaces all
    // problems at once, unlike the server action which returns on the first bad key.
    const nextErrors: Record<string, string> = {};
    for (const key of [...COLOR_FIELDS, ...URL_FIELDS]) {
      const message = validateField(key, data[key] || "");
      if (message) nextErrors[key] = message;
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    const res = await updateSettings(data);
    if (res.error) {
      // Server validation is the safety net; if it still rejects something,
      // parse which key it named and surface it on that specific field.
      const key = res.error.split(":").pop()?.trim();
      if (key && (data as Record<string, string>)[key] !== undefined) {
        setFieldErrors((prev) => ({ ...prev, [key]: res.error }));
      }
      setError(res.error);
    } else {
      setSuccess(s.saveSuccess);
    }
    setLoading(false);
  };

  const renderImageField = (key: "logo" | "favicon", label: string) => {
    const mode = imageMode[key];
    const status = uploadStatus[key];
    return (
      <div className={styles.field}>
        <label htmlFor={`${key}-field`}>{label}</label>
        <div className={styles.modeTabs} role="tablist" aria-label={label}>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "upload"}
            className={`${styles.modeTab} ${mode === "upload" ? styles.modeTabActive : ""}`}
            onClick={() => setImageMode((prev) => ({ ...prev, [key]: "upload" }))}
          >
            {s.uploadMode}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "url"}
            className={`${styles.modeTab} ${mode === "url" ? styles.modeTabActive : ""}`}
            onClick={() => setImageMode((prev) => ({ ...prev, [key]: "url" }))}
          >
            {s.urlMode}
          </button>
        </div>

        <div className={styles.uploadRow}>
          {data[key] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data[key]} alt="" className={styles.preview} />
          )}
          {mode === "upload" ? (
            <div>
              <input
                id={`${key}-field`}
                type="file"
                onChange={(e) => handleUpload(e, key)}
                accept="image/*"
                disabled={status === "uploading"}
              />
              {status === "uploading" && <p className={styles.uploadStatus}>{s.uploading}</p>}
              {status === "error" && <p className={`${styles.uploadStatus} ${styles.uploadStatusError}`}>{s.uploadFailed}</p>}
            </div>
          ) : (
            <input
              id={`${key}-field`}
              name={key}
              value={data[key] || ""}
              onChange={handleChange}
              placeholder={key === "logo" ? "/logo.png" : "/favicon.ico"}
            />
          )}
          {data[key] && (
            <button type="button" className={styles.removeButton} onClick={() => handleRemoveImage(key)}>
              {s.remove}
            </button>
          )}
        </div>
      </div>
    );
  };

  const colorField = (key: (typeof COLOR_FIELDS)[number], label: string, fallback: string) => (
    <div className={styles.field}>
      <label htmlFor={key}>{label}</label>
      <div className={styles.colorRow}>
        <input
          type="color"
          aria-hidden="true"
          tabIndex={-1}
          value={/^#([0-9A-F]{6})$/i.test(data[key] || "") ? data[key] : fallback}
          onChange={handleChange}
          name={key}
        />
        <input
          id={key}
          name={key}
          value={data[key] || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={fallback}
          aria-invalid={!!fieldErrors[key]}
          aria-describedby={fieldErrors[key] ? `${key}-error` : undefined}
        />
      </div>
      {fieldErrors[key] && <span id={`${key}-error`} className={styles.fieldErrorText} role="alert">{fieldErrors[key]}</span>}
    </div>
  );

  const urlField = (key: (typeof URL_FIELDS)[number], label: string) => (
    <div className={styles.field}>
      <label htmlFor={key}>{label}</label>
      <input
        id={key}
        name={key}
        type="url"
        value={data[key] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={!!fieldErrors[key]}
        aria-describedby={fieldErrors[key] ? `${key}-error` : undefined}
      />
      {fieldErrors[key] && <span id={`${key}-error`} className={styles.fieldErrorText} role="alert">{fieldErrors[key]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper} noValidate>
      {error && <div className={`${styles.banner} ${styles.bannerError}`} role="alert">{error}</div>}
      {success && <div className={`${styles.banner} ${styles.bannerSuccess}`} role="status">{success}</div>}

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{s.generalInfo}</h3>
        <div className={styles.field}>
          <label htmlFor="clinicName">{s.clinicName}</label>
          <input id="clinicName" name="clinicName" value={data.clinicName || ""} onChange={handleChange} required />
        </div>

        <div className={styles.grid2}>
          {renderImageField("logo", s.logo)}
          {renderImageField("favicon", s.favicon)}
        </div>

        <div className={styles.field}>
          <label htmlFor="footerText">{s.footerText}</label>
          <textarea id="footerText" name="footerText" value={data.footerText || ""} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{s.brandingColors}</h3>
        <div className={styles.grid2}>
          {colorField("primaryColor", s.primaryColor, "#0f172a")}
          {colorField("accentColor", s.accentColor, "#d4af37")}
          {colorField("backgroundColor", s.backgroundColor, "#FAFAFA")}
          {colorField("textColor", s.textColor, "#111827")}
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{s.contactSeo}</h3>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label htmlFor="phone">{s.phone}</label>
            <input id="phone" name="phone" value={data.phone || ""} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label htmlFor="whatsapp">{s.whatsapp}</label>
            <input id="whatsapp" name="whatsapp" value={data.whatsapp || ""} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">{s.email}</label>
            <input id="email" name="email" value={data.email || ""} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label htmlFor="workingHours">{s.workingHours}</label>
            <input id="workingHours" name="workingHours" value={data.workingHours || ""} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="address">{s.address}</label>
          <textarea id="address" name="address" value={data.address || ""} onChange={handleChange} />
        </div>

        <div className={styles.field}>
          <label htmlFor="seoTitle">{s.seoTitle}</label>
          <input id="seoTitle" name="seoTitle" value={data.seoTitle || ""} onChange={handleChange} />
        </div>
        <div className={styles.field}>
          <label htmlFor="seoDescription">{s.seoDescription}</label>
          <textarea id="seoDescription" name="seoDescription" value={data.seoDescription || ""} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{s.socialLinks}</h3>
        <div className={styles.grid2}>
          {urlField("instagram", s.instagram)}
          {urlField("facebook", s.facebook)}
          {urlField("youtube", s.youtube)}
          {urlField("linkedin", s.linkedin)}
        </div>
      </div>

      <Button type="submit" disabled={loading} size="lg" className={styles.submitButton}>
        {loading ? s.saving : s.save}
      </Button>
    </form>
  );
}
