# Bidora Backend

Backend API for **Bidora**, an online auction marketplace.

The backend is currently under development and is being built with Node.js, Express, TypeScript, PostgreSQL and Prisma.

## Implemented

- Node.js backend setup
- Express server
- TypeScript configuration
- Development server with `tsx`
- Health check endpoint
- Auction API routes
- GET all auctions
- GET auction by ID
- POST new auction
- Request body parsing with Express
- Backend validation with Zod
- HTTP status handling
- PostgreSQL local database setup
- Dedicated PostgreSQL user and database
- Prisma setup
- Initial Auction model
- Prisma migrations
- Prisma Studio
- Prisma PostgreSQL adapter configuration

## Technologies

- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL**
- **Prisma 7**
- **Zod**
- **tsx**

## Current API

```http
GET /api/health
GET /api/auctions
GET /api/auctions/:id
POST /api/auctions
```

## Database

The project currently contains an `Auction` model with fields for:

- title
- description
- category
- starting price
- current bid
- bid count
- image
- auction end date
- seller
- creation date

## Current Status

The PostgreSQL database and Prisma layer have been initialized.

The next step is to complete Prisma Client integration with Express and replace the temporary in-memory auction data with persistent PostgreSQL data.

## Next Steps

- Complete Prisma Client integration
- Store auctions in PostgreSQL
- Add User model
- Registration endpoint
- Login endpoint
- Password hashing
- Authentication
- Protected routes
- User profile API
- Favourites
- Bids
- User auctions
- Auction creation for authenticated sellers
- Error handling middleware
- Environment configuration
- Real-time bidding
