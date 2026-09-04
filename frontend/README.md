# Bidora Frontend

Frontend for **Bidora**, a modern online auction marketplace.

## Current status

The frontend foundation is largely complete and is now being connected to the backend API.

## Implemented

- Responsive homepage
- Responsive navbar and mobile menu
- Bidora custom branding and styling
- Hero section
- Auction search and category filtering with demo data
- Reusable auction cards
- Responsive auction grid
- Popular categories section
- How Bidora Works section
- Seller CTA and footer
- Explore All Auctions page
- Dynamic auction details page
- Sell Auction page
- Auction creation form
- Form validation with React Hook Form and Zod
- Image preview for auction uploads
- Login page
- Registration page
- Show / hide password functionality
- Backend-connected login
- Backend-connected registration
- JWT cookie authentication flow
- Editable user profile
- Profile data loaded from the backend
- Profile update with PATCH request
- Profile navigation
- Favourites page UI
- My Bids page UI
- My Auctions page UI
- Login error handling for invalid credentials
- Auth-aware navbar state
- Responsive layouts for desktop, tablet and mobile
- shadcn/ui integration

## Technologies

- Next.js 16
- React
- TypeScript
- Tailwind CSS v4
- React Hook Form
- Zod
- shadcn/ui
- Lucide React

## Backend integration currently used

The frontend currently communicates with the backend API at:

```text
http://localhost:4000
```

Implemented integrations include:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
PATCH /api/users/me
```

## Current limitations

Some auction-related functionality still uses demo data.

The following areas are not yet fully connected to persistent backend data:

- Auction listings
- Auction details
- Sell Auction submission
- Favourites
- My Bids
- My Auctions
- Real image uploads
- Real-time bidding

## Next steps

- Finalize navbar/account navigation UX
- Connect auction pages to backend API
- Connect Sell Auction form to backend
- Implement real favourites
- Implement bids and user auction management
- Add protected frontend routes
- Add real auction countdowns
- Add image upload handling
- Add real-time bidding
- Add UI animations and micro-interactions
