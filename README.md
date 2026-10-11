# Food Store (Kingdom Of Dumpling)

Single-folder Next.js app: storefront (hero + menu + cart + checkout), MongoDB Atlas orders, and `/admin` for paid orders with sound notifications.

## Setup

1. Edit `.env.local`: set `MONGODB_URI`, and adjust `ADMIN_EMAIL` / `ADMIN_PASSWORD` if needed.
2. Add your notification file: `public/sounds/order-notification.mp3`
3. Install and run:

```bash
npm install
npm run dev
```

- Store: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Refresh menu from Kingdom Of Dumpling

```bash
npm run scrape-menu
```

This updates `src/data/menu.json` (7 categories, 143 items from the live API).

## Production

```bash
npm install
npm run build
npm run start
```

Runs on port **3000** by default (`PORT=3000 npm run start` to override).

### Environment (hosting dashboard or server)

Set the same variables as `.env.local` on your host (Vercel, Railway, VPS, etc.):

| Variable | Required |
|----------|----------|
| `MONGODB_URI` | Yes |
| `MONGODB_DB_NAME` | Yes (e.g. `food_store`) |
| `ADMIN_EMAIL` | Yes |
| `ADMIN_PASSWORD` | Yes |
| `NEXT_PUBLIC_APP_URL` | Yes — your live URL, e.g. `https://yourdomain.com` |
| `STRIPE_SECRET_KEY` | Optional |
| `STRIPE_WEBHOOK_SECRET` | Optional (if using Stripe) |

After deploy, run **`npm run seed`** once (locally with production `MONGODB_URI` in env) if the menu is not already in Atlas.

**Vercel:** import `food-store`, add env vars, build command `npm run build`, output Next.js default.

## Payments

- **Without Stripe**: checkout uses demo payment and marks the order `paid` immediately.
- **With Stripe**: set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`; customers pay via Stripe Checkout.

## Design reference

Layout inspired by premium food storefronts (hero, storytelling, clean menu). Menu data scraped from [Kingdom Of Dumpling ordering](https://kingdomofdumpling.onlineordering.io/en).
