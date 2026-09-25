import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dentalpro.com'
  const adminPassword = process.env.ADMIN_PASSWORD

  // No insecure fallback: an admin account must never be seeded with a guessable default
  // password. Fail loudly and tell the operator exactly what to set instead.
  if (!adminPassword || adminPassword.length < 8) {
    throw new Error(
      'ADMIN_PASSWORD env değişkeni ayarlanmamış veya çok kısa (en az 8 karakter gerekli). ' +
      'Seed işlemini çalıştırmadan önce örn. `ADMIN_PASSWORD="guclu-bir-sifre" npm run db:seed` şeklinde set edin. ' +
      'Bkz. .env.example.'
    )
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password_hash: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  // Create Settings
  const settings = [
    { key: 'clinic_name', value: 'DentalPro Clinic', group: 'GENERAL' },
    { key: 'phone', value: '+90 555 123 4567', group: 'CONTACT' },
    { key: 'email', value: 'info@dentalpro.com', group: 'CONTACT' },
    { key: 'address', value: 'İstanbul, Türkiye', group: 'CONTACT' },
  ]

  for (const s of settings) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }
  console.log('Created settings')

  // Create Treatment
  const treatment = await prisma.treatment.upsert({
    where: { slug: 'implant-tedavisi' },
    update: {},
    create: {
      slug: 'implant-tedavisi',
      name: 'İmplant Tedavisi',
      short_description: 'Eksik dişleriniz için kalıcı ve doğal görünümlü çözüm.',
      full_description: '<p>İmplant tedavisi, titanyum vidalar kullanılarak yapılan kalıcı bir çözümdür.</p>',
      is_active: true,
      sort_order: 1,
    }
  })
  console.log('Created treatment')

  // Create Doctor
  const doctor = await prisma.doctor.upsert({
    where: { slug: 'dr-ahmet-yilmaz' },
    update: {},
    create: {
      slug: 'dr-ahmet-yilmaz',
      full_name: 'Dr. Ahmet Yılmaz',
      title: 'Çene Cerrahı',
      bio: '15 yıllık deneyimiyle çene cerrahisi alanında uzmandır.',
      is_active: true,
      sort_order: 1,
    }
  })
  console.log('Created doctor')

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
