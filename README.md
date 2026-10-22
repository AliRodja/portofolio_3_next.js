# Ali Portfolio

Website portfolio pribadi yang dibangun dengan Next.js (App Router), TypeScript, Tailwind CSS, dan Motion.

## Fitur

- **Fullpage scroll** di beranda: berpindah satu layar per section, dengan sidebar ikon yang menandai section aktif
- **Animasi scroll**: judul, teks, dan foto bergeser masuk saat terlihat di layar
- **Menu layar penuh** yang terbuka dengan efek lingkaran dari tombol burger
- **Foto hitam-putih** yang berwarna saat di-hover
- Halaman About: skill per kategori, timeline pengalaman, pendidikan dan prestasi, serta quote dengan efek blur per kata
- Halaman Projects: highlight proyek, filter kategori, halaman detail, dan arsip
- SEO: metadata per halaman, `sitemap.xml`, dan `robots.txt`
- **Dashboard** di `/admin` untuk mengelola profil dan proyek tanpa mengubah kode

## Tech Stack

- **Framework:** Next.js 16 (App Router, Cache Components)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animasi:** Motion (`motion/react`)
- **Ikon:** Font Awesome
- **Font:** Poppins dan Jost (via `next/font`)
- **Database:** Postgres (Neon di production) dengan Drizzle ORM
- **Auth dashboard:** Better Auth, login dengan GitHub
- **Upload gambar:** Vercel Blob
- **Package manager:** pnpm

## Menjalankan Project

Prasyarat: Node.js 20+, pnpm (`corepack enable pnpm`), dan Postgres.

```bash
pnpm install
cp .env.example .env.local   # lalu isi nilainya, lihat di bawah
pnpm db:migrate              # buat tabel
pnpm db:seed                 # isi profil dan proyek contoh (aman dijalankan ulang)
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000). Dashboard ada di [http://localhost:3000/admin](http://localhost:3000/admin).

Perintah lain:

```bash
pnpm lint          # cek kode dengan ESLint
pnpm build         # build production (butuh database yang sudah di-migrate)
pnpm start         # jalankan hasil build
pnpm db:generate   # buat file migration baru setelah mengubah src/db/schema.ts
pnpm db:studio     # lihat isi database di browser
```

### Environment variable

Semua variabel ada di `.env.example`.

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string Postgres. Lokal: Postgres sendiri. Production: Neon. |
| `BETTER_AUTH_SECRET` | String acak, buat dengan `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | URL website, misalnya `http://localhost:3000`. Juga dipakai untuk metadata, sitemap, dan robots.txt. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | Dari GitHub OAuth App (lihat di bawah). |
| `ADMIN_EMAILS` | Email yang boleh masuk dashboard, pisahkan dengan koma. Harus sama dengan email utama akun GitHub. |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob untuk upload gambar. Tanpa ini, gambar tetap bisa diisi dengan path atau URL. |

### Login GitHub

