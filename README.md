# Peyyala Manideep — Portfolio Platform

A production-grade personal portfolio with a full content management system.
Every word, image, project, skill and setting on the public site is editable
from a password-protected admin panel — no code changes, no redeploys.

Built as a **completely independent project**. It shares no code, no
repository, no database and no deployment with any previous portfolio.

- **Public site** — Next.js 16 App Router, server-rendered, statically
  optimised, fully responsive, accessible, SEO-complete
- **Admin CMS** (`/admin`) — 20 screens covering every piece of content,
  with authentication, validation, media uploads and an audit log
- **Zero-cost infrastructure** — no database service, no storage bucket,
  no card on file. Content lives as versioned JSON in this repository.

---

## Table of contents

1. [Quick start](#1-quick-start)
2. [What's in the box](#2-whats-in-the-box)
3. [Tech stack](#3-tech-stack)
4. [Architecture](#4-architecture)
5. [Folder structure](#5-folder-structure)
6. [Local installation — step by step](#6-local-installation--step-by-step)
7. [Environment variables](#7-environment-variables)
8. [Deploying to GitHub + Vercel — step by step](#8-deploying-to-github--vercel--step-by-step)
9. [Custom domain](#9-custom-domain)
10. [**WHERE TO CHANGE WHAT**](#10-where-to-change-what)
11. [Using the admin panel](#11-using-the-admin-panel)
12. [Design system](#12-design-system)
13. [Security](#13-security)
14. [Accessibility](#14-accessibility)
15. [SEO](#15-seo)
16. [Performance](#16-performance)
17. [Legacy website feature migration](#17-legacy-website-feature-migration)
18. [Maintenance](#18-maintenance)
19. [Troubleshooting](#19-troubleshooting)
20. [Useful links](#20-useful-links)
21. [Known limitations](#21-known-limitations)
22. [License & credits](#22-license--credits)

---

## 1. Quick start

```bash
git clone <your-repo-url>
cd manideep-portfolio-pro
npm install
npm run hash-password        # generates ADMIN_PASSWORD_HASH + AUTH_SECRET
cp .env.example .env.local   # paste the two values in
npm run dev
```

Public site → http://localhost:3000
Admin panel → http://localhost:3000/admin

Full walkthrough in [section 6](#6-local-installation--step-by-step).

---

## 2. What's in the box

### Public website

| Section | Notes |
|---|---|
| Hero | Name, rotating job titles (typewriter), intro, 3 CTAs, résumé download, social icons, animated constellation background, portrait |
| About | Story paragraphs, highlight tags, data-driven stat cards, portrait |
| Skills | Category filter chips, proficiency meters, years of experience |
| Experience | Timeline with responsibilities, achievements, technologies, dates |
| Projects | Filter by category, live search, cards linking to full case-study pages |
| Project detail | Own route (`/projects/[slug]`), challenge / solution / process / outcome, gallery, tech sidebar, related projects, own SEO + OpenGraph |
| Services | Optional — off by default |
| Certifications | Issuer, dates, credential ID, verification link |
| Education | Degrees, grades, achievements |
| Testimonials | Optional — off by default |
| Contact | Validated form with 4 states, plus email/phone/location cards and social links |
| Footer | Navigation, contact details, socials, back-to-top |

Plus: preloader-free instant first paint, 404 page, error boundary,
maintenance mode, `sitemap.xml`, `robots.txt`, JSON-LD structured data.

### Admin CMS (`/admin`)

**Dashboard** — content counts, unread messages, recent activity, and
configuration warnings (e.g. "GitHub storage isn't configured").

**Content modules** — Hero, About, Skills, Skill Categories, Experience,
Projects, Education, Certifications, Services, Testimonials, Social Links,
Résumé, Contact Section.

**System modules** — Website Settings, SEO & Analytics, Appearance,
Navigation, Sections (show/hide/reorder), Activity Log, Contact Messages.

Every module supports: create, edit, delete, reorder, show/hide, and
draft/published/archived status where it applies. Uploads, confirmation
dialogs, toasts, empty states, unsaved-change warnings and a sticky save bar
are built in.

---

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components, static generation, route handlers, image optimisation in one tool |
| Language | TypeScript (strict) | Content model and UI share one set of types |
| Styling | Tailwind CSS v4 | Design tokens defined once in `globals.css`, consumed everywhere |
| Animation | Framer Motion | Declarative, respects `prefers-reduced-motion` |
| Icons | lucide-react + hand-authored brand SVGs | lucide v1 dropped brand glyphs, so the six social logos are inline paths |
| Validation | Zod | One schema validates admin writes server-side and types the whole app |
| Auth | scrypt + `jose` (JWT) | Real password hashing and signed httpOnly sessions, no third-party service |
| Storage | GitHub Contents API | Versioned JSON, free, no database to run |
| Hosting | Vercel | Free Hobby tier, zero-config for Next.js |

**Dependencies added beyond `create-next-app`:** `framer-motion`,
`lucide-react`, `jose`, `zod`, `server-only`. That's it — no UI kit, no
state library, no ORM, no auth SaaS.

---

## 4. Architecture

```
Browser
   │
   ├── Public pages ──── Server Components ──┐
   │                                          │
   ├── /admin ─── middleware.ts (JWT gate) ──┤
   │                                          ▼
   └── /api/* ─── route handlers ──────► src/lib/store.ts
                   (auth + zod validation)      │
                                                ├── production: GitHub Contents API
                                                │      → data/*.json  (a real commit per save)
                                                └── development: local ./data/*.json
```

### Why JSON-in-git instead of a database

A single-author portfolio holds tens of records with one writer. A managed
Postgres adds a service to run, a bill to pay, a connection pool to tune and
a migration story to maintain — for no functional gain at this scale. Storing
content as JSON in the repository gives:

- **Free** — no database, no storage bucket, no card required, ever
- **Version history** — every admin save is a git commit you can inspect,
  diff and revert from GitHub's UI
- **Portability** — the whole site's content is a folder of readable files
- **No cold starts or connection limits**

The trade-off is that writes are serialised through the GitHub API (roughly
a second per save) and it wouldn't suit high write volume. `src/lib/store.ts`
is the only file that knows how data is stored, so swapping in Postgres later
means reimplementing that one module — nothing else changes.

### Data flow for a content edit

1. Admin edits a field → `ModuleEditor` holds it in local state
2. **Save** → `POST /api/admin/content` with `{ key, value }`
3. Route verifies the session, then validates `value` against the Zod schema
   for that key — invalid data is rejected with a readable message
4. `saveContentKey()` writes `data/content.json` (a GitHub commit in prod)
5. `revalidatePath("/")` refreshes the live pages immediately
6. The action is appended to the activity log

---

## 5. Folder structure

```
manideep-portfolio-pro/
├── src/
│   ├── app/
│   │   ├── layout.tsx              Root layout: fonts, metadata, analytics
│   │   ├── page.tsx                Public homepage (composes sections by CMS order)
│   │   ├── globals.css             ★ The entire design system
│   │   ├── not-found.tsx           404
│   │   ├── error.tsx               Error boundary
│   │   ├── sitemap.ts              Generated from live content
│   │   ├── robots.ts               Honours the SEO indexing toggle
│   │   ├── projects/[slug]/        Case-study pages (statically generated)
│   │   ├── admin/
│   │   │   ├── layout.tsx          Toast provider, noindex
│   │   │   ├── login/              Sign-in
│   │   │   ├── page.tsx            Dashboard
│   │   │   ├── [module]/           ★ Generic CMS page — serves 17 modules
│   │   │   ├── messages/           Contact inbox
│   │   │   ├── sections/           Section visibility + order
│   │   │   └── activity/           Audit log
│   │   └── api/
│   │       ├── contact/            Public form (honeypot + rate limit)
│   │       ├── auth/login|logout/  Session management
│   │       └── admin/
│   │           ├── content/        Read + write content (authenticated)
│   │           ├── messages/       Inbox management
│   │           └── media/          Uploads (type + size validated)
│   ├── components/
│   │   ├── ui/index.tsx            Buttons, cards, pills, section headers
│   │   ├── site/                   Public sections + motion + particles
│   │   └── admin/                  Shell, generated forms, inbox, toasts
│   ├── lib/
│   │   ├── schema.ts               ★ Content model (Zod) — the source of truth
│   │   ├── defaults.ts             Seed content
│   │   ├── store.ts                ★ Storage layer (GitHub / filesystem)
│   │   ├── auth.ts                 Hashing, sessions, rate limiting
│   │   ├── admin-config.ts         ★ Declares every CMS form
│   │   └── utils.ts                Formatting helpers
│   └── middleware.ts               Protects /admin at the edge
├── data/                           content.json, messages.json, activity.json
├── public/                         Portrait, résumé, uploads/
├── scripts/
│   ├── hash-password.mjs           Generates ADMIN_PASSWORD_HASH + AUTH_SECRET
│   └── check-defaults.ts           Validates seed content against the schema
├── .env.example
└── README.md
```

The four ★ files are where nearly all meaningful change happens.

---

## 6. Local installation — step by step

### STEP 1 — Requirements

Node.js 20 or newer (`node -v`). npm ships with it.

### STEP 2 — Get the code

```bash
git clone <your-repo-url>
cd manideep-portfolio-pro
```

### STEP 3 — Install dependencies

```bash
npm install
```

### STEP 4 — Generate your admin credentials

```bash
npm run hash-password
```

It asks for a password and prints two lines. Your password is never stored
anywhere — only a scrypt hash of it.

### STEP 5 — Create `.env.local`

```bash
cp .env.example .env.local
```

Paste the two generated values in. For local development that's all you
need — leave the GitHub variables empty and content saves to `./data/`.

```bash
ADMIN_PASSWORD_HASH=scrypt:16384:8:1:....
AUTH_SECRET=....
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Paste the values with **no quotes**. The hash uses `:` separators
> specifically so `.env` parsers don't mangle it.

### STEP 6 — Start the dev server

```bash
npm run dev
```

### STEP 7 — Open the public site

http://localhost:3000

### STEP 8 — Open the admin panel

http://localhost:3000/admin — sign in with the password from STEP 4.

### STEP 9 — Make it yours

Work through Admin → Website Settings → Hero → About → Experience →
Projects. See [section 10](#10-where-to-change-what).

### STEP 10 — Verify before deploying

```bash
npm run typecheck   # no TypeScript errors
npm run lint        # no lint errors
npm run build       # production build succeeds
```

---

## 7. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | Yes | scrypt hash of your admin password. From `npm run hash-password`. |
| `AUTH_SECRET` | Yes | Signs session cookies. 32+ characters. Changing it signs you out. |
| `GITHUB_OWNER` | Production | Your GitHub username. |
| `GITHUB_REPO` | Production | This repository's name. |
| `GITHUB_TOKEN` | Production | Fine-grained PAT with **Contents: Read and write** on this repo only. |
| `GITHUB_BRANCH` | No | Defaults to `main`. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URLs, OpenGraph, sitemap. Falls back to `VERCEL_URL`. |

Without the GitHub variables the app reads and writes `./data/` locally —
correct for development, but on Vercel that filesystem is ephemeral, so
**production edits will not persist without them**. The dashboard shows a
warning when they're missing.

---

## 8. Deploying to GitHub + Vercel — step by step

### STEP 1 — Create a GitHub repository

github.com/new → name it → **Create repository**. Don't add a README.

### STEP 2 — Push the code

```bash
git init
git add -A
git commit -m "chore: initialize portfolio platform"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Confirm `.env.local` is **not** in the pushed files (`.gitignore` covers it).

### STEP 3 — Create a GitHub token

github.com/settings/tokens?type=beta → **Generate new token**

- Repository access → **Only select repositories** → this repo
- Permissions → Repository → **Contents: Read and write**
- Nothing else

Copy it now — GitHub shows it once. It's free and needs no payment details.

### STEP 4 — Import into Vercel

vercel.com/new → import the repository. Vercel detects Next.js
automatically; leave the build settings alone.

### STEP 5 — Add environment variables

Before the first deploy, in the import screen (or Settings → Environment
Variables), add all of:

```
ADMIN_PASSWORD_HASH   (from npm run hash-password)
AUTH_SECRET           (from npm run hash-password)
GITHUB_OWNER          your GitHub username
GITHUB_REPO           this repository's name
GITHUB_TOKEN          the token from STEP 3
GITHUB_BRANCH         main
NEXT_PUBLIC_SITE_URL  https://<your-project>.vercel.app
```

Apply to **Production, Preview and Development**.

### STEP 6 — Deploy

Click **Deploy** and wait for the build.

### STEP 7 — Set the real site URL

Once you know the final URL, update `NEXT_PUBLIC_SITE_URL` and redeploy so
canonical URLs and OpenGraph tags are correct.

### STEP 8 — Verify production

- Public site loads
- `/admin` redirects to `/admin/login` when signed out
- Sign in works
- Edit something, save, and confirm a new commit appears in the repo
- The change shows on the public site within seconds

### STEP 9 — Ongoing deploys

Every push to `main` deploys automatically. **Content edits don't need a
deploy** — they commit to `data/` and appear immediately.

---

## 9. Custom domain

1. Vercel → project → **Settings → Domains → Add**
2. Enter your domain
3. Add the DNS records Vercel shows you at your registrar
   - Apex (`example.com`) → `A` record to Vercel's IP
   - Subdomain (`www`) → `CNAME` to `cname.vercel-dns.com`
4. Wait for verification (minutes to a few hours); HTTPS is automatic
5. Update `NEXT_PUBLIC_SITE_URL` to the new domain and redeploy

---

## 10. WHERE TO CHANGE WHAT

**Almost everything is in the admin panel — you should rarely edit code.**

| I want to change… | Go to |
|---|---|
| My name, titles, intro, hero buttons, portrait | Admin → **Hero** |
| My bio, stats, highlights | Admin → **About** |
| Skills, proficiency levels | Admin → **Skills** |
| Skill category chips | Admin → **Skill Categories** |
| Jobs, responsibilities, technologies | Admin → **Experience** |
| Add / edit a project or case study | Admin → **Projects** |
| Degrees, CGPA | Admin → **Education** |
| Certificates, credential links | Admin → **Certifications** |
| Services offered | Admin → **Services** |
| Testimonials | Admin → **Testimonials** |
| LinkedIn / GitHub / Instagram / YouTube links | Admin → **Social Links** |
| Upload a new résumé, rename the button | Admin → **Résumé** |
| Contact heading, form on/off, success message | Admin → **Contact Section** |
| Email, phone, location, availability | Admin → **Website Settings** |
| Footer text, copyright | Admin → **Website Settings** |
| Take the site offline temporarily | Admin → **Website Settings** → Maintenance Mode |
| Menu links and their order | Admin → **Navigation** |
| Page title, meta description, social share image | Admin → **SEO & Analytics** |
| Turn search indexing on/off | Admin → **SEO & Analytics** |
| Add Plausible / Umami / GA4 | Admin → **SEO & Analytics** |
| Accent colour, corner style, animation intensity | Admin → **Appearance** |
| Show, hide or reorder whole sections | Admin → **Sections** |
| Read and reply to enquiries | Admin → **Contact Messages** |
| See what changed recently | Admin → **Activity Log** |

### Things that do need code

| Change | File |
|---|---|
| Brand colours, fonts, spacing, shadows | `src/app/globals.css` (`@theme` block) |
| Add a new content field | `src/lib/schema.ts`, then `src/lib/admin-config.ts` |
| Add a whole new CMS module | Same two files + a section component |
| Change a section's layout | `src/components/site/<section>.tsx` |
| Change storage backend | `src/lib/store.ts` |

### Adding a new field — worked example

To add "Company size" to Experience:

1. `src/lib/schema.ts` → in `experienceSchema`, add
   `companySize: z.string().max(40).default(""),`
2. `src/lib/admin-config.ts` → in the `experience` module's `fields`, add
   `{ key: "companySize", label: "Company size", type: "text" },`
3. Render it in `src/components/site/experience.tsx` wherever you want it

The admin form, validation and storage all update automatically.

---

## 11. Using the admin panel

**Sign in** at `/admin`. Sessions last 8 hours. Failed logins are rate
limited (8 attempts per 15 minutes per IP).

**Editing** — pick a module from the sidebar, make changes, press
**Save changes**. An "Unsaved changes" marker and a sticky save bar appear
while anything is pending. A save writes the whole module at once.

**Collections** (Projects, Skills, …) — each row expands into a form. Use
the ▲▼ arrows to reorder, the eye to show/hide, the bin to delete
(with confirmation). Nothing is permanent until you save.

**Draft vs published** — Projects, Experience, Services and Testimonials
have a status. Only `published` items appear publicly. Use `draft` to work
on something invisibly.

**Uploads** — image and file fields have an Upload button. Accepted: JPEG,
PNG, WebP, AVIF, SVG, GIF, PDF, max 5 MB. Files land in `public/uploads/`
and are committed to the repo.

**Messages** — contact submissions arrive with status `new`. Opening one
marks it read. You can reply (opens your mail client), archive or delete.

**Sections** — this controls the actual composition of the homepage, not
just visibility: the page renders sections in exactly the order listed.

---

## 12. Design system

Defined once in `src/app/globals.css` and consumed everywhere. Never
hard-code a colour in a component.

### Colour (OKLCH, for perceptual consistency)

| Token | Value | Use |
|---|---|---|
| `--color-navy-950` … `-50` | `oklch(13% .06 260)` → light | Dark surfaces, hero, deep sections |
| `--color-gold-400` | `oklch(86% .17 92)` | Primary accent, CTAs, highlights |
| `--color-background` | `oklch(99% .003 240)` | Page background |
| `--color-foreground` | `oklch(18% .06 260)` | Body text |
| `--color-muted-foreground` | `oklch(50% .03 256)` | Secondary text |
| `--color-primary` | `oklch(36% .13 258)` | Buttons, icon tiles |
| `--color-primary-glow` | `oklch(55% .18 256)` | Eyebrows, hover borders |

### Type

- Display / headings — **Sora**, weight 900, `tracking-[-0.03em]`,
  `leading-[1.05]`
- Body — **Inter**, 18px, `leading-relaxed`
- Section headings — `clamp` from 2.25rem to 4rem
- Both fonts self-hosted by Next at build time — no render-blocking request

### Spacing & shape

- Container: `max-w-7xl`, `px-6`
- Section rhythm: `section-y` = 5rem mobile / 8rem desktop
- Radii: cards `rounded-3xl`, controls `rounded-xl`, pills `rounded-full`
- Shadows: `--shadow-card`, `--shadow-lift`, `--shadow-gold`, `--shadow-elegant`

### Motion

One vocabulary in `src/components/site/motion.tsx`: `Reveal`,
`RevealGroup`/`RevealItem`, `Entrance`. Easing is always
`cubic-bezier(0.22, 1, 0.36, 1)`. Durations 0.4–0.75s.

Every animation is disabled under `prefers-reduced-motion` — content renders
immediately with no transform, never hidden.

---

## 13. Security

- **Passwords** — scrypt (N=16384, r=8, p=1, 64-byte key, 16-byte random
  salt). Verified with `timingSafeEqual`, so timing can't leak the answer.
  There is no `password === "..."` anywhere in this codebase.
- **Sessions** — HS256 JWT via `jose`, in an `httpOnly`, `secure`,
  `sameSite=lax` cookie. Unreadable from JavaScript, not replayable
  cross-site, expires after 8 hours.
- **Route protection** — `middleware.ts` gates `/admin/*` at the edge, and
  every admin API route independently calls `requireAdmin()`. Protection
  never depends on the client or on middleware alone.
- **Input validation** — every write is parsed with Zod server-side. The
  client's checks exist only for fast feedback.
- **Rate limiting** — logins (8 / 15 min / IP) and contact submissions
  (4 / 10 min / IP).
- **Spam** — hidden honeypot field. A bot that fills it gets a normal
  success response and nothing is stored, so it never learns it was caught.
- **Uploads** — MIME allow-list, extension must match the declared type,
  5 MB cap, filenames sanitised and timestamped.
- **Secrets** — only ever in environment variables, never in code, never
  sent to the browser. `.env.local` is gitignored; `.env.example` is not.
- **Admin is `noindex`** in both `robots.ts` and the admin layout metadata.

### Rotating secrets

```bash
npm run hash-password          # new hash + secret
```
Update both in Vercel → Settings → Environment Variables → Redeploy.
Rotate `GITHUB_TOKEN` by revoking the old one on GitHub and adding a new one.

---

## 14. Accessibility

- Semantic HTML: real `<header>`, `<nav>`, `<main>`, `<section>`, `<ol>`,
  `<figure>`, `<dl>`
- Single `<h1>`, ordered heading levels
- Skip-to-content link
- Visible focus rings on every interactive element (gold, 2px, offset)
- Mobile menu: focus trap, Escape to close, scroll lock, `aria-expanded`
  and `aria-controls`
- All form fields labelled, errors linked via `aria-describedby`,
  `aria-invalid` on failure
- Icons `aria-hidden`; icon-only buttons have `aria-label`
- Proficiency meters expose their value as text and via `aria-label`, not
  colour or width alone
- Toasts announce via `role="status"` / `aria-live="polite"`
- Full `prefers-reduced-motion` support

---

## 15. SEO

- Per-page `<title>` and meta description, driven by CMS content
- OpenGraph and Twitter cards, including per-project images
- Canonical URLs from `NEXT_PUBLIC_SITE_URL` — the domain is never
  hard-coded anywhere
- `sitemap.xml` generated from live content, so new projects appear
  automatically
- `robots.txt` honours the admin's indexing toggle and always blocks
  `/admin` and `/api`
- JSON-LD `Person` structured data with job title, location, skills and
  verified profile links
- Each project is a real indexable route, not a modal
- Analytics (Plausible / Umami / GA4) configured from the admin — no
  hard-coded IDs

---

## 16. Performance

- Server components by default; client JS only where there's interaction
  (nav, filters, forms, admin)
- Static generation for the homepage and every project page, with
  incremental revalidation (60s / 1h)
- `next/font` self-hosts Inter and Sora — no external font request
- `next/image` for responsive, modern-format images with correct `sizes`
- The hero canvas caps device pixel ratio at 2, scales particle count to
  viewport, pauses when scrolled out of view, and is skipped entirely under
  reduced motion
- In-memory cache in front of the GitHub API (10s TTL)
- No UI kit, no state library, no ORM

---

## 17. Legacy website feature migration

The previous portfolio was reviewed feature by feature. Its **content** was
migrated; its **code** was not reused, and the old project remains untouched
and independently deployed.

| Legacy feature | What it did | Migrated? | Where it lives now |
|---|---|---|---|
| Résumé content | Hardcoded in `content-schema.js` | ✅ Yes | `src/lib/defaults.ts`, editable in Admin |
| Experience (Deloitte) | Single role with responsibilities | ✅ Yes | Admin → Experience |
| Education (B.Tech, CGPA 8.84) | Static block | ✅ Yes | Admin → Education |
| 8 certifications | Static cards | ✅ Yes | Admin → Certifications, with credential IDs and verification URLs |
| Skills by category | 9 static groups | ✅ Improved | Admin → Skills + Skill Categories, now with proficiency, years and filtering |
| Projects | Static cards, no detail view | ✅ Improved | Full case-study pages with their own routes and SEO |
| Social links | Hardcoded array | ✅ Improved | Admin → Social Links, reorderable, hero/footer control |
| Admin panel | Password compared server-side, per-tab save | ✅ Rebuilt | Real hashed auth + JWT sessions, 20 modules, validation, uploads, audit log |
| GitHub-as-database | JSON via Contents API | ✅ Kept | `src/lib/store.ts` — same idea, typed and validated |
| Feedback & ratings | Public star ratings + testimonial wall | ⚠️ Partial | Testimonials exist as an admin-curated module; public self-submission was **not** carried over — it invites spam on a personal site. Add it by extending `/api/contact`. |
| Page-view counter | Commit per view | ❌ Deliberately dropped | It created a commit per page view, flooding history. Use the analytics integration instead. |
| Social analytics (YouTube/GitHub counts) | Live API + manual fallback | ❌ Not migrated | Needs an API key and adds a failure mode; the About stats cover the same ground |
| AI assistants (Romeo / Juliet / Bittu) | Gemini chat, image generation | ❌ Not migrated | Out of scope for this brief, which specified a portfolio platform. The architecture supports adding it as a route + section. |
| 3D icon system | Hand-built SVG badge cards | ➖ Replaced | Consistent lucide + brand SVG system instead |
| Animated cursor | Custom cursor follower | ➖ Replaced | Deliberately dropped — it hurts usability and does nothing on touch |

**Bugs and weaknesses deliberately not carried over:** the `$`-delimited
secret format (mangled by `.env` parsers), unvalidated writes, per-view
commits, and content stored as raw HTML strings (now plain text, so it can't
inject markup).

---

## 18. Maintenance

### Update dependencies

```bash
npm outdated
npm update              # minor + patch
npm install next@latest react@latest react-dom@latest   # majors, deliberately
npm run typecheck && npm run lint && npm run build
```

### Back up content

Everything is already versioned in git. For a point-in-time copy:

```bash
cp -r data data-backup-$(date +%Y-%m-%d)
```

Or download `data/*.json` from GitHub. To restore, replace the files and
commit — or revert the commit in GitHub's UI.

### Add a new CMS module

1. Add the schema to `src/lib/schema.ts` and include it in `contentSchema`
2. Add a default value to `src/lib/defaults.ts`
3. Add a `ModuleConfig` to `src/lib/admin-config.ts`
4. Build the public section component and register it in `src/app/page.tsx`
5. Add its key to `SECTION_KEYS` if it's a page section

No new admin page is needed — `/admin/[module]` picks it up automatically.

### Verification before any deploy

```bash
npm run typecheck
npm run lint
npm run check-defaults
npm run build
```

---

## 19. Troubleshooting

**"Incorrect password" with the right password**
`ADMIN_PASSWORD_HASH` is wrong or was mangled. Regenerate with
`npm run hash-password`, paste with no quotes, restart the dev server.

**`AUTH_SECRET is missing or too short`**
It needs 32+ characters. `npm run hash-password` generates a valid one.

**Admin saves fail in production**
Check `GITHUB_TOKEN`, `GITHUB_OWNER` and `GITHUB_REPO`. The token needs
**Contents: Read and write** on that exact repository, and must not be
expired. The dashboard warns when these are missing.

**Edits don't persist on Vercel**
The GitHub variables aren't set, so it's writing to Vercel's ephemeral
filesystem. Add them and redeploy.

**Content edits don't appear on the live site**
Saves call `revalidatePath`, so they should be immediate. Hard-refresh; if
it persists, redeploy.

**Build fails on `generateStaticParams`**
A project has a malformed `slug`. Slugs must be lowercase letters, numbers
and dashes.

**Images don't load**
Local uploads must start with `/uploads/`. External images need their domain
added to `images.remotePatterns` in `next.config.ts`.

**Locked out by rate limiting**
Wait 15 minutes, or redeploy — the counter is in memory.

---

## 20. Useful links

| Resource | URL |
|---|---|
| GitHub repository | `https://github.com/<owner>/<repo>` |
| Production website | `<set after deployment>` |
| Admin portal | `<production-url>/admin` |
| Vercel dashboard | https://vercel.com/dashboard |
| GitHub token settings | https://github.com/settings/tokens?type=beta |
| Next.js docs | https://nextjs.org/docs |
| Tailwind v4 docs | https://tailwindcss.com/docs |

Fill in the placeholders once deployed.

---

## 21. Known limitations

- **Single admin user.** One password, no roles. Multi-user would need a
  real user store.
- **Write throughput.** Each save is a GitHub API commit (~1s). Fine for a
  portfolio; not for high-frequency writes.
- **Uploads live in the repo.** Simple and free, but a very large media
  library would bloat it. Swap `saveMedia()` in `store.ts` for object
  storage if that ever happens.
- **Rate limiting is per-instance.** In-memory, so it resets on deploy and
  isn't shared across serverless instances. Adequate for this threat model;
  use a shared store for stricter guarantees.
- **No public testimonial submission.** Admin-curated only — see
  [section 17](#17-legacy-website-feature-migration).
- **Appearance tokens are declared but not yet fully wired.** The admin
  screen saves the values; applying every one of them across the CSS layer
  is a follow-up. The design system is built to support it.
- **Skill proficiency levels are editorial estimates** carried over as
  sensible defaults — review them in Admin → Skills.

---

## 22. License & credits

**Content** — all text, images, résumé and project descriptions are
© Peyyala Manideep. Not licensed for reuse.

**Code** — the application code is yours to reuse and adapt.

**Credits**
- [Next.js](https://nextjs.org/), [React](https://react.dev/),
  [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) — animation
- [Lucide](https://lucide.dev/) — icons
- [Zod](https://zod.dev/) — validation · [jose](https://github.com/panva/jose) — JWT
- Fonts: [Sora](https://fonts.google.com/specimen/Sora),
  [Inter](https://fonts.google.com/specimen/Inter)
- Hosting: [Vercel](https://vercel.com/) · Storage: GitHub Contents API

Visual direction developed from a navy-and-gold academic reference design;
all implementation here is original.
