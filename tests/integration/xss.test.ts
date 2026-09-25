// Integration tests against a real local PostgreSQL instance (see tests/setup.ts).
// Confirms sanitization actually happens where content is written, not just in the
// sanitizeRichText unit, and that the row stored in the DB is clean.
import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { getServerSession } from "next-auth";
const mockedSession = getServerSession as unknown as ReturnType<typeof vi.fn>;

import { prisma } from "@/lib/prisma";
import { createTreatment } from "@/lib/actions/treatments";
import { createPost } from "@/lib/actions/blog";

function asAdmin() {
  mockedSession.mockResolvedValue({ user: { role: "ADMIN" } });
}
function unique(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

beforeEach(() => mockedSession.mockReset());
afterAll(async () => {
  await prisma.$disconnect();
});

describe("malicious HTML is sanitized before it reaches the database", () => {
  it("strips <script>/onerror from Treatment.full_description on create", async () => {
    asAdmin();
    const slug = unique("xss-treatment");
    const res = await createTreatment({
      name: "XSS Test Treatment",
      slug,
      full_description: '<p>Merhaba</p><script>alert(document.cookie)</script><img src=x onerror=alert(1)>',
    });
    expect(res.success).toBe(true);

    const saved = await prisma.treatment.findUniqueOrThrow({ where: { slug } });
    expect(saved.full_description).not.toContain("<script");
    expect(saved.full_description).not.toContain("onerror");
    expect(saved.full_description).not.toContain("alert(");
    expect(saved.full_description).toContain("Merhaba");

    await prisma.treatment.delete({ where: { id: saved.id } });
  });

  it("strips <script> from Post.content on create", async () => {
    asAdmin();
    const slug = unique("xss-post");
    const res = await createPost({
      title: "XSS Test Post",
      slug,
      content: '<p>Merhaba</p><script>alert(1)</script><a href="javascript:alert(2)">link</a>',
    });
    expect(res.success).toBe(true);

    const saved = await prisma.post.findUniqueOrThrow({ where: { slug } });
    expect(saved.content).not.toContain("<script");
    expect(saved.content).not.toContain("javascript:");
    expect(saved.content).toContain("Merhaba");

    await prisma.post.delete({ where: { id: saved.id } });
  });
});
