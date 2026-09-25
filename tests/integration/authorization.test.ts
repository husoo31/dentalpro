// Integration tests against a real local PostgreSQL instance (see tests/setup.ts /
// vitest.config.ts). Never point DATABASE_URL at a shared or production database when
// running this suite: it creates and deletes real rows.
import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
// revalidatePath requires a live Next.js request context; it's a no-op cache hint here,
// not something these action-level tests exercise.
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { getServerSession } from "next-auth";
const mockedSession = getServerSession as unknown as ReturnType<typeof vi.fn>;

import { prisma } from "@/lib/prisma";
import { createDoctor, updateDoctor, deleteDoctor } from "@/lib/actions/doctors";
import { createTreatment, updateTreatment, deleteTreatment } from "@/lib/actions/treatments";
import { createPost, updatePost, deletePost } from "@/lib/actions/blog";
import { createGallery, updateGallery, deleteGallery } from "@/lib/actions/gallery";
import { createBeforeAfter, updateBeforeAfter, deleteBeforeAfter } from "@/lib/actions/before-after";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/actions/testimonials";
import { getSettings, updateSettings } from "@/lib/actions/settings";

function unique(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function asAdmin() {
  mockedSession.mockResolvedValue({ user: { role: "ADMIN" } });
}
function asAnonymous() {
  mockedSession.mockResolvedValue(null);
}

beforeEach(() => mockedSession.mockReset());
afterAll(async () => {
  await prisma.$disconnect();
});

describe("doctors: unauthenticated RED / ADMIN PASS", () => {
  const slug = unique("doctor");

  it("create: rejected when unauthenticated, no row written", async () => {
    asAnonymous();
    const res = await createDoctor({ full_name: "Test Dr", slug, title: "Diş Hekimi" });
    expect(res.error).toBeTruthy();
    expect(await prisma.doctor.count({ where: { slug } })).toBe(0);
  });

  it("create: allowed for ADMIN", async () => {
    asAdmin();
    const res = await createDoctor({ full_name: "Test Dr", slug, title: "Diş Hekimi" });
    expect(res.success).toBe(true);
  });

  it("update: rejected when unauthenticated, row unchanged", async () => {
    const doctor = await prisma.doctor.findFirstOrThrow({ where: { slug } });
    asAnonymous();
    const res = await updateDoctor(doctor.id, { full_name: "Hacked", slug, title: "Diş Hekimi" });
    expect(res.error).toBeTruthy();
    expect((await prisma.doctor.findUniqueOrThrow({ where: { id: doctor.id } })).full_name).toBe("Test Dr");
  });

  it("update: allowed for ADMIN", async () => {
    const doctor = await prisma.doctor.findFirstOrThrow({ where: { slug } });
    asAdmin();
    const res = await updateDoctor(doctor.id, { full_name: "Updated Dr", slug, title: "Diş Hekimi" });
    expect(res.success).toBe(true);
  });

  it("delete: rejected when unauthenticated, row still exists", async () => {
    const doctor = await prisma.doctor.findFirstOrThrow({ where: { slug } });
    asAnonymous();
    const res = await deleteDoctor(doctor.id);
    expect(res.error).toBeTruthy();
    expect(await prisma.doctor.count({ where: { id: doctor.id } })).toBe(1);
  });

  it("delete: allowed for ADMIN", async () => {
    const doctor = await prisma.doctor.findFirstOrThrow({ where: { slug } });
    asAdmin();
    const res = await deleteDoctor(doctor.id);
    expect(res.success).toBe(true);
    expect(await prisma.doctor.count({ where: { id: doctor.id } })).toBe(0);
  });
});

describe("treatments: unauthenticated RED / ADMIN PASS", () => {
  const slug = unique("treatment");

  it("create: rejected when unauthenticated, no row written", async () => {
    asAnonymous();
    const res = await createTreatment({ name: "Test Treatment", slug });
    expect(res.error).toBeTruthy();
    expect(await prisma.treatment.count({ where: { slug } })).toBe(0);
  });

  it("create: allowed for ADMIN", async () => {
    asAdmin();
    const res = await createTreatment({ name: "Test Treatment", slug });
    expect(res.success).toBe(true);
  });

  it("update: rejected when unauthenticated, row unchanged", async () => {
    const treatment = await prisma.treatment.findFirstOrThrow({ where: { slug } });
    asAnonymous();
    const res = await updateTreatment(treatment.id, { name: "Hacked", slug });
    expect(res.error).toBeTruthy();
    expect((await prisma.treatment.findUniqueOrThrow({ where: { id: treatment.id } })).name).toBe("Test Treatment");
  });

  it("update: allowed for ADMIN", async () => {
    const treatment = await prisma.treatment.findFirstOrThrow({ where: { slug } });
    asAdmin();
    const res = await updateTreatment(treatment.id, { name: "Updated Treatment", slug });
    expect(res.success).toBe(true);
  });

  it("delete: rejected when unauthenticated, row still exists", async () => {
    const treatment = await prisma.treatment.findFirstOrThrow({ where: { slug } });
    asAnonymous();
    const res = await deleteTreatment(treatment.id);
    expect(res.error).toBeTruthy();
    expect(await prisma.treatment.count({ where: { id: treatment.id } })).toBe(1);
  });

  it("delete: allowed for ADMIN", async () => {
    const treatment = await prisma.treatment.findFirstOrThrow({ where: { slug } });
    asAdmin();
    const res = await deleteTreatment(treatment.id);
    expect(res.success).toBe(true);
    expect(await prisma.treatment.count({ where: { id: treatment.id } })).toBe(0);
  });
});

describe("blog posts: unauthenticated RED / ADMIN PASS", () => {
  const slug = unique("post");

  it("create: rejected when unauthenticated, no row written", async () => {
    asAnonymous();
    const res = await createPost({ title: "Test Post", slug, content: "<p>hi</p>" });
    expect(res.error).toBeTruthy();
    expect(await prisma.post.count({ where: { slug } })).toBe(0);
  });

  it("create: allowed for ADMIN", async () => {
    asAdmin();
    const res = await createPost({ title: "Test Post", slug, content: "<p>hi</p>" });
    expect(res.success).toBe(true);
  });

  it("update: rejected when unauthenticated, row unchanged", async () => {
    const post = await prisma.post.findFirstOrThrow({ where: { slug } });
    asAnonymous();
    const res = await updatePost(post.id, { title: "Hacked", slug, content: "<p>hi</p>" });
    expect(res.error).toBeTruthy();
    expect((await prisma.post.findUniqueOrThrow({ where: { id: post.id } })).title).toBe("Test Post");
  });

  it("update: allowed for ADMIN", async () => {
    const post = await prisma.post.findFirstOrThrow({ where: { slug } });
    asAdmin();
    const res = await updatePost(post.id, { title: "Updated Post", slug, content: "<p>hi</p>" });
    expect(res.success).toBe(true);
  });

  it("delete: rejected when unauthenticated, row still exists", async () => {
    const post = await prisma.post.findFirstOrThrow({ where: { slug } });
    asAnonymous();
    const res = await deletePost(post.id);
    expect(res.error).toBeTruthy();
    expect(await prisma.post.count({ where: { id: post.id } })).toBe(1);
  });

  it("delete: allowed for ADMIN", async () => {
    const post = await prisma.post.findFirstOrThrow({ where: { slug } });
    asAdmin();
    const res = await deletePost(post.id);
    expect(res.success).toBe(true);
    expect(await prisma.post.count({ where: { id: post.id } })).toBe(0);
  });
});

describe("gallery: unauthenticated RED / ADMIN PASS", () => {
  let createdId: string;

  it("create: rejected when unauthenticated, no row written", async () => {
    asAnonymous();
    const before = await prisma.gallery.count();
    const res = await createGallery({ title: "Test Gallery", category: "genel", image_url: "/uploads/test.jpg" });
    expect(res.error).toBeTruthy();
    expect(await prisma.gallery.count()).toBe(before);
  });

  it("create: allowed for ADMIN", async () => {
    asAdmin();
    const res = await createGallery({ title: "Test Gallery", category: "genel", image_url: "/uploads/test.jpg" });
    expect(res.success).toBe(true);
    createdId = (await prisma.gallery.findFirstOrThrow({ where: { title: "Test Gallery" } })).id;
  });

  it("update: rejected when unauthenticated, row unchanged", async () => {
    asAnonymous();
    const res = await updateGallery(createdId, { title: "Hacked", category: "genel", image_url: "/uploads/test.jpg" });
    expect(res.error).toBeTruthy();
    expect((await prisma.gallery.findUniqueOrThrow({ where: { id: createdId } })).title).toBe("Test Gallery");
  });

  it("update: allowed for ADMIN", async () => {
    asAdmin();
    const res = await updateGallery(createdId, { title: "Updated Gallery", category: "genel", image_url: "/uploads/test.jpg" });
    expect(res.success).toBe(true);
  });

  it("delete: rejected when unauthenticated, row still exists", async () => {
    asAnonymous();
    const res = await deleteGallery(createdId);
    expect(res.error).toBeTruthy();
    expect(await prisma.gallery.count({ where: { id: createdId } })).toBe(1);
  });

  it("delete: allowed for ADMIN", async () => {
    asAdmin();
    const res = await deleteGallery(createdId);
    expect(res.success).toBe(true);
    expect(await prisma.gallery.count({ where: { id: createdId } })).toBe(0);
  });
});

describe("before-after: unauthenticated RED / ADMIN PASS", () => {
  let createdId: string;
  const title = unique("before-after");

  it("create: rejected when unauthenticated, no row written", async () => {
    asAnonymous();
    const res = await createBeforeAfter({ title, before_image: "/uploads/b.jpg", after_image: "/uploads/a.jpg" });
    expect(res.error).toBeTruthy();
    expect(await prisma.beforeAfter.count({ where: { title } })).toBe(0);
  });

  it("create: allowed for ADMIN", async () => {
    asAdmin();
    const res = await createBeforeAfter({ title, before_image: "/uploads/b.jpg", after_image: "/uploads/a.jpg" });
    expect(res.success).toBe(true);
    createdId = (await prisma.beforeAfter.findFirstOrThrow({ where: { title } })).id;
  });

  it("update: rejected when unauthenticated, row unchanged", async () => {
    asAnonymous();
    const res = await updateBeforeAfter(createdId, { title: "Hacked", before_image: "/uploads/b.jpg", after_image: "/uploads/a.jpg" });
    expect(res.error).toBeTruthy();
    expect((await prisma.beforeAfter.findUniqueOrThrow({ where: { id: createdId } })).title).toBe(title);
  });

  it("update: allowed for ADMIN", async () => {
    asAdmin();
    const res = await updateBeforeAfter(createdId, { title: title + "-updated", before_image: "/uploads/b.jpg", after_image: "/uploads/a.jpg" });
    expect(res.success).toBe(true);
  });

  it("delete: rejected when unauthenticated, row still exists", async () => {
    asAnonymous();
    const res = await deleteBeforeAfter(createdId);
    expect(res.error).toBeTruthy();
    expect(await prisma.beforeAfter.count({ where: { id: createdId } })).toBe(1);
  });

  it("delete: allowed for ADMIN", async () => {
    asAdmin();
    const res = await deleteBeforeAfter(createdId);
    expect(res.success).toBe(true);
    expect(await prisma.beforeAfter.count({ where: { id: createdId } })).toBe(0);
  });
});

describe("testimonials: unauthenticated RED / ADMIN PASS", () => {
  let createdId: string;
  const patient_name = unique("testimonial-patient");

  it("create: rejected when unauthenticated, no row written", async () => {
    asAnonymous();
    const res = await createTestimonial({ patient_name, text: "Harika bir deneyimdi.", rating: 5 });
    expect(res.error).toBeTruthy();
    expect(await prisma.testimonial.count({ where: { patient_name } })).toBe(0);
  });

  it("create: allowed for ADMIN", async () => {
    asAdmin();
    const res = await createTestimonial({ patient_name, text: "Harika bir deneyimdi.", rating: 5 });
    expect(res.success).toBe(true);
    createdId = (await prisma.testimonial.findFirstOrThrow({ where: { patient_name } })).id;
  });

  it("update: rejected when unauthenticated, row unchanged", async () => {
    asAnonymous();
    const res = await updateTestimonial(createdId, { patient_name: "Hacked", text: "x", rating: 1 });
    expect(res.error).toBeTruthy();
    expect((await prisma.testimonial.findUniqueOrThrow({ where: { id: createdId } })).patient_name).toBe(patient_name);
  });

  it("update: allowed for ADMIN", async () => {
    asAdmin();
    const res = await updateTestimonial(createdId, { patient_name, text: "Güncellendi.", rating: 4 });
    expect(res.success).toBe(true);
  });

  it("delete: rejected when unauthenticated, row still exists", async () => {
    asAnonymous();
    const res = await deleteTestimonial(createdId);
    expect(res.error).toBeTruthy();
    expect(await prisma.testimonial.count({ where: { id: createdId } })).toBe(1);
  });

  it("delete: allowed for ADMIN", async () => {
    asAdmin();
    const res = await deleteTestimonial(createdId);
    expect(res.success).toBe(true);
    expect(await prisma.testimonial.count({ where: { id: createdId } })).toBe(0);
  });
});

describe("settings: unauthenticated RED / ADMIN PASS", () => {
  it("update: rejected when unauthenticated, value not persisted", async () => {
    const marker = unique("clinic");
    asAnonymous();
    const res = await updateSettings({ clinicName: marker });
    expect(res.error).toBeTruthy();
    const settings = await getSettings();
    expect(settings.clinicName).not.toBe(marker);
  });

  it("update: allowed for ADMIN", async () => {
    const marker = unique("clinic");
    asAdmin();
    const res = await updateSettings({ clinicName: marker });
    expect(res.success).toBe(true);
    const settings = await getSettings();
    expect(settings.clinicName).toBe(marker);
  });
});
