# Moonlit Reverie

A small, polished website for a fictional retro diner-coffee house. Built mobile-first, like a
phone app — bottom tab navigation, and QR-code table ordering: scan the code on your table, browse the
menu, and send an order straight to the kitchen from your phone. Supabase provides authentication and
the shared menu, order, and reservation data; localStorage keeps the active table, cart, and rewards on
the device.

## Tech Stack

- **Next.js 14** (App Router) with React 18
- **TypeScript** (strict mode, `noUncheckedIndexedAccess: true`)
- **Tailwind CSS** with a custom retro-diner theme (no default Tailwind palette)
- **framer-motion** — neon-sign flicker, rising steam, stamp-card and QR-modal animations
- **html5-qrcode** — live camera QR scanning on `/scan`
- **qrcode** — generates the printable table codes (`/tables`) and the member's loyalty code (`/rewards`)
- **lucide-react** — icons
- **date-fns** — date formatting utilities
- **@fontsource** — self-hosted Bebas Neue (display), Source Sans 3 (body), IBM Plex Mono (prices/codes)
- **clsx** + **tailwind-merge** — combined `cn()` utility

## App shell

Every page renders inside a phone-width app shell (`max-w-480px`) with a fixed bottom tab bar
(`components/BottomNav.tsx`): Home, Menu, **Scan** (raised center action), Reserve, Account.
`public/manifest.json` + metadata in `app/layout.tsx` make the site installable to a phone home screen
as a standalone app (no browser chrome).

## Pages

| Route              | Description                                                              |
| ------------------ | ------------------------------------------------------------------------- |
| `/`                | Landing — neon hero, story, staff picks, scan-your-table banner, hours   |
| `/menu`            | Menu grid with category filter; add items once a table is active        |
| `/scan`            | Camera QR scanner that reads a table code and activates ordering for it |
| `/cart`            | Review the order for your table, adjust quantities, send it to the kitchen |
| `/tables`          | Printable-style QR codes for demo tables 1–8, for testing `/scan`       |
| `/reserve`         | 3-step reservation flow → confirmation screen with a code                |
| `/login`           | Sign in / sign up; doubles as the Account hub once signed in             |
| `/my-reservations` | Protected — reservations for the signed-in user, with cancel             |
| `/rewards`         | Protected — digital punch card + "Show My Code" member QR for staff     |

## How the QR table-ordering loop works

1. Each table has its own code encoding `MOONLIT:TABLE:<number>` — see `/tables` for demo codes you can
   point your phone at (or use the "Table 3/5/7" shortcut buttons on `/scan` if you don't have a second
   screen handy).
2. Scanning one on `/scan` sets that table as your active session (`lib/ordering.ts`) and drops you into
   the menu.
3. Add items on `/menu` — a floating cart bar tracks the running total — then review and send the order
   from `/cart`. Placing an order stores it against that table number with an order code like `T5-4821`.
4. If you're signed in, placing an order also adds a stamp to your punch card (`/rewards`); 8 stamps
   unlocks a free item.

**Table auto-detect via URL:** any page also accepts a `?table=N` query param on load (e.g. a real table QR code would point to `https://your-domain.example?table=12`); when present it's kept in memory for the session (`lib/table-session.tsx`), shows a dismissible "You're seated at Table N" banner, and pre-fills/skips the table field in the Reserve flow.

## Demo Account

| Field    | Value               |
| -------- | ------------------- |
| Email    | `alex@demo.moonlit` |
| Password | `moonlit123`        |

## Getting Started

```bash
npm install
npm run dev
```

Before accepting orders, apply the SQL files in `supabase/migrations/` to the
connected Supabase project using the Supabase SQL Editor (or the Supabase CLI).
This creates the `orders` and `order_items` schema required by checkout.

Open [http://localhost:3000](http://localhost:3000). Camera access on `/scan` needs `localhost` or
HTTPS — on a real phone, deploy it (Vercel, etc.) or use your browser's remote-device tools.

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Architecture Notes

- **Mock data** lives in `lib/mock-data.ts` — menu examples, hours, and demo copy
- **Auth** (`lib/auth.ts`) uses Supabase Auth
- **Ordering** (`lib/ordering.ts`) stores the active table and per-table cart locally, while placed
  orders and their line items are persisted to Supabase
- **Reservations** (`lib/reservations.ts`) are persisted to Supabase
- **Rewards** (`lib/rewards.ts`) tracks stamps per user, awarded automatically when an order is placed
- Guest orders and reservations use a temporary ID and won't show up under My Reservations/Rewards
  unless the person is signed in

## Not Fully Wired Up (by design, it's a demo)

- Orders are shown in the staff dashboard and can be updated live, but there is no POS or kitchen-display
  integration
- **Map/location** is display-only — no embedded map or directions integration
- No payment flow — orders are "sent to the kitchen," not charged
- Cart state and rewards are device-local; menu, orders, reservations, and accounts require a configured
  Supabase project

## Design

Retro diner-coffee hybrid theme: warm cream background, rust-red accents, deep coffee-brown text,
mustard yellow for status badges. Vintage signage borders, checkerboard footer strip, a neon-flicker
hero with rising steam, and a hand-stamped punch card as the loyalty signature.
