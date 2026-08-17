# Portfolio v2

Aplikasi web portfolio personal interaktif berbasis **Laravel 11** dan **React 18** (Vite), dilengkapi **Admin Panel CMS**, **Live Chat Publik**, dan integrasi **Google OAuth**.

---

## 🚀 Fitur Utama

- **Live Chat (Publik)**:
  - Diskusi pesan secara real-time yang tersimpan di database.
  - Login pengguna cepat menggunakan **Google OAuth / One-Tap Login** atau akun manual modal.
- **Project Showcase**:
  - Tampilan daftar karya/proyek interaktif dengan filter kategori.
  - Fitur drag/reorder urutan proyek.
- **Tech Stack Grid**:
  - Menampilkan daftar teknologi, bahasa pemrograman, dan tools yang dikuasai.
- **Direct Email / Message**:
  - Modal kontak langsung (*Let's Talk*) untuk mengirim email atau pesan ke admin.
- **Admin Panel CMS (Protected)**:
  - Dashboard pengelolaan konten (About, Projects, Tech Stack).
  - Manajemen reorder (urutan tampilan) proyek & tech-stack.
- **Authentication**:
  - Login Admin menggunakan **Laravel Sanctum**.

---

## 🛠️ Tech Stack

### Backend
- **Laravel 11**: Framework PHP modern
- **Laravel Sanctum**: Authentication token/session API
- **SQLite / MySQL**: Database utama

### Frontend
- **React 18** + **Vite**: Build tool super cepat & UI Library
- **Tailwind CSS**: Styling UI modern & responsif
- **Lucide React**: Asset ikon modern
- **Google Identity Services (GIS)**: Google OAuth Login Integration

---

## 📁 Struktur Proyek

```text
Portofolio v2/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── AboutController.php
│   │   ├── AuthController.php
│   │   ├── MessageController.php (Live Chat)
│   │   ├── ProjectController.php
│   │   └── TechStackController.php
│   └── Models/
│       ├── About.php
│       ├── Message.php
│       ├── Project.php
│       ├── TechStack.php
│       └── User.php
├── database/
│   ├── migrations/
│   └── seeders/
│       └── DatabaseSeeder.php
├── resources/
│   ├── js/
│   │   ├── api/          # Layer HTTP fetcher (getMessages, sendMessage, dll)
│   │   ├── components/   # UI Modal, Button, Navbar, Header, etc.
│   │   ├── pages/        # Halaman Home & Admin Panel
│   │   └── App.jsx
│   └── css/
├── routes/
│   ├── api.php           # RESTful API Endpoints
│   └── web.php
└── .env.example
```

---

## 🚀 Instalasi & Setup

### Prerequisites
- PHP 8.2+
- Node.js 18+ & NPM
- Composer

### Langkah-langkah Setup

1. **Clone & Masuk ke Folder Proyek**
   ```bash
   git clone <repo-url>
   cd "Portofolio v2"
   ```

2. **Install Depedensi (Backend & Frontend)**
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Environment (`.env`)**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Opsional: Tambahkan `VITE_GOOGLE_CLIENT_ID` di file `.env` jika ingin mengaktifkan prompt Google One-Tap Login.*

4. **Migrasi Database & Seeder Data Awal**
   ```bash
   php artisan migrate --seed
   ```

5. **Jalankan Development Server**
   Buka 2 terminal:
   ```bash
   # Terminal 1: Backend Laravel (http://localhost:8000)
   php artisan serve

   # Terminal 2: Frontend Vite (http://localhost:5173)
   npm run dev
   ```

6. **Build untuk Production**
   ```bash
   npm run build
   ```

---

## 📚 API Endpoints

### 🌐 Public Endpoints
- `POST /api/login` - Login Admin
- `GET /api/about` - Mendapatkan data About / Profil
- `GET /api/tech-stacks` - Mendapatkan daftar Tech Stack
- `GET /api/projects` - Mendapatkan daftar Proyek
- `GET /api/messages` - Mendapatkan pesan Live Chat (Database)
- `POST /api/messages` - Mengirim pesan ke Live Chat (Database)

### 🔒 Protected Endpoints (Memerlukan Admin Sanctum Auth)
- `GET /api/user` - Data profil admin yang sedang login
- `POST /api/logout` - Logout Admin
- `PUT /api/about` - Update data About
- `POST /api/tech-stacks` - Tambah Tech Stack
- `PUT /api/tech-stacks/{id}` - Update Tech Stack
- `DELETE /api/tech-stacks/{id}` - Hapus Tech Stack
- `POST /api/tech-stacks/reorder` - Urutkan ulang posisi Tech Stack
- `POST /api/projects` - Tambah Proyek baru
- `PUT /api/projects/{id}` - Update Proyek
- `DELETE /api/projects/{id}` - Hapus Proyek
- `POST /api/projects/reorder` - Urutkan ulang posisi Proyek

---
