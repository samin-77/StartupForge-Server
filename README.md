# StartupForge Server

Backend API for the StartupForge startup team-building platform. Built with Node.js, Express, MongoDB, JWT authentication, Stripe payments, and Google OAuth.

## Features

- JWT + HTTPOnly cookie authentication
- Google OAuth integration
- Role-based access control (Founder, Collaborator, Admin)
- Stripe Checkout payment processing
- MongoDB with Mongoose ODM
- Server-side pagination, search (`$regex`), and filtering (`$in`)
- Auto-admin seeding on production startup
- CORS configured for Vercel client deployment

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/google` — Google OAuth
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user

### Startups
- `GET /api/startups/all` — All (paginated)
- `GET /api/startups/:id` — By ID
- `POST /api/startups` — Create (founder)
- `GET /api/startups` — My startup (founder)
- `PUT /api/startups` — Update (founder)
- `DELETE /api/startups` — Delete (founder)

### Opportunities
- `GET /api/opportunities/all` — All (paginated, filterable)
- `GET /api/opportunities/:id` — By ID
- `POST /api/opportunities` — Create (founder)
- `GET /api/opportunities` — My opportunities (founder)
- `GET /api/opportunities/stats/overview` — Founder stats
- `PUT /api/opportunities/:id` — Update (founder)
- `DELETE /api/opportunities/:id` — Delete (founder)

### Applications
- `POST /api/applications` — Apply
- `GET /api/applications/my` — My applications (collaborator)
- `GET /api/applications/founder` — Received applications (founder)
- `PUT /api/applications/:id/status` — Update status (founder)

### Users
- `GET /api/users/profile` — Get profile
- `PUT /api/users/profile` — Update profile

### Payments
- `POST /api/payments/create-checkout` — Stripe checkout
- `GET /api/payments/success` — Success handler

### Admin
- `GET /api/admin/overview` — Dashboard stats
- `GET /api/admin/users` — All users
- `PUT /api/admin/users/:id/block` — Toggle block
- `GET /api/admin/startups` — All startups
- `PUT /api/admin/startups/:id/approve` — Approve
- `DELETE /api/admin/startups/:id` — Remove
- `GET /api/admin/transactions` — All payments

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | JWT signing key |
| JWT_EXPIRES_IN | Token expiry (e.g. 7d) |
| GOOGLE_CLIENT_ID | Google OAuth client ID |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret |
| STRIPE_SECRET_KEY | Stripe secret key |
| CLIENT_URL | CORS origin |
| NODE_ENV | development / production |

## Getting Started

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

## Deployment

Deployed on Render. Cold starts may take 30-60s.
