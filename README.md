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

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Email notifications

Both public forms post directly to
`https://formsubmit.co/manartanveer@gmail.com`. FormSubmit sends the
visitor's submitted fields in a table-formatted email. A hidden `_honey` field
provides basic bot filtering.

FormSubmit sends an activation email the first time a form is submitted. Open
that message in `manartanveer@gmail.com` and confirm it before live
submissions can be delivered.

## Admin panel & Supabase setup

The admin panel lives at `/admin` and is protected by Supabase Auth. Services
and the appointment price are stored in Supabase with row level security, so
only accounts listed in the `admins` table can write to them.

### 1. Create the database objects

In the Supabase dashboard open **SQL Editor** and run the contents of
`supabase/schema.sql`. This creates:

If you already ran an older version of the schema, also run
`supabase/add-service-fields.sql` to add the listing fields (`title`, `flag`,
`text`, `type`).

| Table | Purpose | Access |
| --- | --- | --- |
| `services` | One row per service listing, with title, flag, short text, type, jobs, salary, accommodation, medical & insurance, document requirements, process time and cost | Public read, admin write |
| `appointment_services` | Visa appointment offices shown on `/appointment` (name, flag image, short description) | Public read published, admin CRUD |
| `appointment_price` | Single row holding the consultation fee, currency and note | Public read, admin update only |
| `admins` | Allowlist of user IDs permitted to manage content | Private |

If you already have the base schema, also run
`supabase/appointment-services.sql` to add the appointment offices table.

### 2. Add the environment variables

Copy the project URL and publishable key from **Project Settings → API Keys**
into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
```

Older Supabase projects call this the anon key. Both names are supported —
`NEXT_PUBLIC_SUPABASE_ANON_KEY` is used as a fallback if the publishable key is
not set. Never put the service role or secret key in a `NEXT_PUBLIC_` variable.

Add the same two variables to your hosting provider before deploying.

### 3. Create the admin account

1. In Supabase go to **Authentication → Users → Add user**, set an email and
   password, and confirm the user.
2. Open **SQL Editor** and run `supabase/grant-admin.sql`, replacing
   `admin@example.com` with the email you just created.

Sign in at `/admin/login`. Accounts that are authenticated but missing from the
`admins` table land on `/admin/no-access` and cannot read or write content.

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

```bash
npm run build
npm run start
```

## Project structure

```
app/
  layout.tsx                    # Root layout — html/body, viewport and global styles
  globals.css
  (site)/                       # Public website, wrapped in Header/Footer
    layout.tsx
    page.tsx                    # Home
    about/ services/ testimonials/ contact/ thank-you/
    appointment/ book-appointment/
    services/[slug]/page.tsx    # Service detail, rendered from Supabase
  admin/
    actions.ts                  # Server actions: CRUD, pricing, auth
    login/page.tsx
    no-access/page.tsx
    (dashboard)/                # Protected admin shell
      layout.tsx
      page.tsx                  # Dashboard
      services/                 # List, create, edit
      pricing/page.tsx
components/
  Header.tsx  Footer.tsx  ContactForm.tsx  BookingForm.tsx
  admin/                        # Admin shell, forms, table and UI primitives
lib/
  auth.ts                       # Session and admin guards
  queries.ts                    # Read helpers for services and pricing
  validation.ts                 # Form parsing and validation
  utils.ts                      # Slug, price and date formatting
  supabase/                     # Browser, server and middleware clients
middleware.ts                   # Refreshes the session, gates /admin
supabase/
  schema.sql                    # Tables, triggers and RLS policies
  grant-admin.sql               # Grants admin access to an existing user
```
