Build a CMS for https://womentorafrica.com/ in this repository.

## Before you start

1. Check the repo first. If it already contains the CMS (a `prisma/schema.prisma`, `src/lib/collections.ts` and `src/app/admin`), do not rebuild. Clone `main`, run the setup in the README, verify it builds and runs, and report back. Everything below is then reference.
2. The environment must be able to reach `womentorafrica.com`. If a fetch fails with a 403 from the proxy, ask me to add `womentorafrica.com` under Allowed domains in the cloud environment's Network access settings and wait. Google Fonts and the npm registry should already be reachable.
3. Work on the branch you were given, commit with clear messages, and push. Do not open a PR unless I ask.

## What the live site is

A single-page Next.js marketing site. There are no other routes; `/about`, `/mentorship` etc. return 404. Navigation scrolls to sections with ids `home`, `about`, `mentorship`, `community`, `contact`. A separate member app lives at `https://my.womentorafrica.com` (login and `/signup?track=mentee|mentor`) and an API at `https://api.womentorafrica.com` with:

- `GET /public/configuration/signup/status` returning `{ menteeSignup, menteeWaitlist, mentorSignup, mentorWaitlist }` (booleans)
- `POST /public/configuration/signup/waitlist/subscribe` with `{ email, role }`

Fetch the homepage yourself with curl and pull the copy, assets and bundle strings. Key facts so you can check your extraction:

- Brand: orange `#D54407` (hover `#B43403`, light `#FF5A1F`), brown `#7F2C0F` and `#451305`, gold `#C19A5B`, peach `#FFD7A7`, cream `#FFEDD4` and `#FFF8F1`, body grey `#4A5565`.
- Fonts via next/font/google: Montserrat for headings, Lato for body, Playfair Display italic for quotes.
- Assets under `/illustrations/`, `/logos/`, `/icons/`, `/avatar/`, `/humans/` (heroImage.svg, africa.svg, circularIllustration.svg, womensHoldingHand.svg, womenInsideACircle.svg, womenPicture.svg, womentorIcon.svg, partner logos, mentor/mentee avatars, Left/RightArrow.svg). Skip `missionImage.svg` and `womenPicture2.jpg`; they are over 10 MB each and should be uploaded through the media library instead.
- Emails are Cloudflare-obfuscated (`data-cfemail`); decode them: `partnerships@womentorafrica.com` and `info@womentorafrica.com`. Phone `+254 719 286 229`. Address: African WoMentors Ltd, 2nd Floor, The AXIS, 26 Bank Street, Cybercity, Ebène 72201, Mauritius. Instagram and LinkedIn are `/womentorafrica/`. Footer: `© 2025 Womentor Africa | Lifting as We Rise`.
- Sections in order: Hero ("Lifting as We Rise", subtitle, italic quote, "Learn more"); About carousel with three slides (The Why, Our VISION, Our MISSION); Our Approach with three pillar cards (Mentorship, Training & Development, Sponsorship); Mentorship Overview with four unique features (Tiered Mentorship Levels, Pan-African Matching, Purpose-Driven Design, Community Integration); What to Expect with tabs (Duration & Structure, Support & Resources, Commitment & Engagement, Outcomes & Growth, FAQs) and an orange CTA "Ready to grow, give back, and rise together?"; a gold Playfair quote banner ("By joining Womentor Africa…"); Our Impact with six stats (200+ Women Connected, 14 Countries, 25+ Institutions, 600+ Mentorship Hours, 75% Mentees Became Mentors, 20+ Learning Sessions) laid out as a 1-2-3 pyramid; Partners carousel (AFIG Funds, Mastercard Foundation / Africa Growth Fund, MEDA, Zare Innovations, Triple C Advisory); community banner "Together, we lift. Together, we rise."; contact section (Partner With Us, Follow Womentor Africa, Contact Information); orange footer. The accordion bodies and the seven FAQs are only in the page JS chunk, not the HTML, so extract them from `/_next/static/chunks/app/page-*.js`.
- A "Join" modal lets a visitor choose Mentee or Mentor, shows three benefits each, links to the member app signup when open, and shows a waitlist email form when closed.

## What to build

Stack: Next.js 15 App Router, TypeScript, Tailwind 4, Prisma 6 on SQLite (provider swappable to PostgreSQL), bcryptjs cookie sessions, zod, marked + sanitize-html for Markdown. Node 22.

1. **Admin at `/admin`** with login, ADMIN and EDITOR roles, middleware redirect, logout.
   - Two singleton forms: Home page text (every heading, intro, image and the join-popup copy) and Settings & contact (site name, logo, member-app URL, the four signup/waitlist switches, address, emails, phone, socials, copyright, nav toggles for News and Events).
   - Generic, config-driven collections in one `collections.ts` with field types text, textarea, markdown (with preview), image (upload + URL), boolean, select, datetime, slug, url, email. List view with up/down ordering, publish toggle and delete; edit view from the field config. Collections: about slides, pillars, mentorship features, what-to-expect tabs, FAQs, impact stats, partners, news posts, events.
   - Media library with uploads. Store files in `uploads/` (env `UPLOAD_DIR`), not `public/`, and serve them through a `/uploads/[...path]` route handler with path-traversal protection. Files added to `public/` after `next build` return 404 in production.
   - Inbox: contact messages (read/unread, delete) and waitlist subscribers with CSV export. Users page for admins.
2. **Public site at `/`** reproducing the live page from the database with the same sections, copy, colours, fonts and assets, plus `/news`, `/news/[slug]`, `/events`, `/events/[slug]` shown in the nav only when enabled. Make the site routes `force-dynamic` so edits appear immediately. Include a contact form that posts to the API with a honeypot field.
3. **Public API with CORS** at `/api/public/configuration/signup/status` and `/api/public/configuration/signup/waitlist/subscribe` with exactly the shapes above, plus `POST /api/public/contact` and `GET /api/public/site` (all content as JSON).
4. **Seed** that creates the admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` and loads all the live copy. Keep it safe to rerun. Provide `.env.example` with `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `UPLOAD_DIR`.
5. **README** with setup, what each admin section controls, the API table, how to add a content type, and deployment notes (persistent disk for the SQLite file and uploads; PostgreSQL plus object storage for serverless hosts).

## Verify before you push

- `tsc --noEmit`, `next lint`, `next build` all clean.
- Start the production build and run a Playwright script against it (Chromium is preinstalled at `/opt/pw-browsers`, Playwright at `/opt/node-tools/node_modules/playwright`): reject a bad login, log in, edit the hero and confirm it on `/`, flip mentor signup off and confirm the status API and the join modal's waitlist form, create/reorder/delete a FAQ, publish a post with an uploaded cover image and open it at `/news/<slug>`, confirm the contact message and waitlist entry appear in the inbox. Take desktop and mobile screenshots of `/` and compare them with screenshots of the live site.
- Do not use `pkill -f "next start"` to stop the server; it kills your own shell. Use `fuser -k 3000/tcp`.

Nothing here connects to or changes the live site; the CMS is a separate app until I choose to point the domain or the existing front-end at it.
