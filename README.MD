# Room Booking API

Room booking system - REST API backend dengan Express, TypeScript dan Prisma

## Prerequisites

Pastikan sistem Anda sudah terinstall:
- Node.js >= 20.18.0
- npm >= 10.8.0
- MySQL Database

## Setup Backend

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/room-booking-api.git
cd room-booking-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Buat file `.env` di root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/room_booking"

# JWT
ACCESS_TOKEN_SECRET="room-booking-access"
JWT_REFRESH_SECRET="room-booking-refresh"
JWT_EXPIRES_IN='7d'

# Server
NODE_ENV="development"
PORT=4000

# CORS
CORS_ORIGIN="http://localhost:3001"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 5. Development

```bash
# Start development server
npm run dev

# Server akan berjalan di http://localhost:3000
```

### 6. Production Build

```bash
# Build project
npm run build

# Start production server
npm start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server dengan hot reload |
| `npm run build` | Build project untuk production |
| `npm start` | Start production server |
| `npm run db:migrate` | Run database migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes ke database |
| `npm run db:seed` | Seed database dengan data awal |
| `npm run db:studio` | Buka Prisma Studio |
| `npm run db:reset` | Reset database |
| `npm run db:deploy` | Deploy migrations ke production |
| `npm run lint` | Check linting errors |
| `npm run lint:fix` | Fix linting errors |
| `npm run format` | Format code dengan Prettier |

## Database Commands

```bash
# Lihat database dengan Prisma Studio
npm run db:studio

# Reset database (hapus semua data)
npm run db:reset

# Push schema tanpa migration
npm run db:push
```

## Tech Stack

- **Runtime**: Node.js 20.18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Security**: Helmet + CORS
- **Logging**: Morgan
- **Development**: Nodemon + ts-node

## Project Structure

```
src/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # utility functions
└── server.ts        # Main server file

prisma/
├── migrations/      # Database migrations
├── schema.prisma    # Database schema
└── seed.ts          # Database seeder
```