Buat OAuth App di [github.com/settings/developers](https://github.com/settings/developers):

- **Homepage URL:** URL website, misalnya `http://localhost:3000`
- **Authorization callback URL:** `<BETTER_AUTH_URL>/api/auth/callback/github`

Satu OAuth App hanya punya satu callback URL, jadi buat dua: satu untuk lokal dan satu untuk production.

Hanya email di `ADMIN_EMAILS` yang bisa membuat akun. Siapa pun yang login dengan akun GitHub lain akan ditolak.

## Deploy ke Vercel

1. Import repo ke Vercel.
2. Di tab **Storage**, tambahkan database **Neon** (mengisi `DATABASE_URL`) dan **Blob** (mengisi `BLOB_READ_WRITE_TOKEN`).
3. Isi variabel lain di **Settings → Environment Variables**, dengan `BETTER_AUTH_URL` berisi domain production.
4. Ubah **Build Command** menjadi `pnpm db:migrate && pnpm build`, supaya migration berjalan setiap deploy.
5. Setelah deploy pertama, isi data awal sekali dengan menjalankan `pnpm db:seed` dari komputer dengan `DATABASE_URL` production, atau tambahkan proyek langsung dari dashboard.

## Struktur Project

```
src/
├── app/
│   ├── layout.tsx              # Layout utama: html, body, font, metadata
│   ├── (site)/                 # Website publik (route group, tidak memengaruhi URL)
│   │   ├── layout.tsx          # Menambahkan Navbar
│   │   ├── page.tsx            # Beranda (fullpage scroll)
│   │   ├── _components/        # Section beranda
│   │   ├── about/
│   │   │   ├── page.tsx        # Halaman About
│   │   │   └── _components/    # Who Am I, Skills, Experience, Education, Quote
│   │   └── projects/
│   │       ├── page.tsx        # Highlight + daftar proyek
│   │       ├── [slug]/page.tsx # Detail proyek
│   │       ├── archive/page.tsx# Tabel semua proyek
│   │       └── _components/    # Grid proyek dengan filter, tombol scroll
│   ├── admin/                  # Dashboard
│   │   ├── login/              # Halaman login GitHub
│   │   └── (dashboard)/        # Halaman yang butuh login
│   │       ├── layout.tsx      # Sidebar
│   │       ├── page.tsx        # Overview
│   │       ├── _components/    # Sidebar, form, upload gambar/file
│   │       ├── profile/        # Edit profil + Server Action
│   │       └── projects/       # Daftar, tambah, edit proyek + Server Actions
│   ├── api/
│   │   ├── auth/[...all]/      # Endpoint Better Auth
│   │   └── admin/upload/       # Token upload Vercel Blob
│   ├── not-found.tsx           # Halaman 404
│   ├── sitemap.ts              # /sitemap.xml
│   └── robots.ts               # /robots.txt
├── components/                 # Komponen yang dipakai di banyak halaman
│   ├── layout/                 # Navbar, Footer, BackButton
│   ├── ui/                     # Button, Photo, RichText
│   ├── motion/                 # Reveal, DoubleBar
│   └── sections/               # FullPage, PageHero, SectionTitle, SocialLinks
├── db/
│   ├── schema.ts               # Tabel database
│   ├── index.ts                # Koneksi Drizzle
│   └── queries/                # Query yang di-cache untuk halaman publik
├── lib/
│   ├── auth.ts                 # Konfigurasi Better Auth + allowlist email
│   ├── session.ts              # getAdmin() dan requireAdmin()
│   ├── default-profile.ts      # Profil awal sebelum disimpan dari dashboard
│   ├── site-config.ts          # URL website dan menu navbar
│   ├── social-icons.ts         # Platform sosial media yang didukung
│   └── project-categories.ts   # Daftar kategori proyek
└── data/                       # Konten yang belum pindah ke dashboard
    ├── experience.ts           # Pengalaman kerja
    ├── skills.ts               # Skill per kategori
    └── education.ts            # Pendidikan dan prestasi
drizzle/                        # File migration SQL
scripts/seed.ts                 # Data profil dan proyek awal
```

## Mengubah Konten

- **Proyek:** kelola dari dashboard di `/admin/projects`. Perubahan langsung tampil di website tanpa deploy ulang. Hanya satu proyek yang bisa di-highlight. Saat proyek lain ditandai, highlight lama otomatis dilepas.
- **Profil:** kelola dari dashboard di `/admin/profile`: nama, role, intro, about, foto, sosial media, quote, dan CV. Teks about bisa diberi **tebal** dengan `**dua bintang**`.
- **Foto:** upload dari dashboard, atau simpan di `public/images/` lalu isi path-nya, misalnya `/images/me/hero.jpg`. Selama belum diisi, tampil kotak "Add photo". Foto pendidikan masih diisi di `education.ts` (`photos`).
- **Pengalaman, skill, pendidikan:** masih diubah lewat file di `src/data/`. Akan dipindah ke dashboard di tahap berikutnya.
