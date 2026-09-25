// Presentation-only helpers: map raw field values to a badge label + style variant.
// Pure formatting, no data access — keeps status-badge rendering consistent across list pages.
// Labels are passed in from the active locale's dictionary so badges are translated too.

export type BadgeVariant = "badgeSuccess" | "badgeWarning" | "badgeInfo" | "badgeDanger" | "badgeNeutral";

interface CommonLabels {
  active: string;
  inactive: string;
  published: string;
  draft: string;
}

export function activeBadge(isActive: unknown, labels: CommonLabels): { label: string; variant: BadgeVariant } {
  return isActive
    ? { label: labels.active, variant: "badgeSuccess" }
    : { label: labels.inactive, variant: "badgeNeutral" };
}

export function publishedBadge(isPublished: unknown, labels: CommonLabels): { label: string; variant: BadgeVariant } {
  return isPublished
    ? { label: labels.published, variant: "badgeSuccess" }
    : { label: labels.draft, variant: "badgeWarning" };
}

interface AppointmentStatusLabels {
  PENDING: string;
  CONFIRMED: string;
  COMPLETED: string;
  CANCELLED: string;
}

const APPOINTMENT_STATUS_VARIANT: Record<string, BadgeVariant> = {
  PENDING: "badgeWarning",
  CONFIRMED: "badgeSuccess",
  COMPLETED: "badgeInfo",
  CANCELLED: "badgeDanger",
};

export function appointmentStatusBadge(status: string, labels: AppointmentStatusLabels): { label: string; variant: BadgeVariant } {
  const label = (labels as unknown as Record<string, string>)[status] ?? status;
  return { label, variant: APPOINTMENT_STATUS_VARIANT[status] ?? "badgeNeutral" };
}
