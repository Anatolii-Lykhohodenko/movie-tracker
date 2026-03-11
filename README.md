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
cp .env.example .env  # fill in your variables
npm install
npx prisma migrate dev
npm run dev

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev

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