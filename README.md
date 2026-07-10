# Moonlit Reverie

A small, polished demo website for a fictional retro diner-coffee house. Built mobile-first, like a
phone app — bottom tab navigation, and QR-code table ordering: scan the code on your table, browse the
menu, and send an order straight to the kitchen from your phone. Frontend-only, with mock data and
localStorage for sessions, orders, reservations, and rewards.

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

Open [http://localhost:3000](http://localhost:3000). Camera access on `/scan` needs `localhost` or
HTTPS — on a real phone, deploy it (Vercel, etc.) or use your browser's remote-device tools.

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Architecture Notes

- **Mock data** lives in `lib/mock-data.ts` — menu items, hours, demo user, seed reservations
- **Auth** is localStorage-based (`lib/auth.ts`) — sign up persists new accounts, not just the demo one
- **Ordering** (`lib/ordering.ts`) — active table session, per-table cart, and placed orders, all in
  localStorage
- **Reservations** (`lib/reservations.ts`) are created, listed, and cancelled from localStorage
- **Rewards** (`lib/rewards.ts`) tracks stamps per user, awarded automatically when an order is placed
- Guest orders and reservations use a temporary ID and won't show up under My Reservations/Rewards
  unless the person is signed in

## Not Fully Wired Up (by design, it's a demo)

- Orders are stored locally and shown back on the confirmation screen — there's no live kitchen display
  or order-status updates after it's sent
- **Map/location** is display-only — no embedded map or directions integration
- No payment flow — orders are "sent to the kitchen," not charged
- Everything lives in the browser's localStorage, so it's per-device, not synced across devices

## Design

Retro diner-coffee hybrid theme: warm cream background, rust-red accents, deep coffee-brown text,
mustard yellow for status badges. Vintage signage borders, checkerboard footer strip, a neon-flicker
hero with rising steam, and a hand-stamped punch card as the loyalty signature.
