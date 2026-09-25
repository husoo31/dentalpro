const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'src', 'app', '(public)');
const componentsDir = path.join(__dirname, '..', 'src', 'components');

const pageCode = `
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <div className={styles.heroOverlay}></div>
          <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2000&auto=format&fit=crop" alt="Premium Clinic" className={styles.heroImage} />
        </div>
        
        <div className={\`container \${styles.heroContent}\`}>
          <p className={\`\${styles.subtitle} reveal active\`}>WELCOME TO DENTALPRO</p>
          <h1 className="reveal active">Elevating Dental Care<br />To An Art Form.</h1>
          <p className={\`\${styles.heroDesc} reveal active\`}>Experience world-class dentistry in a serene, state-of-the-art environment designed for your absolute comfort.</p>
          <div className={\`\${styles.heroActions} reveal active\`}>
            <Button href="/randevu" size="lg" variant="primary">Book Appointment</Button>
            <Button href="/tedaviler" size="lg" variant="outline" className={styles.heroSecondaryBtn}>Our Expertise</Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className={\`container \${styles.introGrid}\`}>
          <div className={styles.introText}>
            <h2>Redefining Your <br/> Dental Experience</h2>
            <p>At DentalPro, we believe that a visit to the dentist should be something you look forward to. We combine the latest clinical advancements with a luxurious, spa-like atmosphere to ensure your journey to a perfect smile is completely stress-free.</p>
            <Button href="/hakkimizda" variant="ghost">Discover our philosophy &rarr;</Button>
          </div>
          <div className={styles.introImageWrapper}>
            <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1000&auto=format&fit=crop" alt="Clinic Interior" className={styles.introImage} />
          </div>
        </div>
      </section>

      <section className="section-padding bg-alt">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Signature Treatments</h2>
            <p>Comprehensive care tailored to your unique smile.</p>
          </div>
          
          <div className={styles.treatmentsGrid}>
            {[
              { title: "Dental Implants", desc: "Permanent, natural-looking tooth replacement.", img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=600&auto=format&fit=crop" },
              { title: "Cosmetic Dentistry", desc: "Veneers, whitening, and complete smile makeovers.", img: "https://images.unsplash.com/photo-1598256989800-fea5f6c8d0bd?q=80&w=600&auto=format&fit=crop" },
              { title: "Orthodontics", desc: "Clear aligners for perfectly straight teeth.", img: "https://images.unsplash.com/photo-1522849595462-805118b628c4?q=80&w=600&auto=format&fit=crop" }
            ].map((t, i) => (
              <div key={i} className={styles.treatmentCard}>
                <div className={styles.treatmentImgWrapper}>
                  <img src={t.img} alt={t.title} />
                </div>
                <div className={styles.treatmentCardContent}>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                  <Button variant="ghost" className={styles.treatmentBtn}>Learn More &rarr;</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary">
        <div className={\`container \${styles.ctaSection}\`}>
          <h2>Ready for your new smile?</h2>
          <p>Schedule your private consultation today.</p>
          <Button href="/randevu" size="lg" variant="secondary">Request an Appointment</Button>
        </div>
      </section>
    </>
  );
}
`;
fs.writeFileSync(path.join(publicDir, 'page.tsx'), pageCode);

const pageCss = `
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
}

.heroImageWrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.heroImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heroOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(11, 15, 25, 0.8) 0%, rgba(11, 15, 25, 0.4) 100%);
}

.heroContent {
  color: var(--color-text-inverse);
  max-width: 800px;
}

.heroContent h1 {
  color: var(--color-text-inverse);
  font-size: clamp(3rem, 7vw, 6rem);
  margin-bottom: var(--spacing-4);
}

.subtitle {
  font-family: var(--font-inter);
  color: var(--color-accent);
  letter-spacing: 0.2em;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: var(--spacing-3);
  text-transform: uppercase;
}

.heroDesc {
  color: rgba(255, 255, 255, 0.8);
  font-size: clamp(1.125rem, 2vw, 1.35rem);
  margin-bottom: var(--spacing-8);
  max-width: 600px;
}

.heroActions {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.heroSecondaryBtn {
  border-color: rgba(255, 255, 255, 0.5);
  color: var(--color-text-inverse);
}
.heroSecondaryBtn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-text-inverse);
}

/* Intro Section */
.introGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-12);
  align-items: center;
}
@media (min-width: 1024px) {
  .introGrid {
    grid-template-columns: 1fr 1fr;
  }
}

.introText h2 {
  margin-bottom: var(--spacing-6);
}
.introText p {
  margin-bottom: var(--spacing-6);
}

.introImageWrapper {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-elegant);
  aspect-ratio: 4/5;
}
.introImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Treatments Section */
.sectionHeader {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.treatmentsGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}
@media (min-width: 768px) {
  .treatmentsGrid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .treatmentsGrid { grid-template-columns: repeat(3, 1fr); gap: var(--spacing-8); }
}

.treatmentCard {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
}
.treatmentCard:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.treatmentImgWrapper {
  aspect-ratio: 16/10;
  overflow: hidden;
}
.treatmentImgWrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}
.treatmentCard:hover .treatmentImgWrapper img {
  transform: scale(1.05);
}

.treatmentCardContent {
  padding: var(--spacing-5);
}
.treatmentCardContent h3 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-2);
}
.treatmentBtn {
  padding-left: 0;
  margin-top: var(--spacing-2);
}

/* CTA Section */
.ctaSection {
  text-align: center;
  padding: var(--spacing-8) 0;
}
.ctaSection h2 {
  color: var(--color-text-inverse);
  margin-bottom: var(--spacing-4);
}
.ctaSection p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: var(--spacing-8);
}
`;
fs.writeFileSync(path.join(publicDir, 'page.module.css'), pageCss);

console.log("Premium Homepage scaffolded successfully.");
