// In-memory sliding-window rate limiter. No Redis or other shared store exists in this
// project, and this endpoint's traffic doesn't justify standing one up. This is per-process
// state: on a multi-instance/serverless deployment each instance limits independently, so it
// is a mitigation against casual/scripted spam, not a hard per-identity guarantee. That's an
// intentional, documented trade-off — the alternative (extra DB writes per submission) would
// itself add load to the path we're trying to protect.
const buckets = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= max) {
    const retryAfterMs = windowMs - (now - timestamps[0]);
    return { allowed: false, retryAfterMs };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);

  // Opportunistic cleanup so long-lived processes don't accumulate unbounded distinct keys.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }

  return { allowed: true };
}
