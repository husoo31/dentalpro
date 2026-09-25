import { describe, it, expect } from "vitest";
import { sanitizeRichText } from "@/lib/sanitize";

describe("sanitizeRichText", () => {
  it("strips <script> tags entirely", () => {
    const out = sanitizeRichText('<p>Merhaba</p><script>alert(document.cookie)</script>');
    expect(out).not.toContain("<script");
    expect(out).not.toContain("alert(document.cookie)");
    expect(out).toContain("Merhaba");
  });

  it("strips inline event handlers (onerror/onclick)", () => {
    const out = sanitizeRichText('<img src="x" onerror="alert(1)"><p onclick="alert(2)">hi</p>');
    expect(out).not.toContain("onerror");
    expect(out).not.toContain("onclick");
    expect(out).not.toContain("alert(1)");
    expect(out).not.toContain("alert(2)");
  });

  it("neutralizes javascript: URLs in links", () => {
    const out = sanitizeRichText('<a href="javascript:alert(1)">click</a>');
    expect(out).not.toContain("javascript:");
  });

  it("strips <iframe> entirely (not in allowlist)", () => {
    const out = sanitizeRichText('<iframe src="https://evil.example"></iframe><p>ok</p>');
    expect(out).not.toContain("<iframe");
    expect(out).toContain("ok");
  });

  it("removes <style> blocks and style attributes", () => {
    const out = sanitizeRichText('<p style="background:url(javascript:alert(1))">x</p><style>body{}</style>');
    expect(out).not.toContain("<style");
    expect(out).not.toContain("style=");
  });

  it("preserves legitimate WYSIWYG formatting", () => {
    const out = sanitizeRichText(
      '<h2>Başlık</h2><p>Merhaba <strong>Dünya</strong>, bu bir <em>test</em>.</p><ul><li>Madde 1</li><li>Madde 2</li></ul>'
    );
    expect(out).toContain("<h2>Başlık</h2>");
    expect(out).toContain("<strong>Dünya</strong>");
    expect(out).toContain("<em>test</em>");
    expect(out).toContain("<li>Madde 1</li>");
  });

  it("preserves safe links with rel/target", () => {
    const out = sanitizeRichText('<a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a>');
    expect(out).toContain('href="https://example.com"');
  });

  it("returns an empty string for null/undefined/empty input", () => {
    expect(sanitizeRichText(null)).toBe("");
    expect(sanitizeRichText(undefined)).toBe("");
    expect(sanitizeRichText("")).toBe("");
  });
});
