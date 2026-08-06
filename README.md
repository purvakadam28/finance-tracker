# Ledger — Personal Finance Tracker

A full-stack app for logging income and expenses, with a dashboard that breaks
down spending by category. Built to learn (and demonstrate) how the frontend,
backend, database, and auth layers of a real web app fit together.

**Stack:** React (Vite) · Node.js / Express · SQLite (better-sqlite3) · JWT auth

## Features

- Email/password signup and login (passwords hashed with bcrypt, sessions via JWT)
- Add, view, and delete income/expense transactions
- Dashboard with running balance, total income/expenses, and a category breakdown chart
- Each user only sees their own data

## Project structure

```
finance-tracker/
├── backend/          Express API + SQLite database
│   └── src/
│       ├── db.js              database connection + schema
│       ├── middleware/auth.js JWT verification middleware
│       ├── routes/auth.js     register/login
│       ├── routes/transactions.js  CRUD + summary endpoints
│       └── server.js          app entry point
└── frontend/         React (Vite) single-page app
    └── src/
        ├── api.js             fetch wrapper for the backend
        ├── context/AuthContext.jsx  auth state (token/user)
        ├── pages/              Login, Register, Dashboard
        └── components/         form, list, charts, summary cards
```

## Running it locally

You'll need two terminal windows — one for the backend, one for the frontend.

**1. Backend**
```bash
cd backend
npm install
cp .env.example .env      # edit JWT_SECRET if you like
npm run dev                # starts on http://localhost:4000
```

**2. Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173`, create an account, and start logging transactions.

## How the pieces fit together (the "full stack" part)

1. **Frontend (React)** — renders the UI and calls the backend via `fetch`
   (see `src/api.js`). It never talks to the database directly.
2. **Backend (Express)** — exposes a REST API (`/api/auth/*`, `/api/transactions/*`).
   Every transaction route runs through `requireAuth` middleware, which checks
   the JWT sent in the `Authorization: Bearer <token>` header.
3. **Database (SQLite)** — two tables, `users` and `transactions`, linked by
   `user_id` with a foreign key. `better-sqlite3` runs synchronously, so no
   callbacks/promises are needed for queries.
4. **Auth** — on login/register, the backend signs a JWT containing the
   user's id. The frontend stores it in `localStorage` and attaches it to
   every API request. The backend never trusts data from the frontend about
   *who* is asking — it always derives the user from the verified token.

## API reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account, returns token |
| POST | `/api/auth/login` | – | Log in, returns token |
| GET | `/api/transactions` | ✓ | List your transactions |
| POST | `/api/transactions` | ✓ | Create a transaction |
| PUT | `/api/transactions/:id` | ✓ | Update a transaction |
| DELETE | `/api/transactions/:id` | ✓ | Delete a transaction |
| GET | `/api/transactions/meta/summary` | ✓ | Totals + category breakdown |

## Deploying (optional next step)

- **Backend**: Render or Railway both support Node + persistent disk (needed
  for the SQLite file) on their free tiers.
- **Frontend**: Vercel or Netlify — set `VITE_API_URL` to your deployed
  backend URL as an environment variable at build time.

## Ideas to extend this (good for showing initiative in interviews)

- Monthly view / date range filtering
- Recurring transactions
- Budgets per category with progress bars
- Export to CSV
- Swap SQLite for Postgres for production
