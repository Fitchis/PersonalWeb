# Task2Work - Next.js, Prisma, NextAuth, Gemini AI

Dashboard modern dengan tema dark, autentikasi custom, Todo List, Job Application tracker, dan AI Chat Widget (Gemini AI).

## Fitur Utama

- **Autentikasi custom** (NextAuth + Prisma, tanpa avatar/gambar)
- **Todo List** per user: CRUD, deadline, reminder otomatis, drag & drop urutan
- **Job Application Tracker**: CRUD, status (pending/accept/reject), stats breakdown
- **Proteksi akses** (RequireAuth)
- **Edit profil** (nama & password, tanpa gambar)
- **Notifikasi Toast** di semua aksi utama
- **Widget Motivational Quote**, **Mini Calendar** & **PomodoroTimer**
- **Stats Section** real-time (productivity, streak, breakdown)
- **AI Chat Widget** (Gemini AI, OpenAI-ready):
  - Floating chat widget, modern & responsif
  - Pilihan topik (Productivity, Coding Help, Career Advice, General Chat)
  - Reset/New Topic, auto-scroll, typing indicator
  - Gemini AI backend (gratis), bisa diubah ke OpenAI
  - UI/UX polished, desktop & mobile friendly

---

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
- **AI Chat Widget:**
  - Floating, topik, reset, auto-scroll, typing indicator, Gemini AI backend

## Teknologi

- Next.js App Router
- Prisma ORM + SQLite/Postgres
- NextAuth (CredentialsProvider)
- bcryptjs (hash password)
- TailwindCSS (dark theme, animasi, grid)
- @hello-pangea/dnd (drag & drop)
- Gemini AI API (Google Generative Language)
- Resend (email API)

---

---
