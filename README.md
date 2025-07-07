# Personal Web Dashboard - Next.js, Prisma, NextAuth

Dashboard modern dengan tema dark, autentikasi custom, Todo List, dan Job Application tracker per user.

## Fitur Utama

- **Autentikasi custom** (NextAuth + Prisma, tanpa avatar/gambar)
- **Todo List** per user: CRUD, deadline, reminder otomatis, drag & drop urutan
- **Job Application Tracker**: CRUD, status (pending/accept/reject), stats breakdown
- **Proteksi akses** (RequireAuth)
- **Edit profil** (nama & password, tanpa gambar)
- **Notifikasi Toast** di semua aksi utama
- **Widget Motivational Quote** & **Mini Calendar**
- **Stats Section** real-time (productivity, streak, breakdown)
- **UI/UX dark modern**: responsif, animasi, grid, sticky navbar, minimalis footer

## Cara Menjalankan

1. **Install dependencies:**
   ```bash
   npm install
   # atau
   yarn install
   ```
2. **Setup database:**
   - Edit `prisma/schema.prisma` jika perlu
   - Jalankan migrasi & generate Prisma Client:
     ```bash
     npx prisma migrate dev --name init
     npx prisma generate
     ```
3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
4. **Akses di browser:**
   [http://localhost:3000](http://localhost:3000)

## Struktur Fitur

- **Autentikasi:**
  - Register, login, proteksi akses, edit profil (tanpa gambar)
- **Todo List:**
  - CRUD, deadline, reminder <24 jam, drag & drop, urutan tersimpan
- **Job Application:**
  - CRUD, status, stats breakdown, tampilan tabel (desktop) & card (mobile)
- **Widget:**
  - Motivational Quote, Mini Calendar
- **Stats Section:**
  - Real-time, productivity, streak, breakdown

## Teknologi

- Next.js App Router
- Prisma ORM + SQLite/Postgres
- NextAuth (CredentialsProvider)
- bcryptjs (hash password)
- TailwindCSS (dark theme, animasi, grid)
- @hello-pangea/dnd (drag & drop)

## Catatan

- Tidak ada fitur upload/preview gambar profil
- Semua aksi utama ada notifikasi Toast
- Sudah dioptimalkan untuk mobile & desktop
- Script `postinstall` otomatis generate Prisma Client (untuk deploy Vercel)

---

> Dibuat untuk latihan Next.js, Prisma, dan UI/UX modern. Silakan fork/clone & kembangkan sesuai kebutuhan!
