# 🎬 MovieTracker

A full-stack movie tracking application inspired by Netflix.
Browse movies, manage your watchlist, write reviews and rate films.

🔗 **[Live Demo](https://movie-tracker-virid.vercel.app/)**

---

## ✨ Features

- 🔍 Browse & search movies with infinite scroll
- 🎛 Advanced filtering by genre, rating, year (TMDB Discover API)
- 🎬 Movie details with YouTube trailers
- ❤️ Watchlist & Favorites management
- ⭐ Ratings & reviews with sorting
- 👤 User profiles with avatar upload
- 🔐 JWT authentication (register/login)

## 🛠 Tech Stack

### Frontend
- React 18 + TypeScript
- TanStack Query (infinite scroll, caching)
- React Router v6
- Axios + interceptors
- Bulma CSS

### Backend
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT + bcrypt
- Zod validation
- Cloudinary (avatar storage)

## 📸 Screenshots

| Home | Home with Filters |
|------|------------------|
| ![Home](https://github.com/user-attachments/assets/5701000b-3163-4f82-a7ee-6194ac3d941b) | ![Filters](https://github.com/user-attachments/assets/0bd17dbd-0f0b-492f-a039-f0cc7a571b7d) |

| Watchlist | Profile |
|-----------|---------|
| ![Watchlist](https://github.com/user-attachments/assets/cfa210fb-7b18-4752-8959-dc9238e0e5a4) | ![Profile](https://github.com/user-attachments/assets/26e82934-5c92-4ce6-bfbb-dcc31c9f42b3) |

**Movie Detail**

![Movie Detail 1](https://github.com/user-attachments/assets/20da9349-62bc-4c04-890a-084b949cfc18)
![Movie Detail 2](https://github.com/user-attachments/assets/aef02a8a-48ca-4aab-b984-4f64fcacb8e2)
![Movie Detail 3](https://github.com/user-attachments/assets/50eb97da-1364-48d4-b32d-69f40d0a6dbe)


## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Installation
```bash
# Clone
git clone https://github.com/Anatolii-Lykhohodenko/movie-tracker

# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

## 📁 Project Structure
​```

Project
├── backend
|  ├── nodemon.json
|  ├── package-lock.json
|  ├── package.json
|  ├── prisma
|  |  ├── migrations
|  |  └── schema.prisma
|  ├── prisma.config.ts
|  ├── src
|  |  ├── cloudinary.ts
|  |  ├── controllers
|  |  ├── index.ts
|  |  ├── middleware
|  |  ├── prisma.ts
|  |  ├── routes
|  |  ├── schemas
|  |  ├── services
|  |  └── types
|  └── tsconfig.json
├── frontend
|  ├── eslint.config.js
|  ├── index.html
|  ├── package-lock.json
|  ├── package.json
|  ├── public
|  |  └── film-slate.svg
|  ├── src
|  |  ├── App.css
|  |  ├── App.tsx
|  |  ├── components
|  |  ├── contexts
|  |  ├── hooks
|  |  ├── index.css
|  |  ├── main.tsx
|  |  ├── pages
|  |  ├── Root.tsx
|  |  ├── services
|  |  ├── types
|  |  └── utils
|  ├── tsconfig.app.json
|  ├── tsconfig.json
|  ├── tsconfig.node.json
|  ├── vercel.json
|  └── vite.config.ts
├── package-lock.json
├── package.json
└── README.md

​```

## 🌍 Environment Variables

### Backend `.env`
​```
DATABASE_URL=
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=5000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
​```

### Frontend `.env`
​```

VITE_TMDB_API_KEY=
VITE_TMDB_BASE_URL=
VITE_TMDB_IMAGE_BASE_URL=
VITE_APP_BASE_URL=
​```

## 📄 License
MIT