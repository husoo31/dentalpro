// Exercises the real /api/upload Route Handler (imported and invoked directly, no server
// process needed) against a real temp public/uploads directory. Cleans up what it writes.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import path from "path";
import { readdir, unlink } from "fs/promises";
import { existsSync } from "fs";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
import { getServerSession } from "next-auth";
const mockedSession = getServerSession as unknown as ReturnType<typeof vi.fn>;

import { POST } from "@/app/api/upload/route";

const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const uploadDir = path.join(process.cwd(), "public/uploads");

function asAdmin() {
  mockedSession.mockResolvedValue({ user: { role: "ADMIN" } });
}
function asAnonymous() {
  mockedSession.mockResolvedValue(null);
}

function makeRequest(form: FormData, extraHeaders: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/upload", {
    method: "POST",
    body: form,
    headers: extraHeaders,
  });
}

let writtenBefore: string[] = [];

beforeEach(async () => {
  mockedSession.mockReset();
  writtenBefore = existsSync(uploadDir) ? await readdir(uploadDir) : [];
});

afterEach(async () => {
  if (!existsSync(uploadDir)) return;
  const after = await readdir(uploadDir);
  const newFiles = after.filter((f) => !writtenBefore.includes(f));
  await Promise.all(newFiles.map((f) => unlink(path.join(uploadDir, f)).catch(() => {})));
});

describe("/api/upload", () => {
  it("rejects unauthenticated requests without writing a file", async () => {
    asAnonymous();
    const form = new FormData();
    form.set("file", new File([PNG_BYTES], "logo.png", { type: "image/png" }));
    const res = await POST(makeRequest(form));
    expect(res.status).toBe(401);
  });

  it("accepts a small valid PNG for an authenticated user", async () => {
    asAdmin();
    const form = new FormData();
    form.set("file", new File([PNG_BYTES], "logo.png", { type: "image/png" }));
    const res = await POST(makeRequest(form));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.url).toMatch(/^\/uploads\/upload_.*\.png$/);
  });

  it("rejects a disallowed MIME type", async () => {
    asAdmin();
    const form = new FormData();
    form.set("file", new File([Buffer.from("hello")], "note.txt", { type: "text/plain" }));
    const res = await POST(makeRequest(form));
    expect(res.status).toBe(400);
  });

  it("rejects content that doesn't match its claimed image MIME type (spoofed Content-Type)", async () => {
    asAdmin();
    const maliciousHtml = Buffer.from("<html><body><script>alert(document.cookie)</script></body></html>", "utf8");
    const form = new FormData();
    // Claims to be a PNG via both filename and MIME type, but the bytes are HTML.
    form.set("file", new File([maliciousHtml], "evil.png", { type: "image/png" }));
    const res = await POST(makeRequest(form));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toBeTruthy();
  });

  it("never uses the client-supplied filename/extension for the saved file (no .html ever written)", async () => {
    asAdmin();
    const form = new FormData();
    // Valid PNG bytes, but an attacker-chosen .html filename.
    form.set("file", new File([PNG_BYTES], "../../evil.html", { type: "image/png" }));
    const res = await POST(makeRequest(form));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.url).not.toContain("evil");
    expect(body.url).not.toContain("..");
    expect(body.url.endsWith(".png")).toBe(true);
  });

  it("rejects a file larger than the configured limit", async () => {
    asAdmin();
    const big = Buffer.concat([PNG_BYTES, Buffer.alloc(6 * 1024 * 1024, 0)]); // ~6MB, over the 5MB cap
    const form = new FormData();
    form.set("file", new File([big], "big.png", { type: "image/png" }));
    const res = await POST(makeRequest(form));
    expect(res.status).toBe(413);
  });
});
