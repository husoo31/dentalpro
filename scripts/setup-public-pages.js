const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'src', 'app', '(public)');

// Treatments Listing
const treatmentsDir = path.join(publicDir, 'tedaviler');
fs.mkdirSync(treatmentsDir, { recursive: true });

fs.writeFileSync(path.join(treatmentsDir, 'page.tsx'), `
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const dynamic = 'force-dynamic';

export default async function TreatmentsPage() {
  const treatments = await prisma.treatment.findMany({
    where: { is_active: true },
    orderBy: { sort_order: 'asc' }
  });

  return (
    <>
      <section className="section-padding bg-alt">
        <div className="container" style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
          <h1 className="reveal active">Our Expertise</h1>
          <p style={{ maxWidth: "600px", margin: "0 auto" }}>Explore our comprehensive range of premium dental treatments designed to restore, enhance, and maintain your perfect smile.</p>
        </div>
        
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--spacing-8)" }}>
          {treatments.map((t) => (
            <div key={t.id} style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
              <div style={{ height: "200px", background: "var(--color-surface-hover)", position: "relative" }}>
                {t.image_url ? (
                  <img src={t.image_url} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-text-muted)" }}>No Image</div>
                )}
              </div>
              <div style={{ padding: "var(--spacing-5)" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--spacing-2)" }}>{t.name}</h3>
                <p style={{ fontSize: "0.9rem", marginBottom: "var(--spacing-4)" }}>{t.short_description || "Premium dental care for your needs."}</p>
                <Button href={\`/tedaviler/\${t.slug}\`} variant="ghost" style={{ paddingLeft: 0 }}>Discover Treatment &rarr;</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
`);

// Treatment Detail
const treatmentDetailDir = path.join(treatmentsDir, '[slug]');
fs.mkdirSync(treatmentDetailDir, { recursive: true });

fs.writeFileSync(path.join(treatmentDetailDir, 'page.tsx'), `
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";

export const dynamic = 'force-dynamic';

export default async function TreatmentDetailPage({ params }: { params: { slug: string } }) {
  const treatment = await prisma.treatment.findUnique({
    where: { slug: params.slug }
  });

  if (!treatment) notFound();

  return (
    <article>
      <section style={{ padding: "var(--spacing-16) 0", background: "var(--color-primary)", color: "var(--color-text-inverse)" }}>
        <div className="container">
          <Button href="/tedaviler" variant="ghost" style={{ color: "rgba(255,255,255,0.7)", marginBottom: "var(--spacing-4)", paddingLeft: 0 }}>&larr; Back to Treatments</Button>
          <h1 style={{ color: "var(--color-text-inverse)" }}>{treatment.name}</h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "600px", color: "rgba(255,255,255,0.8)" }}>{treatment.short_description}</p>
        </div>
      </section>

      <section className="section-padding container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--spacing-12)" }}>
        <div>
          <h2>Treatment Overview</h2>
          <div style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--color-text-main)" }} dangerouslySetInnerHTML={{ __html: treatment.full_description || "<p>Detailed description coming soon.</p>" }} />
        </div>
        <div>
          <div style={{ background: "var(--color-surface-alt)", padding: "var(--spacing-6)", borderRadius: "var(--radius-lg)", position: "sticky", top: "100px" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--spacing-4)" }}>Ready to transform your smile?</h3>
            <Button href={\`/randevu?treatment=\${treatment.id}\`} variant="primary" style={{ width: "100%" }}>Book a Consultation</Button>
          </div>
        </div>
      </section>
    </article>
  );
}
`);

// Doctors Listing
const doctorsDir = path.join(publicDir, 'doktorlar');
fs.mkdirSync(doctorsDir, { recursive: true });
fs.writeFileSync(path.join(doctorsDir, 'page.tsx'), `
import { prisma } from "@/lib/prisma";
import Button from "@/components/ui/Button";

export const dynamic = 'force-dynamic';

export default async function DoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    where: { is_active: true },
    orderBy: { sort_order: 'asc' }
  });

  return (
    <section className="section-padding container">
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
        <h1>Our Specialists</h1>
        <p style={{ maxWidth: "600px", margin: "0 auto" }}>Meet the world-class dental experts dedicated to your smile.</p>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--spacing-8)" }}>
        {doctors.map((d) => (
          <div key={d.id} style={{ textAlign: "center" }}>
            <div style={{ width: "200px", height: "200px", borderRadius: "50%", margin: "0 auto var(--spacing-4)", background: "var(--color-surface-alt)", overflow: "hidden" }}>
              {d.image_url ? (
                <img src={d.image_url} alt={d.full_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                 <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>Photo</div>
              )}
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--spacing-1)" }}>{d.title} {d.full_name}</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "var(--spacing-3)" }}>{d.bio ? d.bio.substring(0, 50) + "..." : "Specialist"}</p>
            <Button href={\`/doktorlar/\${d.slug}\`} variant="outline" size="sm">View Profile</Button>
          </div>
        ))}
      </div>
    </section>
  );
}
`);

// Gallery Page
const galleryDir = path.join(publicDir, 'galeri');
fs.mkdirSync(galleryDir, { recursive: true });
fs.writeFileSync(path.join(galleryDir, 'page.tsx'), `
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const items = await prisma.gallery.findMany({
    orderBy: { sort_order: 'asc' }
  });

  return (
    <section className="section-padding container">
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
        <h1>Clinic Gallery</h1>
        <p>Take a tour of our state-of-the-art facility.</p>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--spacing-4)" }}>
        {items.map((img) => (
          <div key={img.id} style={{ aspectUrl: "1", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--color-surface-alt)" }}>
            <img src={img.image_url} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>
    </section>
  );
}
`);

console.log("Public pages (Treatments, Doctors, Gallery) scaffolded.");
