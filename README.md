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

## Tech Stack

- **Framework:** Next.js 16 (App Router, Cache Components)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animasi:** Motion (`motion/react`)
- **Ikon:** Font Awesome
- **Font:** Poppins dan Jost (via `next/font`)
- **Package manager:** pnpm

## Menjalankan Project

Prasyarat: Node.js 20+ dan pnpm (`corepack enable pnpm`).

```bash
pnpm install
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

Perintah lain:

```bash
pnpm lint    # cek kode dengan ESLint
pnpm build   # build production
pnpm start   # jalankan hasil build
```

## Struktur Project

```
src/
├── app/
│   ├── layout.tsx              # Layout utama: font, metadata, Navbar
│   ├── page.tsx                # Beranda (fullpage scroll)
│   ├── about/
│   │   ├── page.tsx            # Halaman About
│   │   └── _components/        # Who Am I, Skills, Experience, Education, Quote
│   ├── projects/
│   │   ├── page.tsx            # Highlight + daftar proyek
│   │   ├── [slug]/page.tsx     # Detail proyek
│   │   ├── archive/page.tsx    # Tabel semua proyek
│   │   └── _components/        # Grid proyek dengan filter, tombol scroll
│   ├── not-found.tsx           # Halaman 404
│   ├── sitemap.ts              # /sitemap.xml
│   └── robots.ts               # /robots.txt
├── components/                 # Komponen yang dipakai di banyak halaman
│   ├── fullpage.tsx            # Fullpage scroll + sidebar
│   ├── reveal.tsx              # Animasi muncul saat di-scroll
│   ├── navbar.tsx              # Navbar + menu animasi
│   └── ...
└── data/                       # Semua konten website
    ├── site.ts                 # Nama, intro, email, foto, sosial media, quote
    ├── projects.ts             # Daftar proyek
    ├── experience.ts           # Pengalaman kerja
    ├── skills.ts               # Skill per kategori
    └── education.ts            # Pendidikan dan prestasi
```

## Mengubah Konten

Semua teks dan foto diatur dari `src/data/`, jadi tidak perlu menyentuh komponen untuk mengganti isi.

- **Profil dan kontak:** ubah `src/data/site.ts`, termasuk `url` sebelum deploy. Teks di `about` bisa diberi **tebal** dengan `**dua bintang**`.
- **Foto:** simpan di `public/images/`, lalu isi path-nya di `site.ts` (`photos`) dan `education.ts` (`photos`), misalnya `"/images/me/hero.jpg"`. Selama belum diisi, tampil kotak "Add photo".
- **Menambah proyek:** tambahkan entri di `src/data/projects.ts`. Screenshot disimpan di `public/images/projects/<slug>/`, lalu isi `thumbnail` dan `images`. Satu proyek dengan `highlight: true` tampil di bagian Highlight.
- **CV:** simpan di `public/docs/cv.pdf`, lalu isi `cvUrl: "/docs/cv.pdf"` di `site.ts`. Tombol "Download CV" akan muncul di beranda.
