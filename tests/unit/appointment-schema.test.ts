import { describe, it, expect } from "vitest";
import { appointmentSchema } from "@/lib/zod";

const base = { patient_name: "Ali Veli", phone: "05551234567" };

describe("appointmentSchema desired_date", () => {
  it("rejects a date clearly in the past", () => {
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const result = appointmentSchema.safeParse({ ...base, desired_date: past });
    expect(result.success).toBe(false);
  });

  it("accepts a future date", () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const result = appointmentSchema.safeParse({ ...base, desired_date: future });
    expect(result.success).toBe(true);
  });

  it("accepts a timestamp within the submission-lag grace window", () => {
    const almostNow = new Date(Date.now() - 60 * 1000).toISOString();
    const result = appointmentSchema.safeParse({ ...base, desired_date: almostNow });
    expect(result.success).toBe(true);
  });

  it("still rejects malformed dates", () => {
    const result = appointmentSchema.safeParse({ ...base, desired_date: "not-a-date" });
    expect(result.success).toBe(false);
  });
});
