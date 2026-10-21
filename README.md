# Ali Portfolio

Website portfolio pribadi yang dibangun dengan Next.js (App Router), TypeScript, dan Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Cache Components)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS 4
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
├── app/                    # Halaman (App Router)
│   ├── layout.tsx          # Layout utama: font, metadata, Navbar, Footer
│   ├── page.tsx            # Beranda: hero, proyek unggulan, kontak
│   ├── about/page.tsx      # Tentang, skill, pengalaman, pendidikan
│   ├── projects/
│   │   ├── page.tsx        # Daftar proyek dengan filter kategori
│   │   └── [slug]/page.tsx # Detail proyek
│   ├── not-found.tsx       # Halaman 404
│   ├── sitemap.ts          # /sitemap.xml
│   └── robots.ts           # /robots.txt
├── components/             # Komponen UI yang dipakai ulang
└── data/                   # Semua konten website
    ├── site.ts             # Nama, intro, email, sosial media
    ├── projects.ts         # Daftar proyek
    ├── experience.ts       # Pengalaman kerja
    ├── skills.ts           # Skill
    └── education.ts        # Pendidikan
```

## Mengubah Konten

Semua teks ada di `src/data/`, jadi tidak perlu menyentuh komponen untuk mengganti isi.

- **Profil dan kontak:** ubah `src/data/site.ts`, termasuk `url` sebelum deploy.
- **Menambah proyek:** tambahkan entri di `src/data/projects.ts`. Gambar disimpan di `public/images/projects/<slug>/`, lalu isi `thumbnail` dan `images` dengan path-nya, misalnya `/images/projects/<slug>/cover.png`. Proyek dengan `featured: true` tampil di beranda.
- **CV:** simpan di `public/docs/cv.pdf`, lalu isi `cvUrl: "/docs/cv.pdf"` di `site.ts`.
