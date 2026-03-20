# 🖤 Ravage Style — Luxury E-Commerce Platform

> Premium luxury clothing platform built with Next.js 14, MongoDB, Razorpay & Framer Motion.

---

## ✨ Features

### Storefront
- Luxury light/dark design system (Cormorant Garamond + Jost fonts)
- Animated hero, trending section, category banners
- Product grid with live filters, search, sort, pagination
- Product detail with image gallery, size selector, stock validation
- Slide-in cart drawer with quantity management
- Wishlist system (persisted)
- Customer reviews with verified purchase badge & rating distribution

### Checkout & Payments
- Full multi-step checkout (address → review → pay)
- Razorpay integration (create order → HMAC verify → webhook)
- Free shipping threshold (₹999+)
- Order success/failure pages with status tracking

### Account
- JWT auth (HttpOnly cookie, 7-day expiry)
- Orders list + detail with visual status progress bar
- Profile management
- Wishlist page

### Admin Dashboard
- Secure admin-only layout with sidebar navigation
- Products: full CRUD with image URLs, per-size stock, featured toggle
- Orders: paginated list, inline status update dropdown

### Backend (Serverless API Routes)
- `/api/auth` — signup, login, logout, me
- `/api/products` — CRUD + text search + trending
- `/api/products/[id]/reviews` — ratings with verified purchase
- `/api/orders` — create with stock validation, list, update
- `/api/razorpay` — create-order, verify (HMAC), webhook
- `/api/wishlist` — toggle + fetch
- `/api/admin/products` — admin product list

### Trending System
- Every product view is tracked via `Analytics` model (daily buckets)
- Every purchase increments `purchaseCount` + daily revenue
- Trending score = purchaseCount×3 + viewCount×1 + avgRating×10 + totalReviews×2
- Score is recomputed on every product save

---

## 🚀 Quick Start

### 1. Clone & install
```bash
git clone <your-repo>
cd ravage-style
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
```
Fill in:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — any random 32+ char string
- `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` — from Razorpay dashboard
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — same as RAZORPAY_KEY_ID

### 3. Run dev server
```bash
npm run dev
```
Open http://localhost:3000

### 4. Create admin account
Register at `/signup` — **the first user registered automatically becomes admin.**

### 5. Deploy to Vercel
```bash
vercel deploy
```
Set environment variables in Vercel dashboard.

---

## 📁 Project Structure

```
ravage-style/
├── app/
│   ├── api/                 # All serverless API routes
│   │   ├── auth/            # login, signup, logout, me
│   │   ├── products/        # CRUD + reviews
│   │   ├── orders/          # Order management
│   │   ├── razorpay/        # Payment flow
│   │   ├── wishlist/        # Wishlist toggle
│   │   └── admin/           # Admin-only endpoints
│   ├── products/            # Listing + detail pages
│   ├── checkout/            # Multi-step checkout
│   ├── orders/              # Order history + detail
│   ├── admin/               # Admin dashboard
│   ├── login/ signup/       # Auth pages
│   ├── profile/ wishlist/   # Account pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── layout/              # Navbar, Footer, Hero, etc.
│   ├── product/             # ProductCard, Reviews, Trending
│   ├── cart/                # CartDrawer
│   ├── checkout/            # Checkout components
│   ├── admin/               # Admin components
│   └── ui/                  # Button, Input, Modal, StarRating
├── lib/
│   ├── db.ts                # MongoDB connection (pooled)
│   ├── auth.ts              # JWT sign/verify/cookie
│   ├── api.ts               # Response helpers
│   └── utils.ts             # Formatting, constants
├── models/
│   ├── User.ts              # User with bcrypt
│   ├── Product.ts           # Product with trending score
│   ├── Order.ts             # Orders with status history
│   ├── Review.ts            # Reviews + auto rating update
│   └── Analytics.ts         # Daily analytics for trending
├── store/
│   ├── authStore.ts         # Zustand auth (persisted)
│   ├── cartStore.ts         # Zustand cart (persisted)
│   └── wishlistStore.ts     # Zustand wishlist (persisted)
└── styles/
    └── globals.css          # Luxury CSS design system
```

---

## 🎨 Design System

| Token | Light | Dark |
|---|---|---|
| `--bg-primary` | #fafafa | #0a0a0a |
| `--bg-secondary` | #ffffff | #131313 |
| `--text-primary` | #0a0a0a | #f5f5f5 |
| `--accent` | #c9a84c | #c9a84c |
| Font Display | Cormorant Garamond | — |
| Font Body | Jost | — |

---

## 💳 Razorpay Setup

1. Create account at razorpay.com
2. Get Key ID & Secret from Dashboard → Settings → API Keys
3. Use **test keys** for development, **live keys** for production
4. Add webhook: `https://yourdomain.com/api/razorpay/webhook`
   - Events: `payment.captured`, `payment.failed`, `refund.processed`

---

## 🔐 Security Notes

- Passwords hashed with bcrypt (12 rounds)
- JWT stored in HttpOnly cookie (XSS-safe)
- Razorpay signature verified server-side (HMAC SHA256)
- Admin routes protected both client and server side
- Input validation via Zod on all API routes
- Environment variables never exposed to client

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| State | Zustand (persisted) |
| Payments | Razorpay |
| Validation | Zod |
| Toast | react-hot-toast |
| Icons | Lucide React |
| Deployment | Vercel (serverless) |
