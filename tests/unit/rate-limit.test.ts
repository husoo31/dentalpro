import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const key = "test-key-" + Math.random();
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, 5, 60_000).allowed).toBe(true);
    }
  });

  it("blocks requests once the limit is reached within the window", () => {
    const key = "test-key-" + Math.random();
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, 5, 60_000).allowed).toBe(true);
    }
    const sixth = checkRateLimit(key, 5, 60_000);
    expect(sixth.allowed).toBe(false);
    expect(sixth.retryAfterMs).toBeGreaterThan(0);
  });

  it("tracks different keys independently", () => {
    const keyA = "a-" + Math.random();
    const keyB = "b-" + Math.random();
    for (let i = 0; i < 5; i++) checkRateLimit(keyA, 5, 60_000);
    expect(checkRateLimit(keyA, 5, 60_000).allowed).toBe(false);
    expect(checkRateLimit(keyB, 5, 60_000).allowed).toBe(true);
  });

  it("allows requests again once the window has elapsed", () => {
    const key = "window-" + Math.random();
    expect(checkRateLimit(key, 1, 10).allowed).toBe(true);
    expect(checkRateLimit(key, 1, 10).allowed).toBe(false);
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(checkRateLimit(key, 1, 10).allowed).toBe(true);
        resolve(undefined);
      }, 30);
    });
  });
});
