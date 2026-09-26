# BIDORA

**BIDORA** is a full-stack online auction marketplace where users can create auctions, place bids, follow bidding activity in real time, save favourites, and receive notifications about important auction events.

The project was built as a full-stack portfolio application with a focus on **real-time communication, secure authentication, transactional data consistency, and production deployment**.

## Live Demo

**Live Application:**  
https://bidora-ashen.vercel.app

> The backend is hosted on Render's free tier, so the API may require a short warm-up period after inactivity.

---

## Features

### Authentication

- User registration and login
- JWT-based authentication
- HTTP-only cookie storage
- Protected user functionality
- Persistent authentication across requests
- Secure production cookie configuration

### Auction Marketplace

Users can:

- browse active auctions
- search auctions
- filter by category, price, and status
- sort auction results
- view detailed auction information
- see current bid and bidding activity

### Auction Management

Authenticated users can create their own auctions with:

- title
- description
- category
- starting price
- expiration time
- auction image

Sellers can edit or delete eligible auctions before bidding activity begins.

### Bidding System

Users can place bids directly from an auction page.

The backend validates bidding rules including:

- bids must exceed the current price
- sellers cannot bid on their own auctions
- expired auctions cannot receive bids
- invalid bid amounts are rejected

Bid placement uses **database transactions and conditional updates** to help maintain consistency when multiple users attempt to bid concurrently.

### Real-Time Updates

BIDORA uses **Socket.IO** for real-time auction activity.

When a bid is placed, connected users can receive updated:

- current bid
- bid count
- highest-bidder state
- outbid state
- auction card information

without refreshing the page.

### Bid History

Each auction provides a bid history containing previous bid amounts and bidding activity.

Users can also view auctions they have participated in from their profile.

### Favourites

Authenticated users can:

- save auctions to favourites
- remove auctions from favourites
- view saved auctions from their profile

### Notifications

The notification system informs users about important auction events, including:

- new bidding activity
- being outbid
- winning an auction
- successfully selling an auction

### Auction Completion

The backend periodically checks for auctions that have ended.

When an auction finishes, BIDORA determines the winning bidder and generates the appropriate:

- `WON`
- `AUCTION_SOLD`

notifications.

Notification deduplication prevents completion events from being generated multiple times.

### Image Uploads

Auction images are stored in **Cloudinary**.

The backend generates signed upload parameters so Cloudinary credentials are never exposed directly to the browser.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Socket.IO Client
- Sonner
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO
- JSON Web Tokens
- bcrypt
- Zod
- Cloudinary

### Infrastructure

- **Vercel** — frontend hosting
- **Render** — backend API hosting
- **Neon** — managed PostgreSQL database
- **Cloudinary** — image storage and delivery

---

## Architecture

```text
                         ┌─────────────────────┐
                         │       Browser       │
                         └──────────┬──────────┘
                                    │
                             HTTPS / REST
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Next.js / Vercel  │
                         │                     │
                         │   /api/* rewrites   │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP
                                    ▼
                         ┌─────────────────────┐
                         │  Express / Render   │
                         │                     │
                         │  Authentication     │
                         │  Auctions           │
                         │  Bids               │
                         │  Favourites         │
                         │  Notifications      │
                         │  Upload signatures  │
                         └───────┬─────────────┘
                                 │
                                 │ Prisma
                                 ▼
                         ┌─────────────────────┐
                         │ Neon PostgreSQL     │
                         └─────────────────────┘


Browser ─────── Socket.IO ──────► Express / Render

Browser ───── Signed Upload ────► Cloudinary
```

### Production API Proxy

In production, REST requests are sent through the Next.js application:

```text
Browser
   │
   │ /api/*
   ▼
Vercel / Next.js
   │
   │ rewrite
   ▼
Render / Express
```

This keeps browser-facing REST requests on the frontend origin while the Next.js layer forwards them to the backend API.

Socket.IO maintains a direct connection between the browser and the Render backend for real-time communication.

---

## Repository Structure

```text
Bidora/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   ├── lib/
│   └── public/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── scripts/
│   └── prisma/
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- PostgreSQL

You will also need Cloudinary credentials for image uploads.

### 1. Clone the repository

```bash
git clone https://github.com/AntoniaSke/Bidora.git
cd Bidora
```

### 2. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The backend runs locally at:

```text
http://localhost:4000
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally at:

```text
http://localhost:3000
```

---

## Environment Variables

Create the required backend environment configuration:

```env
DATABASE_URL=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

For production, the frontend also uses:

```env
BACKEND_URL=
NEXT_PUBLIC_SOCKET_URL=
```

Do not commit real credentials or secrets to the repository.

---

## Demo Data

The project includes scripts for populating the database with demo content.

### Seed auctions

```bash
cd backend
npm run seed:auctions
```

### Seed demo activity

```bash
npm run seed:activity
```

---

## Key Engineering Decisions

### HTTP-only Cookie Authentication

JWTs are stored in HTTP-only cookies rather than browser-accessible storage, reducing direct exposure of authentication tokens to client-side JavaScript.

### Next.js API Proxy

Production REST requests are routed through Next.js rewrites before reaching the Express API. This provides a consistent browser-facing API origin while keeping the backend deployed independently.

### Transactional Bidding

Bid creation involves multiple related database operations. Prisma transactions are used so those operations succeed or fail as a single unit.

### Concurrency-Safe Bid Updates

Conditional database updates help prevent stale or competing bids from incorrectly overwriting newer auction state.

### Real-Time Communication

Socket.IO provides immediate bid updates without requiring users to manually refresh auction pages.

### Notification Deduplication

Auction-completion notifications use deduplication logic to prevent repeated winner or seller notifications when the completion checker processes the same auction more than once.

### Signed Cloudinary Uploads

Image upload signatures are generated by the backend so sensitive Cloudinary credentials remain server-side.

---

## Challenges & What I Learned

Building BIDORA involved more than implementing CRUD operations. Several features required handling real application concerns such as:

- maintaining consistent state during concurrent bids
- synchronizing real-time events with persisted database state
- designing authentication across separately deployed frontend and backend services
- handling cross-origin requests and cookies in production
- proxying REST requests through Next.js
- managing WebSocket connections separately from REST communication
- implementing signed third-party image uploads
- preventing duplicate auction-completion notifications

These challenges helped turn BIDORA from a basic auction interface into a complete full-stack application with real-time and production infrastructure concerns.

---

## Future Improvements

Possible future additions include:

- integrated payments
- dedicated background worker for auction-closing jobs
- email notifications
- user ratings and reviews
- public seller profiles
- pagination / infinite scrolling
- automatic Cloudinary asset cleanup
- automated unit and integration tests
- end-to-end testing
- improved monitoring and logging

---

## Author

**Antonia Skevaki**

BSc in Informatics & Telecommunications  
Full-Stack / Front-End Developer

BIDORA was designed and developed as a portfolio project demonstrating modern full-stack web development with **Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma, Socket.IO, and cloud deployment**.