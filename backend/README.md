# Bidora Backend

Backend API for **Bidora**, a full-stack online auction marketplace.

## Current status

The backend is actively under development and now includes authentication, PostgreSQL persistence and user profile management.

## Implemented

- Node.js backend setup
- Express server
- TypeScript configuration
- Development server with `tsx`
- CORS configuration
- Cookie parsing
- Zod request validation
- PostgreSQL local database
- Prisma 7 integration
- Prisma PostgreSQL adapter
- Prisma migrations
- Prisma Studio
- Auction model
- User model
- Auction API endpoints
- User registration
- Password hashing with bcrypt
- User login
- JWT authentication
- httpOnly cookie authentication
- Authentication middleware
- Protected `/api/auth/me` route
- Logout endpoint
- User profile update endpoint
- HTTP status handling
- Backend code split into routes, controllers, middleware, schemas and Prisma utilities

## Technologies

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma 7
- Zod
- bcrypt
- JSON Web Tokens
- cookie-parser
- cors
- tsx

## Current API

### Health

```http
GET /api/health
```

### Auctions

```http
GET  /api/auctions
GET  /api/auctions/:id
POST /api/auctions
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

## Authentication flow

```text
Register
  ↓
Validate input
  ↓
Hash password with bcrypt
  ↓
Store user in PostgreSQL

Login
  ↓
Validate credentials
  ↓
Compare password hash
  ↓
Create JWT
  ↓
Store JWT in httpOnly cookie

Protected request
  ↓
Read auth cookie
  ↓
Verify JWT
  ↓
Attach authenticated user to request
  ↓
Continue to protected route
```

## Database models

### User

Includes:

- id
- username
- email
- hashed password
- optional name
- phone
- address
- city
- postal code
- country
- bio
- createdAt
- updatedAt

### Auction

Includes:

- id
- title
- description
- category
- starting price
- current bid
- bid count
- image
- auction end date
- seller
- createdAt

## Project structure

```text
src/
├── controllers/
├── routes/
├── middleware/
├── schemas/
├── lib/
├── types/
└── server.ts
```

## Next steps

- Finalize controller/route separation
- Replace remaining temporary auction logic with authenticated user relations
- Connect Sell Auction to the logged-in user
- Add proper User–Auction relationships
- Add favourites relation
- Add bid model and bidding endpoints
- Add authorization checks for auction ownership
- Add protected seller operations
- Add centralized error handling
- Improve environment configuration
- Prepare for cloud PostgreSQL
- Add real-time bidding with WebSockets / Socket.IO
