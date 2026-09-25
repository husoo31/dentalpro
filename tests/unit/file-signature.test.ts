import { describe, it, expect } from "vitest";
import { detectImageSignature } from "@/lib/file-signature";

describe("detectImageSignature", () => {
  it("detects a valid JPEG signature", () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    expect(detectImageSignature(buf)).toEqual({ type: "jpeg", ext: ".jpg" });
  });

  it("detects a valid PNG signature", () => {
    const buf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
    expect(detectImageSignature(buf)).toEqual({ type: "png", ext: ".png" });
  });

  it("detects a valid WEBP signature", () => {
    const buf = Buffer.concat([
      Buffer.from("RIFF", "ascii"),
      Buffer.from([0x00, 0x00, 0x00, 0x00]),
      Buffer.from("WEBP", "ascii"),
    ]);
    expect(detectImageSignature(buf)).toEqual({ type: "webp", ext: ".webp" });
  });

  it("rejects an HTML file even if it claims to be an image via Content-Type", () => {
    const buf = Buffer.from("<html><body><script>alert(document.cookie)</script></body></html>", "utf8");
    expect(detectImageSignature(buf)).toBeNull();
  });

  it("rejects an empty buffer", () => {
    expect(detectImageSignature(Buffer.alloc(0))).toBeNull();
  });

  it("rejects plain text", () => {
    expect(detectImageSignature(Buffer.from("not an image", "utf8"))).toBeNull();
  });
});
