# BIDORA Frontend

The frontend of **BIDORA**, a full-stack online auction marketplace built with **Next.js, React, TypeScript and Tailwind CSS**.

It provides the user-facing experience for discovering auctions, placing bids, managing listings and favourites, and following auction activity in real time.

## Live Demo

**Production:**  
https://bidora-ashen.vercel.app

> The backend is hosted on Render's free tier, so the first request after a period of inactivity may take a few seconds.

---

## Features

- Browse active auctions
- Search and filter auctions
- View detailed auction information
- Create new auctions
- Edit or delete eligible auctions
- Upload auction images
- Place bids
- View bid history
- Receive real-time bid updates
- Track highest-bidder / outbid state
- Add and remove favourites
- Manage user profile
- View My Auctions
- View My Bids
- View Favourites
- View Notifications
- Track unread notifications
- View auction winner and sale results
- Responsive interface
- Toast feedback and error handling

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Socket.IO Client
- Lucide React
- Sonner

---

## Project Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── auctions/
│   │   ├── login/
│   │   ├── register/
│   │   ├── sell/
│   │   ├── profile/
│   │   │   ├── auctions/
│   │   │   ├── bids/
│   │   │   ├── favourites/
│   │   │   └── notifications/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── components/
│       ├── auctions/
│       ├── auth/
│       ├── home/
│       ├── layout/
│       ├── profile/
│       ├── sell/
│       └── ui/
│
├── lib/
│   ├── api.ts
│   └── socket.ts
│
├── public/
├── next.config.ts
└── package.json
```

---

## Authentication

Authentication is handled by the BIDORA backend using **JWT tokens stored in HTTP-only cookies**.

Authenticated requests include credentials:

```ts
fetch(url, {
  credentials: "include",
});
```

In production, REST API requests are routed through the Next.js application rather than directly from the browser to the backend.

This allows the frontend to use same-origin `/api/*` requests while Next.js forwards them to the Express API.

```text
Browser
   │
   │ /api/*
   ▼
Next.js / Vercel
   │
   │ rewrite
   ▼
Express / Render
```

---

## API Communication

API URLs are centralized through `lib/api.ts`.

During local development, requests are sent directly to the local Express server:

```text
http://localhost:4000
```

In production, client-side requests use relative `/api/*` URLs and are forwarded to the backend through **Next.js rewrites**.

Server-side components that require direct backend access use a server-only backend URL.

This keeps environment-specific API configuration outside individual components.

---

## Real-Time Bidding

BIDORA uses **Socket.IO** for real-time auction updates.

Unlike REST API requests, the Socket.IO client maintains a direct connection with the Express backend.

```text
Browser ───── Socket.IO ─────► Express / Render
```

When a bid is successfully placed, the backend emits a `bid-placed` event.

The frontend listens for auction events and updates relevant UI state, including:

- current bid
- bid count
- highest-bidder state
- outbid state
- auction card information

This allows multiple users to follow bidding activity without manually refreshing the page.

---

## Notifications

Users receive notifications for important auction events such as:

- new bids on their auctions
- being outbid
- winning an auction
- successfully selling an auction

Unread notification counts are displayed in the profile navigation and account interface.

---

## Image Uploads

Auction images are uploaded directly from the browser to **Cloudinary**.

The frontend first requests signed upload parameters from the backend and then uploads the image to Cloudinary.

```text
Browser
   │
   │ request upload signature
   ▼
BIDORA Backend
   │
   │ signed parameters
   ▼
Browser
   │
   │ image upload
   ▼
Cloudinary
```

Cloudinary API secrets remain on the backend and are never exposed to the client.

Supported image formats include:

- JPG
- PNG
- WebP

Maximum image size:

- 5 MB

---

## Forms and Validation

Forms use:

- React Hook Form
- Zod
- `zodResolver`

Client-side validation provides immediate feedback before requests are sent to the backend.

The backend also performs its own validation and remains responsible for enforcing application rules.

---

## Environment Variables

### Local Development

The frontend defaults to the local backend:

```text
http://localhost:4000
```

### Production

The production deployment uses:

```env
BACKEND_URL=
NEXT_PUBLIC_SOCKET_URL=
```

`BACKEND_URL` is used for server-side communication with the Express API.

`NEXT_PUBLIC_SOCKET_URL` provides the backend address required by the browser for the Socket.IO connection.

---

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start the BIDORA backend

The backend should be available at:

```text
http://localhost:4000
```

### 3. Start the frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Production Deployment

The frontend is deployed on **Vercel**.

Production architecture:

```text
                    REST
Browser ─────► Next.js / Vercel ─────► Express / Render
   │
   │              Socket.IO
   └─────────────────────────────────► Express / Render
```

The backend communicates with a PostgreSQL database hosted on Neon, while auction images are stored in Cloudinary.

---

## Current Status

BIDORA currently includes the complete core auction workflow:

- authentication
- auction creation and management
- search and filtering
- favourites
- bidding
- bid history
- real-time updates
- profile management
- notifications
- auction completion
- Cloudinary image uploads
- production deployment

Future improvements may include automated testing, pagination, email notifications, payments, seller ratings and additional monitoring.