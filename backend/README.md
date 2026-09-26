# BIDORA Backend

The backend of **BIDORA**, a full-stack online auction marketplace.

It is built with **Node.js, Express, TypeScript, Prisma and PostgreSQL** and provides the REST API, authentication, bidding logic, real-time events, notifications, auction completion processing and Cloudinary upload authorization used by the BIDORA frontend.

## Production API

**Backend:**  
https://bidora-api.onrender.com

The production API is hosted on **Render** and uses a PostgreSQL database hosted on **Neon**.

> The backend is currently hosted on Render's free tier, so the first request after a period of inactivity may require a short warm-up period.

---

## Features

- User registration and login
- JWT authentication
- HTTP-only cookie sessions
- Profile management
- Auction CRUD
- Seller ownership validation
- Bid placement
- Transactional and concurrency-safe bidding
- Bid history
- User bidding history
- Favourites
- Real-time bidding
- Notifications
- Auction winner detection
- Seller completion notifications
- Notification deduplication
- Cloudinary signed uploads
- PostgreSQL persistence
- Prisma ORM
- Input validation with Zod

---

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Socket.IO
- JSON Web Tokens
- bcrypt
- Zod
- cookie-parser
- CORS
- Cloudinary

### Infrastructure

- **Render** — API and Socket.IO server
- **Neon** — managed PostgreSQL database
- **Cloudinary** — auction image storage
- **Vercel** — frontend deployment

---

## Architecture

```text
                         ┌──────────────────┐
                         │     Browser      │
                         └────────┬─────────┘
                                  │
                             REST requests
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Next.js / Vercel │
                         │   API rewrite    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Express / Render │
                         │                  │
                         │ Authentication   │
                         │ Auctions         │
                         │ Bids             │
                         │ Favourites       │
                         │ Notifications    │
                         │ Upload signing   │
                         └────────┬─────────┘
                                  │
                                Prisma
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Neon PostgreSQL  │
                         └──────────────────┘


Browser ───────── Socket.IO ────────► Express / Render

Browser ───── Signed image upload ──► Cloudinary
```

Express and Socket.IO share the same HTTP server.

---

## API

### Local Base URL

```text
http://localhost:4000
```

### Production Base URL

```text
https://bidora-api.onrender.com
```

---

## Main API Routes

### Health

```http
GET /api/health
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Users

```http
PATCH /api/users/me
```

### Auctions

```http
GET    /api/auctions
GET    /api/auctions/mine
GET    /api/auctions/:id
POST   /api/auctions
PATCH  /api/auctions/:id
DELETE /api/auctions/:id
```

### Bids

```http
POST /api/bids/auctions/:id
GET  /api/bids/mine
GET  /api/bids/auctions/:id
```

### Favourites

```http
GET    /api/favourites
POST   /api/favourites/:auctionId
DELETE /api/favourites/:auctionId
```

### Notifications

```http
GET   /api/notifications
GET   /api/notifications/unread-count
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

### Uploads

```http
POST /api/uploads/signature
```

---

## Authentication

BIDORA uses **JWT-based authentication**.

After a successful login, the backend creates a signed JWT containing the user's identity and stores it in an **HTTP-only cookie**.

Protected routes use authentication middleware to validate the token before controller execution.

### Cookie Configuration

Cookie behaviour changes depending on the environment.

During local development, cookies can be used over HTTP.

In production, authentication cookies use secure settings appropriate for HTTPS deployment.

The JWT is not exposed directly to client-side JavaScript.

---

## CORS

The backend accepts requests from the configured BIDORA frontend origin and enables credential support.

The production frontend and backend are deployed separately:

```text
Frontend → Vercel
Backend  → Render
```

REST requests from the production frontend are proxied through Next.js, while Socket.IO communicates directly with the Render backend.

Socket.IO therefore has its own CORS configuration using the allowed frontend origin.

---

## Auction Rules

BIDORA enforces auction rules on the backend rather than relying only on frontend validation.

A seller can edit or delete an auction only when:

- the auction has not ended
- no bids have been placed

Additional rules include:

- sellers cannot bid on their own auctions
- expired auctions cannot receive new bids
- invalid bid amounts are rejected
- ended auctions are excluded from the public active-auction listing

Backend validation ensures these rules cannot be bypassed by directly calling the API.

---

## Bidding System

Bidding is one of the main pieces of business logic in BIDORA.

A bid must:

- target an existing auction
- target an active auction
- be placed by an authenticated user
- not be placed by the auction seller
- exceed the current bid

### Transactional Bid Placement

Bid placement uses **Prisma transactions** because several related operations need to remain consistent.

Conceptually:

```text
New bid request
      │
      ▼
Validate auction
      │
      ▼
Validate bidder
      │
      ▼
Validate bid amount
      │
      ▼
Conditional auction update
      │
      ▼
Create bid record
      │
      ▼
Create notifications
      │
      ▼
Commit transaction
```

If the operation cannot be completed safely, the transaction does not leave the auction in a partially updated state.

### Concurrency Safety

Two users may attempt to bid on the same auction at nearly the same time.

A simple:

```text
READ current price
        ↓
WRITE new price
```

approach could allow competing requests to work with stale auction state.

BIDORA uses a conditional auction update as part of the bidding transaction so that a bid cannot incorrectly overwrite a newer valid bid.

Only successful bids are persisted in bid history.

---

## Real-Time Events

Socket.IO runs on the same HTTP server as Express.

```text
Express ─┐
         ├── HTTP Server
Socket.IO┘
```

Clients can join auction-specific rooms.

When a bid is successfully processed, the backend emits real-time auction information so connected clients can update without refreshing the page.

```text
User A places bid
       │
       ▼
Express API
       │
       ├── update database
       │
       └── emit Socket.IO event
                    │
           ┌────────┴────────┐
           ▼                 ▼
        User A             User B
```

The frontend can then update values such as the current bid and bid count immediately.

---

## Notifications

BIDORA creates notifications for important auction events.

Current notification types include:

```text
NEW_BID
OUTBID
WON
AUCTION_SOLD
```

Examples:

- a seller is informed when bidding activity occurs on their auction
- a bidder can be informed when they are outbid
- the highest bidder is informed when they win
- the seller is informed when their auction is successfully sold

### Notification Deduplication

Auction-completion notifications use a unique `dedupeKey`.

This prevents the periodic auction checker from creating the same winner or seller notification multiple times if an ended auction is processed more than once.

---

## Auction Completion Processing

The backend periodically checks for auctions whose end time has passed.

For an ended auction, the service determines the result and creates the appropriate notifications.

```text
Auction reaches endsAt
        │
        ▼
Periodic backend check
        │
        ▼
Find highest bid
        │
        ├── No bids → auction ends
        │
        └── Winner exists
                │
                ├── WON → bidder
                │
                └── AUCTION_SOLD → seller
```

The current implementation runs this process from the backend server at regular intervals.

A dedicated background worker or scheduled job would be a possible future improvement for a larger production system.

---

## Cloudinary Uploads

Auction images are stored in **Cloudinary**.

The backend generates signed upload parameters for the frontend.

```text
Frontend
   │
   │ request signature
   ▼
BIDORA Backend
   │
   │ signed parameters
   ▼
Frontend
   │
   │ upload image
   ▼
Cloudinary
```

The `CLOUDINARY_API_SECRET` remains on the backend and is never exposed to the browser.

---

## Database

BIDORA uses **PostgreSQL** with **Prisma ORM**.

The production database is hosted on Neon.

Main Prisma models include:

- `User`
- `Auction`
- `Bid`
- `Favourite`
- `Notification`

Prisma migrations are used to track database schema changes.

---

## Environment Variables

Create a `.env` file inside the backend directory:

```env
DATABASE_URL=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=http://localhost:3000
```

For production, `FRONTEND_URL` should contain the canonical deployed frontend origin.

Never commit real credentials, JWT secrets, database URLs or Cloudinary secrets to source control.

---

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Apply database migrations

For local development:

```bash
npx prisma migrate dev
```

For an existing or production database:

```bash
npx prisma migrate deploy
```

### 4. Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:4000
```

---

## Demo Data

The backend includes scripts for populating the database with demo data.

### Seed Demo Auctions

```bash
npm run seed:auctions
```

This creates demo auctions using the configured demo data without requiring auctions to be created manually through the UI.

### Seed Demo Activity

```bash
npm run seed:activity
```

This can be used to populate additional demo auction activity for development and portfolio demonstrations.

> Seed scripts modify the database configured by `DATABASE_URL`. Check the active database connection before running them.

---

## Prisma Studio

To inspect and manage development database records:

```bash
npx prisma studio
```

---

## Production Deployment

The backend is deployed independently from the frontend.

```text
Frontend
Vercel
   │
   ▼
Backend
Render
   │
   ▼
Database
Neon PostgreSQL
```

Render provides the Express REST API and Socket.IO server, while Neon provides persistent PostgreSQL storage.

Cloudinary is used separately for auction image storage.

---

## Key Engineering Decisions

- JWT authentication with HTTP-only cookies
- Backend authorization and ownership validation
- Prisma transactions for bid consistency
- Conditional updates for concurrent bidding
- Socket.IO rooms for real-time auction activity
- Notification deduplication for auction completion
- Signed Cloudinary uploads
- Environment-specific CORS configuration
- Prisma migrations for database schema management
- Separate frontend, backend and database deployments

---

## Future Improvements

Potential backend improvements include:

- dedicated background worker for auction completion
- automated unit and integration tests
- API rate limiting
- structured application logging
- centralized error handling
- email notifications
- payment processing
- pagination
- Cloudinary asset cleanup when auctions are deleted
- additional monitoring and observability