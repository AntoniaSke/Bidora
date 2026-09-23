# Bidora Backend

The Bidora backend is a REST API and real-time event server built with Node.js, Express, TypeScript, Prisma and PostgreSQL.

It provides authentication, auction management, bidding, favourites, notifications, Cloudinary upload signatures and Socket.io events.

## Features

- User registration and login
- JWT authentication
- HTTP-only cookie sessions
- Profile management
- Auction CRUD
- Seller ownership validation
- Bid placement
- Concurrency-safe bidding
- Bid history
- User bid history
- Favourites
- Notifications
- Auction winner detection
- Auction sold notifications
- Real-time bidding with Socket.io
- Cloudinary signed uploads
- PostgreSQL persistence
- Prisma ORM

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Socket.io
- JWT
- bcrypt
- Zod
- cookie-parser
- CORS
- Cloudinary

## API Base URL

```text
http://localhost:4000
```

## Main API Routes

### Health
`GET /api/health`

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Users
- `PATCH /api/users/me`

### Auctions
- `GET /api/auctions`
- `GET /api/auctions/mine`
- `GET /api/auctions/:id`
- `POST /api/auctions`
- `PATCH /api/auctions/:id`
- `DELETE /api/auctions/:id`

### Bids
- `POST /api/bids/auctions/:id`
- `GET /api/bids/mine`
- `GET /api/bids/auctions/:id`

### Favourites
- `GET /api/favourites`
- `POST /api/favourites/:auctionId`
- `DELETE /api/favourites/:auctionId`

### Notifications
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

### Uploads
- `POST /api/uploads/signature`

## Authentication

Users are authenticated using JWT tokens stored in HTTP-only cookies.

Protected routes use authentication middleware before controller execution.

## Auction Rules

A seller can edit or delete an auction only if:

- the auction has not ended
- no bids have been placed

Sellers cannot bid on their own auctions.

Ended auctions are excluded from the public active auction listing.

## Bidding

Bid placement uses Prisma transactions.

A bid must:

- belong to an active auction
- be higher than the current bid
- not be placed by the auction seller

The auction update is performed conditionally so that concurrent bids cannot overwrite each other incorrectly.

Only successful bids are stored in bid history.

## Real-Time Events

Socket.io runs on the same HTTP server as Express.

When a successful bid is placed, the backend emits `bid-placed`.

The frontend uses this event to update auction data without refreshing.

## Notifications

Notifications are created for:
- `NEW_BID`
- `OUTBID`
- `WON`
- `AUCTION_SOLD`

Auction-ending notifications use a unique `dedupeKey` to prevent duplicates.

## Auction Ending Processing

A backend process periodically checks ended auctions, finds the highest bid, determines the winner, and creates winner and seller notifications.

## Cloudinary

The backend generates signed Cloudinary upload parameters. The Cloudinary API secret is never exposed to the frontend.

## Database

Main Prisma models:
- User
- Auction
- Bid
- Favourite
- Notification

## Environment Variables

```env
DATABASE_URL=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never commit real secrets to source control.

## Running the Backend

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

## Seed Demo Auctions

```bash
npm run seed:auctions
```

This creates demo auctions using a dedicated demo seller without removing normal users' auctions.

## Prisma Studio

```bash
npx prisma studio
```
