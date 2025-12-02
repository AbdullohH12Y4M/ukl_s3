import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', adminUser.username);

  // 2. Create Mahasiswa Users
  const mahasiswaUser1 = await prisma.user.upsert({
    where: { username: 'mhs001' },
    update: {},
    create: {
      username: 'mhs001',
      password: hashedPassword,
      role: 'MAHASISWA',
    },
  });

  const mahasiswaUser2 = await prisma.user.upsert({
    where: { username: 'mhs002' },
    update: {},
    create: {
      username: 'mhs002',
      password: hashedPassword,
      role: 'MAHASISWA',
    },
  });
  console.log('✅ Mahasiswa users created');

  // 3. Create Dosen
  const dosen1 = await prisma.dosen.upsert({
    where: { nidn: '0123456789' },
    update: {},
    create: {
      nidn: '0123456789',
      nama: 'Dr. Budi Santoso, M.Kom',
      email: 'budi.santoso@univ.ac.id',
      telepon: '081234567890',
    },
  });

  const dosen2 = await prisma.dosen.upsert({
    where: { nidn: '0987654321' },
    update: {},
    create: {
      nidn: '0987654321',
      nama: 'Prof. Siti Aminah, M.T',
      email: 'siti.aminah@univ.ac.id',
      telepon: '081234567891',
    },
  });

  const dosen3 = await prisma.dosen.upsert({
    where: { nidn: '0112233445' },
    update: {},
    create: {
      nidn: '0112233445',
      nama: 'Dr. Ahmad Fauzi, S.Kom, M.Sc',
      email: 'ahmad.fauzi@univ.ac.id',
      telepon: '081234567892',
    },
  });
  console.log('✅ Dosen created:', [dosen1.nama, dosen2.nama, dosen3.nama]);

  // 4. Create Matakuliah
  const mk1 = await prisma.matakuliah.upsert({
    where: { kode: 'IF101' },
    update: {},
    create: {
      kode: 'IF101',
      nama: 'Pemrograman Web',
      sks: 3,
      semester: 3,
    },
  });

  const mk2 = await prisma.matakuliah.upsert({
    where: { kode: 'IF102' },
    update: {},
    create: {
      kode: 'IF102',
      nama: 'Basis Data',
      sks: 4,
      semester: 3,
    },
  });

  const mk3 = await prisma.matakuliah.upsert({
    where: { kode: 'IF103' },
    update: {},
    create: {
      kode: 'IF103',
      nama: 'Algoritma dan Struktur Data',
      sks: 3,
      semester: 3,
    },
  });

  const mk4 = await prisma.matakuliah.upsert({
    where: { kode: 'IF104' },
    update: {},
    create: {
      kode: 'IF104',
      nama: 'Sistem Operasi',
      sks: 3,
      semester: 3,
    },
  });

  const mk5 = await prisma.matakuliah.upsert({
    where: { kode: 'IF105' },
    update: {},
    create: {
      kode: 'IF105',
      nama: 'Jaringan Komputer',
      sks: 2,
      semester: 3,
    },
  });

  const mk6 = await prisma.matakuliah.upsert({
    where: { kode: 'IF106' },
    update: {},
    create: {
      kode: 'IF106',
      nama: 'Pemrograman Mobile',
      sks: 3,
      semester: 3,
    },
  });

  const mk7 = await prisma.matakuliah.upsert({
    where: { kode: 'IF107' },
    update: {},
    create: {
      kode: 'IF107',
      nama: 'Keamanan Informasi',
      sks: 2,
      semester: 3,
    },
  });
  console.log('✅ Matakuliah created: 7 items');

  // 5. Create Mahasiswa
  const mahasiswa1 = await prisma.mahasiswa.upsert({
    where: { nim: '2021001' },
    update: {},
    create: {
      nim: '2021001',
      nama: 'Andi Wijaya',
      email: 'andi.wijaya@student.univ.ac.id',
      telepon: '081234567893',
      angkatan: '2021',
      userId: mahasiswaUser1.id,
    },
  });

  const mahasiswa2 = await prisma.mahasiswa.upsert({
    where: { nim: '2021002' },
    update: {},
    create: {
      nim: '2021002',
      nama: 'Dewi Lestari',
      email: 'dewi.lestari@student.univ.ac.id',
      telepon: '081234567894',
      angkatan: '2021',
      userId: mahasiswaUser2.id,
    },
  });
  console.log('✅ Mahasiswa created:', [mahasiswa1.nama, mahasiswa2.nama]);

  // 6. Create Penjadwalan
  await prisma.penjadwalan.createMany({
    data: [
      {
        matakuliahId: mk1.id,
        dosenNidn: dosen1.nidn,
        ruangan: 'R301',
        hari: 'SENIN',
        jamMulai: '08:00',
        jamSelesai: '10:30',
        tahunAjaran: '2024/2025',
        semester: 'GANJIL',
      },
      {
        matakuliahId: mk2.id,
        dosenNidn: dosen2.nidn,
        ruangan: 'R302',
        hari: 'SENIN',
        jamMulai: '13:00',
        jamSelesai: '16:20',
        tahunAjaran: '2024/2025',
        semester: 'GANJIL',
      },
      {
        matakuliahId: mk3.id,
        dosenNidn: dosen1.nidn,
        ruangan: 'R303',
        hari: 'SELASA',
        jamMulai: '08:00',
        jamSelesai: '10:30',
        tahunAjaran: '2024/2025',
        semester: 'GANJIL',
      },
      {
        matakuliahId: mk4.id,
        dosenNidn: dosen3.nidn,
        ruangan: 'Lab Komputer 1',
        hari: 'RABU',
        jamMulai: '08:00',
        jamSelesai: '10:30',
        tahunAjaran: '2024/2025',
        semester: 'GANJIL',
      },
      {
        matakuliahId: mk5.id,
        dosenNidn: dosen2.nidn,
        ruangan: 'R304',
        hari: 'RABU',
        jamMulai: '13:00',
        jamSelesai: '14:40',
        tahunAjaran: '2024/2025',
        semester: 'GANJIL',
      },
      {
        matakuliahId: mk6.id,
        dosenNidn: dosen3.nidn,
        ruangan: 'Lab Komputer 2',
        hari: 'KAMIS',
        jamMulai: '08:00',
        jamSelesai: '10:30',
        tahunAjaran: '2024/2025',
        semester: 'GANJIL',
      },
      {
        matakuliahId: mk7.id,
        dosenNidn: dosen1.nidn,
        ruangan: 'R305',
        hari: 'JUMAT',
        jamMulai: '08:00',
        jamSelesai: '09:40',
        tahunAjaran: '2024/2025',
        semester: 'GANJIL',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Penjadwalan created: 7 items');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin:');
  console.log('  username: admin');
  console.log('  password: password123');
  console.log('\nMahasiswa:');
  console.log('  username: mhs001 / mhs002');
  console.log('  password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });