# Deployment Guide — start to finish

Follow this top to bottom. It takes about 10 minutes. Nothing here costs
money or asks for a card.

**Status:** ✅ Deployed and verified.

| | |
|---|---|
| **Live site** | https://manideep-portfolio-platform.vercel.app |
| **Admin portal** | https://manideep-portfolio-platform.vercel.app/admin |
| **Repository** | https://github.com/manideeppeyyala/manideep-portfolio-platform |

Deployed on 3 September 2026. Public site, admin auth and the
admin → GitHub save loop were all verified against production.

---

## Before you start

Your project now lives at:

```
/Users/peyyalamanideep/dev/manideep-portfolio-pro
```

**It moved from `~/Desktop` on purpose — do not move it back.** See
[Why the project moved](#appendix--why-the-project-moved) at the end.

---

# PART 1 — Run it locally (already working)

### STEP 1 — Open Terminal and go to the project

```bash
cd ~/dev/manideep-portfolio-pro
```

### STEP 2 — Start the site

```bash
npm run dev
```

Wait for `✓ Ready`.

### STEP 3 — Open it

- Website → http://localhost:3000
- Admin → http://localhost:3000/admin

### STEP 4 — Sign in to the admin

Password: whatever you chose when running `npm run hash-password`.

### STEP 5 — Stop the server when done

Press `Ctrl + C` in the Terminal window.

---

# PART 2 — Create your GitHub token

This is what lets the admin panel save your edits once the site is online.
Free, no card, takes 2 minutes.

### STEP 6 — Open the token page

https://github.com/settings/tokens?type=beta

### STEP 7 — Start a new token

Click **Generate new token**. (If asked to sign in, do that first.)

### STEP 8 — Name it

Token name: `portfolio-cms`

### STEP 9 — Set expiration

Choose **1 year** (or "No expiration" if you'd rather not redo this).

### STEP 10 — Limit it to this one repository

Under **Repository access**:

1. Select **Only select repositories**
2. In the dropdown, choose **manideep-portfolio-platform**

### STEP 11 — Give it write access to files

1. Click **Permissions** → **Repository permissions**
2. Scroll to **Contents**
3. Change the dropdown from *No access* to **Read and write**

Leave every other permission alone.

### STEP 12 — Generate and copy

Click **Generate token**, then **copy the token immediately**.

It starts with `github_pat_...`. GitHub shows it **once** — if you lose it,
delete it and make a new one.

> Paste it somewhere temporary (Notes) until Step 18.

---

# PART 3 — Deploy on Vercel

### STEP 13 — Open Vercel

https://vercel.com/new

Sign in with **Continue with GitHub** if you aren't already.

### STEP 14 — Find your repository

In the "Import Git Repository" list, find **manideep-portfolio-platform**
and click **Import**.

If it isn't listed: click **Adjust GitHub App Permissions**, grant Vercel
access to that repository, then come back.

### STEP 15 — Leave build settings alone

Vercel detects Next.js automatically. Do not change Framework, Build
Command, Output Directory or Install Command.

### STEP 16 — Open the Environment Variables section

Click to expand **Environment Variables**.

### STEP 17 — Add the first five variables

Add each one as a separate Name/Value pair. **No quotes around values.**

| Name | Value |
|---|---|
| `ADMIN_PASSWORD_HASH` | the `scrypt:...` line from `npm run hash-password` |
| `AUTH_SECRET` | the `AUTH_SECRET=` line from the same command |
| `GITHUB_OWNER` | `manideeppeyyala` |
| `GITHUB_REPO` | `manideep-portfolio-platform` |
| `GITHUB_BRANCH` | `main` |

> `ADMIN_PASSWORD_HASH` is one long line — make sure you copy all of it.
>
> **Secrets are deliberately not written down in this repository.** It's
> public, so the hash and secret live only in Vercel's environment
> variables, and the password only in your head / password manager.
> Regenerate both any time with `npm run hash-password`.

### STEP 18 — Add the sixth variable (your token)

| Name | Value |
|---|---|
| `GITHUB_TOKEN` | the `github_pat_...` token you copied in Step 12 |

### STEP 19 — Deploy

Click **Deploy** and wait 1–3 minutes.

### STEP 20 — Get your link

When it finishes, Vercel shows your live URL, something like:

```
https://manideep-portfolio-platform.vercel.app
```

**That's your website link.** Click **Continue to Dashboard** to see it any
time.

---

# PART 4 — Finish the setup

### STEP 21 — Tell the site its own address

1. Vercel → your project → **Settings** → **Environment Variables**
2. Add one more:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | your live URL from Step 20 (no trailing slash) |

This is used for SEO tags, social previews and `sitemap.xml`.

### STEP 22 — Redeploy so it takes effect

1. Go to the **Deployments** tab
2. Click the **⋯** menu on the newest deployment
3. Click **Redeploy** → confirm

> Environment variables only apply to *new* deployments. This step matters.

---

# PART 5 — Check everything works

### STEP 23 — Public site

Open your URL. You should see the hero with your name, and the gold
constellation lines following your mouse.

### STEP 24 — Admin is protected

Open `<your-url>/admin` in a **private/incognito** window.
It must redirect you to a sign-in page. If it shows the dashboard without
asking, stop and re-check `AUTH_SECRET`.

### STEP 25 — Admin sign-in

Sign in with the password you chose when generating the hash.

### STEP 26 — The important test: does saving work?

1. Go to **Hero**
2. Change the **Intro paragraph** slightly
3. Click **Save changes**
4. You should see a green "saved" message

### STEP 27 — Confirm it saved for real

1. Open https://github.com/manideeppeyyala/manideep-portfolio-platform/commits/main
2. There should be a brand-new commit like `content: update hero`
3. Reload your public site — the change should be visible

**If Step 26 fails**, `GITHUB_TOKEN` is wrong or lacks *Contents: Read and
write*. Redo Steps 6–12 and update the variable in Vercel, then redeploy.

### STEP 28 — Contact form

Send yourself a test message from the contact section, then check
**Admin → Contact Messages**.

---

# PART 6 — Day-to-day use

### Changing your website content

Go to `<your-url>/admin`, edit, save. Changes are live in seconds.
**You never need to redeploy for content changes.**

### Changing the code

```bash
cd ~/dev/manideep-portfolio-pro
# make your edits
git add -A
git commit -m "describe what you changed"
git push
```

Vercel rebuilds and deploys automatically.

### Changing your admin password

```bash
cd ~/dev/manideep-portfolio-pro
npm run hash-password
```

Copy the two new values into Vercel → Settings → Environment Variables
(replacing the old ones), then redeploy.

### Adding a custom domain

1. Vercel → project → **Settings** → **Domains** → **Add**
2. Enter your domain
3. Add the DNS records Vercel gives you at your registrar
4. Update `NEXT_PUBLIC_SITE_URL` to the new domain and redeploy

---

# Troubleshooting

**"Incorrect password" on admin sign-in**
`ADMIN_PASSWORD_HASH` was truncated or has quotes around it. Re-paste the
full value, redeploy.

**Admin saves fail**
`GITHUB_TOKEN` is missing, expired, or lacks *Contents: Read and write* on
the correct repository.

**Edits vanish after a while**
The GitHub variables aren't set, so it's writing to Vercel's temporary
storage. Add all four `GITHUB_*` variables and redeploy.

**Build fails on Vercel**
Open the build log in Vercel. If it mentions a project slug, one of your
projects has an invalid URL slug (lowercase letters, numbers and dashes
only).

**Localhost won't start**
```bash
cd ~/dev/manideep-portfolio-pro
rm -rf .next
npm install
npm run dev
```

---

# Appendix — Why the project moved

The project used to live in `~/Desktop`, which is synced to iCloud. With
the disk at 93% full, macOS was **evicting files to iCloud** to save space —
including files inside `node_modules`.

Every time the build tried to read one of those files, macOS had to
download it back from iCloud first. Reads that should take milliseconds
took ~2.3 seconds, and the build eventually failed with
`Operation timed out (os error 60)`.

Moving to `~/dev` (not synced) fixed it completely:

| | On `~/Desktop` | On `~/dev` |
|---|---|---|
| `npm install` | ~4 minutes | **3.7 seconds** |
| `npm run build` | hung, then failed | **7 seconds** |
| Dev server | never responded | **0.46s** |

**Keep code projects out of Desktop, Documents and anywhere iCloud syncs.**

It's also worth freeing disk space — 16 GB free of 228 GB is what triggered
the eviction in the first place.
