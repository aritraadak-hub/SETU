# SETU — Bihar Tourism Marketplace

**सेतु** (Setu) means "bridge" in Hindi — and that's exactly the role this platform plays: a bridge between travelers and the people, places, and traditions of Bihar.

**Team: 4 Loops**
- Arpan Biswas
- Ayan Kumar Mondal
- Aritra Pal
- Aritra Adak

---

## 1. What SETU Does

SETU is a marketplace platform connecting **tourists** with **local vendors** (homestays, guides, artisans, and experience providers) across Bihar, wrapped around three things travelers usually struggle with in lesser-explored destinations:

- **Discovery** — knowing what's worth visiting, when, and how to get there
- **Trust** — booking accommodation or a guide from someone you've never heard of, in a place with limited formal tourism infrastructure
- **Language** — Bihar's tourism draw (temples, heritage sites, festivals) is often documented only in Hindi/regional language, or only in English, rarely both well

The platform serves three user roles, each with a distinct experience:

| Role | What they do on the platform |
|---|---|
| **Tourist** | Browse destinations, festivals, and stays; chat with an AI travel companion; message vendors directly; save favorites; book and pay for experiences |
| **Vendor** | List offerings (stays, guiding services, local experiences); manage orders and messages from tourists; build a public profile |
| **Admin** | Oversee the platform, manage listings and users, moderate content |

---

## 2. How It Helps Bihar Tourism

Bihar is home to major heritage and pilgrimage sites (Bodh Gaya, Nalanda, Rajgir, Vaishali, Patna Sahib, among others) and a rich festival calendar (Chhath Puja, Sonepur Mela, Rajgir Mahotsav, etc.), but tourism infrastructure and discoverability lag well behind states like Rajasthan or Kerala. SETU targets that gap directly:

- **Puts local vendors on the map, literally** — the multi-entity map feature lets small, independently-run stays and services appear alongside major attractions, instead of being invisible next to large hotel chains and booking platforms that rarely serve Bihar well.
- **Lowers the trust barrier for first-time visitors** — favorites, direct messaging with vendors, and a structured booking/payment flow give tourists more confidence than word-of-mouth or unlisted contacts.
- **Makes the festival calendar actually usable** — Bihar's festival and fair calendar (Chhath, Sonepur Mela, and regional fairs) is often known locally but poorly surfaced to outside visitors; a structured, browsable calendar changes that.
- **Removes the language barrier** — bilingual UI (Hindi/Bhojpuri-flavored copy alongside English) means the platform doesn't silently exclude the audience most likely to actually visit — domestic tourists from Hindi-speaking states — while still serving English-first users.
- **Gives an AI travel companion for a state with limited formal tourist-guide infrastructure** — an AI travel chat feature can answer practical questions (what to visit, how to plan a route, what a festival involves) in place of a paid human guide, which is often unavailable outside 2–3 major cities.
- **Creates direct income for local vendors** — homestays, artisans, and local guides get a direct sales/booking channel instead of relying entirely on informal networks or larger platforms that don't prioritize the region.

---

## 3. Tech Stack

### Frontend (`apps/web`)
- **React + TypeScript**
- **Vite** — build tool and dev server
- **Tailwind CSS** — styling (`tailwind.config.js`, `postcss.config.js`)
- Component-driven architecture (common components, layout, AI chat, etc.)

### Backend (`apps/api`)
- **Node.js + Express** — REST API, route/controller structure
- **Prisma ORM** — database access and schema management (`schema.prisma`)
- **SQLite** for local development (`dev.db`) — *production should point at a persistent database (Postgres/MySQL) rather than SQLite, since Render's disk is ephemeral and a local `.db` file will not survive redeploys*
- **JWT** — authentication

### Third-Party Services
- **Google Cloud Platform (GCP) API** — used via a service-account-bound API key (Maps/Geocoding and/or the AI travel companion)

### Deployment
- **Render** — hosting for the API (and possibly the frontend), configured via `render.yaml`
- **GitHub** — source control, with GitHub push protection actively guarding against committed secrets

### Monorepo Structure
- `apps/web` and `apps/api` as separate packages within a single repository

---

## 4. Repository Structure

