# Womentor Africa CMS

A content management system for [womentorafrica.com](https://womentorafrica.com/). It has two halves:

- **Admin** at `/admin` where the team edits every section of the site, manages news and events, uploads images, and reads contact messages and waitlist signups.
- **Public site** at `/` which renders the Womentor Africa site (hero, about, approach, mentorship, what to expect, FAQs, impact, partners, contact) from the database, plus `/news` and `/events`.

It also exposes a public JSON API with the same endpoints the current front-end calls on `api.womentorafrica.com`, so the existing site can be pointed at this CMS without a rewrite.

## Stack

Next.js 15 (App Router, server actions), TypeScript, Tailwind CSS 4, Prisma 6 with SQLite (switchable to PostgreSQL), cookie sessions with bcrypt.

## Getting started

```bash
cp .env.example .env         # then edit SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npx prisma migrate dev       # creates prisma/dev.db
npm run db:seed              # loads the live site content and the admin user
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the CMS. Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`, then change the password under **Users**.

## What can be edited

| Admin section | Controls |
| --- | --- |
| Home page text | Hero headline, subtitle, quote, button; section titles and intros; images; join-popup copy |
| Settings & contact | Site name, logo, member-app URL, signup open/waitlist switches, address, emails, phone, socials, copyright, nav toggles |
| About slides | The Why / Vision / Mission carousel |
| Approach pillars | Mentorship, Training & Development, Sponsorship cards |
| Mentorship features | "What makes our mentorship program unique" bullets |
| What to expect | Tabs (Duration & Structure, Support & Resources…) in Markdown |
| FAQs | Questions in the FAQs tab |
| Impact stats | Numbers in "Our Impact" |
| Partners | Logos and links in the partners carousel |
| News & stories | Articles at `/news/<slug>` |
| Events | Learning sessions at `/events/<slug>` |
| Media library | Uploaded images (saved to `uploads/`, or `UPLOAD_DIR`) |
| Messages / Waitlist | Contact-form submissions and waitlist emails (CSV export) |
| Users | Admins and editors (admins only) |

Every list supports drafts, manual ordering (up/down) and delete. Changes appear on the site immediately.

## Public API

| Endpoint | Purpose |
| --- | --- |
| `GET /api/public/configuration/signup/status` | `{ menteeSignup, menteeWaitlist, mentorSignup, mentorWaitlist }`, same shape as the existing API |
| `POST /api/public/configuration/signup/waitlist/subscribe` | `{ email, role: "mentee" \| "mentor" }` |
| `POST /api/public/contact` | `{ name, email, subject?, message }` |
| `GET /api/public/site` | All site content as JSON (for headless use) |

All public endpoints send CORS headers so another front-end can call them.

## Adding a content type

1. Add a model to `prisma/schema.prisma` and run `npx prisma migrate dev --name <change>`.
2. Add an entry to `COLLECTIONS` in `src/lib/collections.ts` describing its fields.
3. Render it where needed on the public site (`src/app/(site)/page.tsx`) and, if it belongs in the cached site payload, in `src/lib/content.ts`.

The generic admin pages pick the new collection up automatically.

## Deploying

- **Node host (VPS, Railway, Render, Fly…)**: set `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`; run `npm run build`, `npm run db:migrate`, `npm run db:seed`, `npm start`. Keep `prisma/*.db` and `uploads/` (or set `UPLOAD_DIR`) on a persistent disk.
- **PostgreSQL**: change `provider = "sqlite"` to `"postgresql"` in `prisma/schema.prisma`, delete `prisma/migrations`, set `DATABASE_URL`, and run `npx prisma migrate dev --name init`.
- **Serverless (Vercel)**: use PostgreSQL and an object store for uploads; the local filesystem is not persistent there. `src/app/api/admin/upload/route.ts` is the single place to swap in S3, Cloudinary or similar.

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript |
| `npm run db:migrate` | Apply migrations (production) |
| `npm run db:seed` | Seed content and admin user (safe to rerun) |
| `npm run db:reset` | Drop and recreate the local database |
