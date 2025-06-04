# Backend TechSentinel

**TechSentinel** adalah platform yang menyediakan informasi, ulasan, dan perbandingan teknologi terkini seperti handphone, laptop, dan tablet.

## Fitur

- Registrasi & login user
- Manajemen user (admin & user)
- CRUD kategori teknologi
- CRUD data teknologi
- CRUD artikel teknologi
- CRUD spesifikasi teknologi
- CRUD review teknologi
- Favorit teknologi
- Perbandingan teknologi
- Upload gambar ke Cloudinary

## Struktur Folder

- `controllers/` — Logika untuk setiap endpoint (user, artikel, teknologi, dsb)
- `routes/` — Routing endpoint API
- `middleware/` — Middleware (autentikasi, validasi, upload gambar)
- `prisma/` — Skema database dan migrasi
- `utils/` — Fungsi utilitas (upload ke cloudinary, dsb)
- `index.js` — Entry point aplikasi

## Tech Stack

- **Server:** Node.js, Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Cloud Storage:** Cloudinary (untuk upload gambar)
- **Validasi:** Joi

## API Endpoint Utama

- `/auth/register` — Registrasi user baru
- `/auth/login` — Login user
- `/user/profile` — Lihat & update profil user
- `/users` — List semua user (admin)
- `/categories` — List kategori teknologi
- `/technologies` — List teknologi
- `/articles` — List artikel
- `/specs` — List spesifikasi
- `/reviews` — List review
- `/favorites` — List favorit user
- `/comparison` — Bandingkan dua teknologi