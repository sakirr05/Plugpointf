[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)

# PlugPoint

PlugPoint is a peer-to-peer EV charger finder and booking UI aimed at drivers who need a slot and hosts who want to rent a home charger. The copy and sample data in the repo are aimed at **Bangalore, KA** (₹ pricing, neighbourhood names). It's built **mobile-first**: one column, touch-sized controls, meant to feel like an app in the browser rather than a desktop site that shrinks down.

## What it does

Drivers browse and filter chargers (connector type, price, availability), open one for detail, then book a time window in a modal — pick date and slot, hit a fake payment step (UPI / card / wallet labels), then a confirmation. Hosts go through a four-step list flow: basics, connector and power, pricing and hours, then amenities and instructions, with optional photo upload. The map view shows the same charger set on a Leaflet map centred on Bangalore so you can tap markers and jump into detail.

## Screens

| Screen | What it does |
|--------|----------------|
| `/` | Home / Discover — search, filters (All, J1772, CCS, Tesla Wall Connector), sort, charger cards |
| `/map` | Interactive map — Leaflet 1.9, OpenStreetMap tiles, `L.divIcon` price bubbles, tap for sheet |
| `/charger/:id` | Charger detail, reviews, open booking modal |
| `/bookings` | Booking list with status (upcoming, active, completed, cancelled) |
| `/list-charger` | Four-step host wizard — connectors include J1772, CCS, Tesla Wall Connector, CHAdeMO |
| `/profile` | Signed-in profile: stats, hosted chargers, earnings placeholders |
| `/auth` | Email/password + Google sign-in (`signInWithPopup`); Apple button is disabled |

## Stack

**Frontend** — React 18.3 (peer), TypeScript, Vite 6.4.x  
**Routing** — `react-router` 7.13 (`createBrowserRouter`, `RouterProvider`)  
**Styling** — Tailwind CSS 4.1.x with `@tailwindcss/vite`, shadcn-style UI under `src/app/components/ui/` (Radix primitives)  
**Map** — Leaflet 1.9 with `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`  
**Auth** — Firebase 12.x (`firebase/auth`: email/password, Google OAuth)  
**State** — React Context (`AppContext`) plus `useState` / effects — no Redux or Zustand  
**Backend** — Supabase JS client (`lib/db.ts`) for Postgres tables (`chargers`, `bookings`, `reviews`, `profiles`); `supabase/functions/server/` ships a small Hono + KV helper (Figma Make–style), separate from the main CRUD path  
**Icons** — Lucide React 0.487  

## Getting started

### Prerequisites

- Node 18+
- A Firebase project (free tier is fine) if you want real sign-in
- A Supabase project if you want listings, bookings, and reviews to load and persist (see below)

### Clone and install

```bash
git clone https://github.com/sakirr05/Plugpointf.git
cd Plugpointf
npm install
npm run dev
```

Vite defaults to port 5173 unless something else is using it.

### Firebase setup

Copy `.env.example` to `.env` and fill in the six Firebase variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

There isn’t a `FIREBASE_SETUP.md` in this repo right now. In the Firebase console, create a web app, enable **Email/Password** and **Google** under Authentication → Sign-in method, add `localhost` to authorized domains if needed, then paste the config values into `.env`. Without real keys the bundled fallbacks in `src/config/firebase.ts` still let the SDK initialize, but sign-in won’t work against your project.

The same `.env.example` also lists **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`**. Add those too — `src/config/supabase.ts` calls `createClient` at import time; missing URLs throw and the app won’t render.

## Things worth knowing

The shell uses **`max-w-lg`** (32rem / 512px) and `mx-auto`, so on a wide monitor you get a phone-sized column in the middle. That’s intentional: you’re not building a fluid marketing layout.

`mock-data.ts` is the source of **TypeScript types** and **seed content** in git (Bangalore addresses, ₹ `pricePerHour` / `pricePerKwh`, connectors like J1772, CCS, Tesla Wall Connector). The live list and map read **`chargers` and `reviews` from Supabase** via `AppContext` on mount, not those static arrays. Bookings and new listings go through `lib/db.ts` when Firebase auth is active. If Supabase isn’t configured, fix the env vars before debugging “empty feed” issues.

The **Continue with Apple** control is `disabled`, with `opacity-50` and `cursor-not-allowed` — it’s not hooked to Sign in with Apple.

Leaflet pulls **OpenStreetMap** raster tiles. Marker positions use each charger’s **`lat` / `lng`** from the dataset (Bangalore area). Custom markers are built with **`L.divIcon`** (HTML string + ₹ price); there’s no separate marker image pack.

`onAuthStateChanged` keeps Firebase user state; the app maps that to a local `User` in context (display name, photo URL, email, etc.) and calls **`upsertProfile`** toward Supabase when someone signs in.

The Edge Function folder is a thin Hono server with a generated KV store module — the React app’s day-to-day data path is the **Supabase client + SQL tables**, not that KV API.

## Project layout

```
Plugpointf/
├── index.html
├── package.json
├── vite.config.ts
├── .env.example
├── src/
│   ├── main.tsx
│   ├── styles/
│   ├── config/
│   │   ├── firebase.ts
│   │   └── supabase.ts
│   ├── hooks/
│   │   └── useFirebaseAuth.ts
│   ├── lib/
│   │   └── db.ts              # Supabase queries / inserts
│   └── app/
│       ├── App.tsx
│       ├── routes.ts
│       ├── context/
│       │   └── AppContext.tsx
│       ├── data/
│       │   └── mock-data.ts   # types + seed rows
│       └── components/
│           ├── Layout.tsx
│           ├── HomePage.tsx
│           ├── MapPage.tsx
│           ├── ChargerDetailPage.tsx
│           ├── BookingModal.tsx
│           ├── BookingsPage.tsx
│           ├── ListChargerPage.tsx
│           ├── ProfilePage.tsx
│           ├── AuthPage.tsx
│           ├── ChargerCard.tsx
│           ├── figma/
│           └── ui/            # shadcn/ui primitives (accordion, dialog, sheet, …)
└── supabase/
    └── functions/
        └── server/            # Hono + KV (Figma Make scaffold)
```
