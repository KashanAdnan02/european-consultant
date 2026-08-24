# European Consultant — Next.js Site

Converted from a static single-page HTML/Tailwind site into a proper
Next.js 14 (App Router) + TypeScript + Tailwind project.

## What changed from the original HTML

- The original used JS `show/hide` divs (`.page` / `.page.active`) to fake
  multi-page navigation on a single URL. This version uses **real Next.js
  routing** instead — every "page" is now its own route:
  - `/` — Home
  - `/about` — About
  - `/services` — Services
  - `/testimonials` — Testimonials
  - `/contact` — Contact (with the form)
  - `/thank-you` — Thank you / confirmation page

  This gives you real URLs, browser back/forward support, and lets each
  page have its own `<title>`/meta description for SEO — none of which the
  original hash-based approach supported.
- `Header` and `Footer` are shared components rendered once in
  `app/layout.tsx`, instead of being duplicated markup per "page".
- The hamburger menu and active-nav-link highlighting are handled by a
  small client component (`components/Header.tsx`) using
  `usePathname()`.
- The contact and appointment forms submit directly to FormSubmit without a
  custom email API or SMTP credentials.
- Tailwind config (`tailwind.config.ts`) carries over the exact custom
  colors (`swedenblue`, `swedenyellow`, etc.) and `fadeIn`/`popIn`
  keyframes from the original inline Tailwind config.

## Getting started

1. Copy env files:
   - `.env.example` → `.env` (Next.js website)
   - `server/.env.example` → `server/.env` (Node API / production)
2. Install dependencies: `npm install`
3. Run the two apps in **separate terminals**:

```bash
# Terminal 1 — API (MongoDB + Stripe + admin auth)
npm run dev:api

# Terminal 2 — Next.js website
npm run dev
```

Website: http://localhost:3000  
API: http://localhost:4000 (or the `PORT` in `server/.env`)

On first API start it creates the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
in `server/.env`. Sign in at `/admin/login` with those credentials.

## Email notifications

The contact form posts directly to
`https://formsubmit.co/manartanveer@gmail.com`. Paid appointment bookings are
confirmed by the Node API, stored in MongoDB, then emailed through FormSubmit.

FormSubmit sends an activation email the first time a form is submitted. Open
that message in `manartanveer@gmail.com` and confirm it before live
submissions can be delivered.

## Admin panel & MongoDB

The admin panel lives at `/admin`. Email and password are stored in MongoDB
(hashed). Services, appointment offices, appointment prices, and paid bookings
are also stored there. Stripe PaymentIntents are created on the Node server so
the secret key never reaches the browser.

### Environment variables

**Website** (`.env`):

```
API_URL=http://localhost:4000
SITE_URL=http://localhost:3000
STRIPE_PUBLISHABLE_KEY=pk_...
```

**API** (`server/.env` — used in production):

```
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=a-long-random-string
ADMIN_EMAIL=admin@europeanconsultant.com
ADMIN_PASSWORD=your-password
SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_...
APPOINTMENT_NOTIFY_EMAIL=you@example.com
```

### Admin routes

| Route | Purpose |
| --- | --- |
| `/admin` | Dashboard with published counts and the current appointment fee |
| `/admin/services` | Searchable list of services with edit, preview and delete |
| `/admin/services/new` | Create a service |
| `/admin/services/[id]` | Edit or unpublish a service |
| `/admin/appointment-services` | Manage visa appointment offices shown on `/appointment` |
| `/admin/appointment-services/new` | Create an appointment office |
| `/admin/appointment-services/[id]` | Edit or unpublish an appointment office |
| `/admin/pricing` | Update the appointment price, currency and note |

Each service is published to `/services/<title-slug>`, for example
`/services/germany-work-permit`. The public `/services` page groups cards by
type: work permit, tourist visas, business invitation, or company formation.
The appointment fee is shown on `/book-appointment` and on
every service page.

## Build for production

Deploy the API and website separately.

```bash
# Website
npm run build
npm run start

# API (on your Node host)
npm run start:api
```

Set production values in `server/.env` on the API host, and point the website
`API_URL` at that public API URL. The website is server-rendered for SEO
(`sitemap.xml`, `robots.txt`, Open Graph tags, and JSON-LD).

## Project structure

```
server/                         # Express + MongoDB API
  index.js                      # HTTP server
  models/                       # Admin, services, prices, bookings
  routes/                       # Auth, public reads, admin CRUD, Stripe
app/
  layout.tsx                    # Root layout, SEO metadata, JSON-LD
  sitemap.ts  robots.ts
  (site)/                       # Public website, wrapped in Header/Footer
  admin/                        # Admin panel (JWT cookie + API)
lib/
  api.ts                        # Next.js client for the Node API
  auth.ts  queries.ts  validation.ts
middleware.ts                   # Gates /admin behind the JWT cookie
```
