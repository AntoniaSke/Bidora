# Bidora

Bidora is a full-stack online auction marketplace where users can create auctions, place bids, track bidding activity in real time and receive notifications about important auction events.

The project was built as a full-stack portfolio application with a focus on modern web development, real-time interactions and backend data consistency.

## Overview

Bidora allows users to:

- create an account
- browse active auctions
- search and filter auctions
- create auctions
- upload auction images
- edit or delete eligible auctions
- place bids
- view bid history
- save favourites
- track auctions they participated in
- receive real-time bidding updates
- receive auction notifications
- view winner and sold-auction results

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Socket.io Client
- Sonner
- Lucide React

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Socket.io
- JWT
- bcrypt
- Zod
- Cloudinary

## Architecture

```text
Browser
   │
   │ REST API
   ▼
Next.js Frontend
   │
   │ HTTP + Socket.io
   ▼
Express Backend
   │
   ├── Authentication
   ├── Auctions
   ├── Bids
   ├── Favourites
   ├── Notifications
   └── Upload signatures
   │
   ▼
PostgreSQL
```

Auction images are stored in Cloudinary.

## Main Features

### Authentication
JWT-based authentication using HTTP-only cookies.

### Auction Marketplace
Browse, search and filter active auctions.

### Auction Management
Authenticated users can create auctions. Sellers can edit or delete auctions only before the first bid and before the auction ends.

### Bidding
Bidora prevents self-bidding, invalid bids and bidding on expired auctions. Bid placement uses transactions and conditional updates to protect against race conditions.

### Real-Time Bidding
Socket.io updates current bid, bid count, highest/outbid state and auction cards without refresh.

### Bid History
Each auction provides a bid history showing previous bids and users.

### Favourites
Users can save and remove favourite auctions.

### Notifications
Users receive notifications for new bids, being outbid, winning an auction and successful sales.

### Auction Completion
A backend checker determines winners and creates `WON` and `AUCTION_SOLD` notifications.

### Image Uploads
Auction images are uploaded to Cloudinary using signed upload requests.

## Repository Structure

```text
Bidora/
├── frontend/
│   ├── src/
│   ├── public/
│   └── README.md
│
├── backend/
│   ├── src/
│   ├── prisma/
│   └── README.md
│
└── README.md
```

## Getting Started

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

Backend: `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## Environment Variables

```env
DATABASE_URL=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Do not commit real credentials.

## Demo Data

```bash
cd backend
npm run seed:auctions
```

## Key Engineering Decisions

- HTTP-only cookie authentication
- Prisma transactions for bid consistency
- Concurrency-safe conditional bid updates
- Shared Socket.io connection on the frontend
- Notification deduplication for auction completion events

## Future Improvements

- payments
- dedicated worker for auction-closing jobs
- email notifications
- user ratings
- seller profiles
- pagination
- Cloudinary asset cleanup when auctions are removed
- automated tests
- production deployment

## Author

Built as a full-stack web development portfolio project.
