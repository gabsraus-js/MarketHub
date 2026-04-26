# MarketHub

**Discover, join, and manage your presence across online marketplaces — all in one place.**

Built with Next.js, Node.js, and Prisma. Clean UI, atomic component architecture, per-marketplace product pricing.

---

## Features

- **Marketplace browser** — search and filter hundreds of platforms by category
- **One-click join** — track which marketplaces you're a member of
- **Product manager** — register products with photos and descriptions
- **Smart pricing** — set a base price, then override per marketplace as needed
- **Profile** — see your joined marketplaces and membership stats at a glance

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Components | Atomic Design — atoms → molecules → organisms → templates |
| Backend | Node.js, Express, TypeScript |
| Database | Prisma ORM + SQLite |
| File uploads | Multer |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Clone and install

```bash
git clone https://github.com/your-username/marketplaces-gatherer.git
cd marketplaces-gatherer
npm install
```

### 2. Set up the backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Push schema and seed demo data
npm run db:push
npm run db:seed
```

### 3. Run both servers

From the root:

```bash
npm run dev
```

Or individually:

```bash
npm run dev:frontend   # → http://localhost:3000
npm run dev:backend    # → http://localhost:3001
```

---

## Project structure

```
marketplaces-gatherer/
├── frontend/
│   └── src/
│       ├── app/                  # Pages (Home, Marketplaces, Products, Profile)
│       ├── components/
│       │   ├── atoms/            # Button, Badge, Avatar, Input
│       │   ├── molecules/        # MarketplaceCard, ProductCard, SearchBar, StatCard
│       │   ├── organisms/        # Header, HeroSection, ProductForm, MarketplaceGrid
│       │   └── templates/        # DefaultLayout
│       ├── lib/                  # API client, mock data
│       └── types/                # Shared TypeScript interfaces
│
└── backend/
    ├── prisma/
    │   ├── schema.prisma         # User, Marketplace, Product, ProductImage, ...
    │   └── seed.ts               # 10 demo marketplaces + 1 user
    └── src/
        ├── controllers/
        ├── routes/
        └── lib/
```

---

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/marketplaces` | List all marketplaces (`?search=` `?category=`) |
| `POST` | `/api/marketplaces/:id/join` | Join a marketplace |
| `DELETE` | `/api/marketplaces/:id/leave` | Leave a marketplace |
| `GET` | `/api/users/:id` | Get user profile |
| `PATCH` | `/api/users/:id` | Update profile |
| `GET` | `/api/users/:id/marketplaces` | User's joined marketplaces |
| `GET` | `/api/products?userId=` | List user's products |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `POST` | `/api/upload` | Upload image (multipart, max 5 MB) |

---

## Environment variables

**`backend/.env`**

```env
DATABASE_URL="file:./dev.db"
PORT=3001
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## License

MIT
