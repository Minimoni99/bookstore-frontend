# Ebook Store — Next.js frontend

Pairs with the FastAPI backend in `../bookstore-fastapi`. Same pattern as
your leadgen frontend: Next.js, deployed to Vercel, talking to a separate
API over HTTPS.

## 1. Run locally

```bash
npm install
cp .env.example .env.local
# edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000 (or wherever
# the FastAPI backend is running)
npm run dev
```

Visit `http://localhost:3000`. Make sure the FastAPI backend is running too
(see its README) — this app is pure frontend and does nothing without it.

## 2. Deploy to Vercel

1. Push this folder to its own GitHub repo (same as your leadgen frontend
   setup).
2. Import it in Vercel.
3. Set the environment variable `NEXT_PUBLIC_API_URL` to your deployed
   FastAPI backend's URL (e.g. `https://api.yourdomain.com`).
4. Deploy. Then go back to the backend's `.env` and set `CORS_ORIGINS` to
   include your new Vercel domain.

## Pages

```
/                     – book catalog
/books/[id]           – book detail + Pay by Card / Pay by Crypto
/login, /register     – auth
/account              – orders, subscription status, downloads
/pricing              – subscription signup
/order-success        – post-checkout landing page
/admin                – manage books (add/edit/delete)
/admin/orders         – view all orders
/admin/subscriptions  – view all subscriptions
/admin/users          – promote/demote admins
```

`lib/api.js` is the only place that knows about the backend URL and auth
token handling — every page calls through it.

## Branding

Replace `[Pen Name]` in `app/layout.js` and `app/components/NavBar.js` with
your actual pen name, and swap the placeholder book covers for real cover
images once they're in the admin panel.
