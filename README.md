# Bidora

**Bidora** is a full-stack online auction marketplace where users can discover items, create auctions, manage their profile, save favourites and participate in bidding.

The project is being built as a production-style full-stack application with a separate frontend, backend API and PostgreSQL database.

## Project structure

```text
Bidora/
├── frontend/
├── backend/
└── README.md
```

## Current project status

The main frontend foundation is complete and backend integration has started.

The project now supports a real authentication flow with PostgreSQL persistence.

### Working end-to-end flows

- User registration
- Password hashing
- User login
- JWT creation
- httpOnly cookie authentication
- Protected authentication check
- User profile loading
- User profile updates
- Logout
- PostgreSQL persistence through Prisma

## Frontend

### Implemented

- Responsive homepage
- Auction browsing UI
- Auction details pages
- Sell Auction UI
- Form validation
- Login and registration
- Authentication-aware UI
- Editable profile
- Favourites UI
- My Bids UI
- My Auctions UI
- Responsive desktop and mobile layouts

### Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS v4
- React Hook Form
- Zod
- shadcn/ui
- Lucide React

## Backend

### Implemented

- Express REST API
- PostgreSQL database
- Prisma ORM
- Zod backend validation
- Auction endpoints
- User model
- Registration endpoint
- Login endpoint
- bcrypt password hashing
- JWT authentication
- httpOnly cookies
- Authentication middleware
- Protected user endpoint
- Profile update endpoint
- Logout endpoint
- Organized backend architecture with routes, controllers, middleware and schemas

### Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma 7
- Zod
- bcrypt
- JWT
- cookie-parser
- cors

## Architecture

```text
Next.js Frontend
       ↓
HTTP / REST API
       ↓
Express Backend
       ↓
Authentication / Business Logic
       ↓
Prisma
       ↓
PostgreSQL
```

## Authentication

Bidora currently uses:

```text
JWT
+
httpOnly cookies
```

The backend verifies the JWT through authentication middleware before allowing access to protected routes.

## Current API

```http
GET   /api/health

GET   /api/auctions
GET   /api/auctions/:id
POST  /api/auctions

POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me
POST  /api/auth/logout

PATCH /api/users/me
```

## Current development focus

The current focus is moving from UI/demo data to fully persistent marketplace functionality.

## Next major milestones

- Finalize navbar/account navigation
- Connect auction frontend pages to PostgreSQL-backed API data
- Connect Sell Auction to the authenticated user
- Add User–Auction relationships
- Add favourites
- Add bid model and bid history
- Add authorization for auction ownership
- Add real-time bidding
- Add real image uploads
- Add notifications
- Add auction winner logic
- Add payments
- Add protected frontend routes
- Deploy frontend, backend and PostgreSQL/cloud infrastructure

## Planned infrastructure

Future deployment may include:

- Docker
- Ubuntu / Linux
- Nginx
- Cloudflare
- Managed PostgreSQL
- GitHub Actions CI/CD

## Goal

The goal of Bidora is to evolve into a complete full-stack auction platform with secure authentication, persistent marketplace data, user account management and real-time bidding.