```
SETU-1/
├── render.yaml                      # Render deployment blueprint
├── .gitignore
├── apps/
│   ├── api/                         # Backend — Node.js + Express + Prisma
│   │   ├── .env                     # Local secrets — NEVER committed
│   │   ├── .env.example             # Variable names only, no real values
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Database schema
│   │   │   ├── seed.ts              # Seed data (demo accounts, sample listings)
│   │   │   └── dev.db               # Local SQLite DB — should be gitignored
│   │   └── src/
│   │       ├── app.ts               # Express app entry, middleware setup
│   │       ├── config/
│   │       │   └── env.ts           # Environment variable loading/validation
│   │       ├── controllers/
│   │       │   ├── adminController.ts
│   │       │   ├── aiController.ts          # AI travel companion logic
│   │       │   ├── authController.ts        # Login/signup/JWT
│   │       │   ├── cityHubController.ts     # City/destination info hub
│   │       │   ├── favoriteController.ts    # Saved favorites
│   │       │   ├── messageController.ts     # Tourist <-> vendor messaging
│   │       │   ├── offeringController.ts    # Vendor listings/services
│   │       │   ├── orderController.ts       # Bookings/orders
│   │       │   ├── paymentController.ts     # Payment processing
│   │       │   ├── tourismController.ts     # Festivals, events, destinations
│   │       │   └── vendorController.ts      # Vendor profile/management
│   │       └── routes/
│   │           ├── aiRoutes.ts
│   │           ├── cityHubRoutes.ts
│   │           ├── favoriteRoutes.ts
│   │           ├── messageRoutes.ts
│   │           └── ...               # (routes mirroring each controller)
│   │
│   └── web/                          # Frontend — React + TypeScript + Vite
│       ├── .env / .env.example
│       ├── index.html
│       ├── tailwind.config.js
│       ├── vite.config.ts
│       ├── images/                   # Static tourism imagery
│       ├── public/
│       ├── dist/                     # Production build output
│       └── src/
│           ├── api/
│           │   └── client.ts         # API client for talking to apps/api
│           └── components/
│               ├── ai/
│               │   └── AiTravelCompanion*.tsx   # AI chat travel assistant
│               ├── common/
│               │   ├── FavoriteButton.tsx
│               │   ├── LanguageSwitcher.tsx      # Hindi/English toggle
│               │   ├── Lightbox.tsx              # Image viewer
│               │   ├── LoadingScreen.tsx
│               │   ├── PhotoMosaic.tsx           # Gallery grid
│               │   ├── SetuLogoMark.tsx
│               │   ├── TabView.tsx
│               │   └── TouristChatDrawer.tsx     # AI companion chat UI
│               └── layout/
│                   ├── Footer.tsx
│                   └── Header.tsx
```

---

## 5. Core Features (as implemented)

- **Authentication** — role-based login for Tourist / Vendor / Admin, with demo credentials for quick access during evaluation
- **AI Travel Companion** — in-app chat assistant for trip planning and destination questions
- **Interactive Multi-Entity Map** — shows destinations, stays, and vendors together on one map
- **Festival & Events Calendar** — structured browsing of Bihar's fairs and festivals (referenced against a dedicated Bihar Events/Festivals/Fairs dataset)
- **Vendor Marketplace** — vendors list offerings; tourists browse, favorite, message, and book
- **Messaging** — direct tourist-to-vendor communication
- **Orders & Payments** — booking flow with payment processing
- **Favorites** — save destinations/vendors for later
- **Bilingual UI** — Hindi/Bhojpuri-flavored copy alongside English via a language switcher
- **Photo Mosaic & Lightbox** — visual-first browsing of destinations and listings

---

## 6. Setup Instructions

### Prerequisites
- Node.js (v18+) and npm
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Tejas-India-Hackathon-2026/Team-4-Loops.git
cd Team-4-Loops
```

### 2. Backend setup (`apps/api`)
```bash
cd apps/api
npm install
cp .env.example .env    # fill in real values: JWT secret, GCP API key, DB URL, etc.
npx prisma generate
npx prisma migrate dev  # creates/updates the local SQLite dev.db
npx prisma db seed      # loads demo accounts and sample listings (if seed.ts is present)
npm run dev             # starts the Express API (check package.json for exact script name/port)
```

### 3. Frontend setup (`apps/web`)
```bash
cd apps/web
npm install
cp .env.example .env    # set the API base URL to point at apps/api (e.g. http://localhost:<port>)
npm run dev              # starts the Vite dev server
```
