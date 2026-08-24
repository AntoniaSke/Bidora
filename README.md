# Bidora

**Bidora** is a full-stack online auction marketplace where users can discover items, create auctions, save favourites and compete through live bidding.

The project is being developed as a modern full-stack web application with a separate frontend, backend API and PostgreSQL database.

## Project Structure

```text
Bidora/
├── frontend/
└── backend/
```

## Frontend

The frontend provides the user-facing marketplace experience.

### Current Features

- Responsive marketplace homepage
- Auction browsing and filtering
- Auction details pages
- Sell Auction form
- Form validation
- Login and registration pages
- Editable user profile
- Favourites
- My Bids
- My Auctions
- Responsive navigation
- Mobile-first UI

### Frontend Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS v4
- React Hook Form
- Zod
- shadcn/ui
- Lucide React

## Backend

The backend provides the API and application logic.

### Current Work

- Express API server
- Auction endpoints
- Zod request validation
- PostgreSQL database
- Prisma ORM
- Auction database model
- Prisma migrations
- Prisma Studio

### Backend Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma 7
- Zod

## Architecture

```text
Frontend
   ↓
HTTP / REST API
   ↓
Express Backend
   ↓
Prisma
   ↓
PostgreSQL
```

## Current Development Status

The main frontend foundation has been completed.

Backend development has started, including the Express server, auction routes, validation and initial PostgreSQL/Prisma setup.

The next major milestone is replacing demo frontend data and temporary backend data with persistent database-driven functionality.

## Planned Features

- User registration and authentication
- Secure password handling
- User profiles
- Create and manage auctions
- Persistent favourites
- Bid history
- Seller auction management
- Real-time bidding
- Real auction countdowns
- Image uploads
- Notifications
- Winner selection
- Payments
- Protected API routes
- Production deployment

## Planned Infrastructure

Future deployment may include:

- Docker
- Linux / Ubuntu
- Nginx
- Cloudflare
- PostgreSQL
- CI/CD with GitHub Actions

## Goal

The goal of Bidora is to evolve from a frontend marketplace prototype into a production-style full-stack auction platform with real authentication, persistent data and real-time bidding.
