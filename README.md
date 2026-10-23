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
- **Dashboard** di `/admin` untuk mengelola semua konten (profil, proyek, pengalaman kerja, skill, pendidikan, dan prestasi) tanpa mengubah kode
- **Liquid glass dengan WebGL**: latar dan permukaan kaca digambar di satu canvas WebGL, dengan refraksi di tepi kaca. Shader-nya diadaptasi dari [liquid-glass-js](https://github.com/dashersw/liquid-glass-js) (MIT). Tanpa WebGL, atau saat pengguna memilih "kurangi transparansi", otomatis kembali ke kaca CSS.

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
pnpm db:seed                 # isi konten dari CV ke tabel yang masih kosong (aman dijalankan ulang)
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
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob untuk upload gambar dan CV. Saat development tanpa token, file disimpan ke `public/uploads/` (diabaikan git). Di production, token ini wajib untuk upload. Gambar juga selalu bisa diisi dengan path atau URL. |

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
5. Setelah deploy pertama, isi konten sekali dengan menjalankan `DATABASE_URL="<url production>" pnpm db:seed` dari komputer. Profil, proyek, pengalaman, skill, dan pendidikan dari CV langsung terisi. Foto dan file CV tidak ikut, jadi upload dari dashboard production.

### Keamanan

Yang sudah ditangani di kode:

- **HTTPS:** Vercel memasang sertifikat SSL otomatis, untuk domain `.vercel.app` maupun domain sendiri, dan mengalihkan HTTP ke HTTPS. Header `Strict-Transport-Security` membuat browser selalu memakai HTTPS selama dua tahun.
- **Header keamanan** di `next.config.ts`: Content Security Policy (hanya memuat dari situs ini, Vercel Blob, dan avatar GitHub), larangan menampilkan situs di dalam iframe, `nosniff`, `Referrer-Policy`, dan `Permissions-Policy`. Header `X-Powered-By` dimatikan.
- **Dashboard:** setiap halaman, Server Action, dan API upload mengecek login dan daftar `ADMIN_EMAILS`. Cookie sesi otomatis `Secure` dan `HttpOnly` di production.
- **Input:** semua form divalidasi di server. Link hanya boleh `http`/`https` dan foto hanya boleh path `/...` atau link `https://`, jadi link `javascript:` ditolak. Upload dibatasi gambar dan PDF, maksimal 10 MB, tanpa SVG.

Yang perlu diatur sendiri saat deploy:

1. `BETTER_AUTH_SECRET` di production harus baru dan acak (`openssl rand -base64 32`), jangan memakai secret lokal.
2. `BETTER_AUTH_URL` berisi domain production dengan `https://`, dan OAuth App GitHub production memakai callback ke domain itu.
3. `ADMIN_EMAILS` hanya berisi email kamu sendiri.
4. `DATABASE_URL` dari Neon harus memakai `sslmode=require` (sudah ada di connection string bawaan Neon).
5. Jangan pernah commit `.env.local`. File itu sudah ada di `.gitignore`.

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
│   │       ├── projects/       # Daftar, tambah, edit proyek + Server Actions
│   │       ├── experience/     # Daftar, tambah, edit pengalaman + Server Actions
│   │       ├── skills/         # Kategori skill, urutan, editor chip + Server Actions
│   │       └── education/      # Pendidikan dan prestasi + Server Actions
│   ├── api/
│   │   ├── auth/[...all]/      # Endpoint Better Auth
│   │   └── admin/upload/       # Token upload Vercel Blob
│   ├── not-found.tsx           # Halaman 404
│   ├── sitemap.ts              # /sitemap.xml
│   └── robots.ts               # /robots.txt
├── components/                 # Komponen yang dipakai di banyak halaman
│   ├── glass/                  # Liquid glass WebGL: shader, renderer, GlassStage
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
│   ├── project-categories.ts   # Daftar kategori proyek
│   ├── experience.ts           # Jenis pekerjaan
│   ├── skill-icons.ts          # Ikon yang bisa dipilih untuk kategori skill
│   ├── education.ts            # Jenis prestasi dan format tahun
│   ├── dates.ts                # Format bulan ("Jan 2025") untuk semua halaman
│   └── validation.ts           # Validasi link dan path foto yang aman
drizzle/                        # File migration SQL
scripts/seed.ts                 # Konten dari CV untuk database kosong
```

## Mengubah Konten

- **Proyek:** kelola dari dashboard di `/admin/projects`. Perubahan langsung tampil di website tanpa deploy ulang. Hanya satu proyek yang bisa di-highlight. Saat proyek lain ditandai, highlight lama otomatis dilepas.
- **Profil:** kelola dari dashboard di `/admin/profile`: nama, role, intro, about, foto, sosial media, quote, dan CV. Teks about bisa diberi **tebal** dengan `**dua bintang**`.
- **Foto:** upload dari dashboard, atau simpan di `public/images/` lalu isi path-nya, misalnya `/images/me/hero.jpg`. Selama belum diisi, tampil kotak "Add photo".
- **Pengalaman kerja:** kelola dari dashboard di `/admin/experience`. Urutannya otomatis: posisi yang masih berjalan ("Present") di atas, lalu berdasarkan bulan mulai. Selama belum ada data, section Professional Experience di halaman About disembunyikan.
- **Skill:** kelola dari dashboard di `/admin/skills`. Setiap kategori punya ikon, daftar teknologi, dan daftar tools. Beri bintang pada teknologi yang paling dikuasai supaya tampil menonjol. Urutan kategori di halaman About diatur dengan tombol panah.
- **Pendidikan dan prestasi:** kelola dari dashboard di `/admin/education`. Bisa lebih dari satu sekolah, masing-masing dengan deskripsi, badge (misalnya IPK), dan sampai tiga foto. Prestasi otomatis diurutkan dari yang terbaru dan dikelompokkan per tahun.
