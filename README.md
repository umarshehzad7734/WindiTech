# Windii Technologies — Corporate Website

The public website for **Windii Technologies**, an information technology and
software services firm at 7 Bridge Colony, Lahore, Punjab, Pakistan.

The site doubles as supporting evidence for **Dun & Bradstreet D-U-N-S
registration**, so the company name, address, phone number and email must stay
consistent everywhere they appear. See [Business details](#business-details).

Built with Next.js (App Router) + TypeScript, Tailwind CSS v4, Framer Motion and
lucide-react.

---

## Contents

- [Quick start](#quick-start)
- [Business details](#business-details)
- [Editing site content](#editing-site-content)
- [Environment variables](#environment-variables)
- [Configuring the contact form email](#configuring-the-contact-form-email)
- [Project structure](#project-structure)
- [Deploying to Vercel](#deploying-to-vercel)
- [Deploying to cPanel / shared hosting (GoDaddy)](#deploying-to-cpanel--shared-hosting-godaddy)
- [Brand assets](#brand-assets)
- [Accessibility and performance](#accessibility-and-performance)
- [Before you go live](#before-you-go-live)

---

## Quick start

Requires Node.js 20.9 or newer (Node 22 recommended).

```bash
npm install
cp .env.example .env.local   # then fill in your mail settings
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (Node/Vercel — `/api/contact` works) |
| `npm run build:static` | Static export to `out/` for Apache/cPanel — see [`DEPLOY-CPANEL.md`](./DEPLOY-CPANEL.md) |
| `npm run start` | Serve the production build (run `build` first) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

`npm run build`, `npm run lint` and `npm run typecheck` all currently pass with
zero errors and zero warnings. Keep it that way.

---

## Business details

These values appear in the header, footer, contact page, page metadata and the
JSON-LD structured data. They are defined **once**, in
`src/content/site.ts`, and must match the Partnership Registration Certificate
(Form-C), the NTN record and the D&B Company Information Template exactly.

| Field | Value |
|---|---|
| Legal / trading name | Windii Technologies |
| Sector | Information Technology & Software Services |
| Registered address | 7 Bridge Colony, Lahore, Punjab, Pakistan |
| Business email | info@windiitechnologies.com |
| Business phone | +92 334 9703013 |
| Domain | windiitechnologies.com |
| Geographic scope | Pakistan, serving clients internationally |

**Do not** edit these strings in components. Change them in
`src/content/site.ts` and they update everywhere at once, including the
structured data — which is the whole point, because inconsistent details are a
common reason a D-U-N-S application stalls.

---

## Editing site content

Every piece of editable text on the site lives in **`src/content/site.ts`**. You
should not need to open a component to change copy.

The file is organised by area:

| Export | Controls |
|---|---|
| `business` | Name, address, phone, email, domain, sector, business hours, LinkedIn |
| `navigation`, `legalNavigation` | Header and footer menus |
| `seo` | Default title, meta description, keywords |
| `home` | Every section of the home page |
| `processSteps` | The four "how we work" steps |
| `services` | The nine service entries (title, icon, summary, description, bullets) |
| `servicesPage`, `about`, `products`, `contact` | Those pages' copy |
| `footer` | Footer tagline, column titles, copyright line |
| `privacy`, `terms`, `legalLastUpdated` | Legal pages |
| `notFound` | The 404 page |

Notes:

- **Adding a service.** Append an entry to the `services` array. It appears
  automatically on the home page grid, the services page, the jump list and the
  footer. The `icon` value is a key mapped to a lucide-react icon in
  `src/components/ServiceIcon.tsx` — add a new key there if you need one that
  is not already listed.
- **Placeholders.** Anything still to be confirmed is marked `TODO(windii)` in
  the file and listed in [`TODO.md`](./TODO.md).
- **LinkedIn.** Set `business.linkedin` and it is automatically added to the
  `sameAs` array in the structured data. While it is empty, `sameAs` is omitted
  so the schema stays valid.

---

## Environment variables

All variables are documented in [`.env.example`](./.env.example). Copy it to
`.env.local` for development and set the same values in your host's environment
settings for production.

| Variable | Required | Purpose |
|---|---|---|
| `MAIL_TRANSPORT` | No | Force `resend` or `smtp`. Auto-detected when unset. |
| `RESEND_API_KEY` | For Resend | Resend API key. |
| `SMTP_HOST` | For SMTP | Outgoing mail server. |
| `SMTP_PORT` | No | Defaults to `587`. |
| `SMTP_SECURE` | No | Inferred from the port (`true` for 465). |
| `SMTP_USER` / `SMTP_PASSWORD` | For SMTP | Mailbox credentials. |
| `CONTACT_TO_EMAIL` | No | Where enquiries go. Defaults to `info@windiitechnologies.com`. |
| `CONTACT_FROM_EMAIL` | No | The From address. Must be on an authorised sending domain. |
| `NEXT_PUBLIC_SITE_URL` | No | Overrides the canonical origin. **Preview deployments only** — leave unset in production. |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | No | Where the form posts. Defaults to `/api/contact`; `build:static` sets it to `/contact.php`. |

---

## Configuring the contact form email

The form posts to `POST /api/contact`, which validates the submission (zod,
same schema as the browser uses), applies a honeypot and rate limit, then sends
the enquiry to `info@windiitechnologies.com` with the sender's address set as
`Reply-To` — so you can reply to an enquiry directly from your inbox.

Two transports are implemented; **configure one**.

### Option A — Resend (recommended, works on serverless hosts)

1. Sign up at [resend.com](https://resend.com) and add `windiitechnologies.com`
   as a sending domain.
2. Add the DNS records Resend gives you (see [`DNS-AND-EMAIL.md`](./DNS-AND-EMAIL.md))
   and wait for the domain to verify.
3. Create an API key and set:

   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   CONTACT_FROM_EMAIL="Windii Technologies <no-reply@windiitechnologies.com>"
   ```

### Option B — SMTP via Nodemailer (recommended on cPanel)

Use the outgoing mail settings for the `info@windiitechnologies.com` mailbox
from your hosting control panel:

```
SMTP_HOST=mail.windiitechnologies.com
SMTP_PORT=465
SMTP_USER=info@windiitechnologies.com
SMTP_PASSWORD=your-mailbox-password
CONTACT_FROM_EMAIL="Windii Technologies <info@windiitechnologies.com>"
```

Port 465 uses implicit TLS; 587 uses STARTTLS. If your host blocks both, use
Resend instead.

### If neither is configured

The API returns HTTP 502 and the form shows a visible error telling the visitor
to email you directly. It never fails silently. The underlying reason is logged
server-side only — transport details are never sent to the browser.

### Spam protection

- A hidden honeypot field. If a bot fills it the API returns `200 OK` and
  discards the message, so the bot cannot learn which field is the trap.
- A fixed-window rate limit of 5 submissions per IP per 10 minutes, returning
  `429` with a `Retry-After` header.

The rate limiter is in-process (`src/lib/rate-limit.ts`). It does not survive a
restart and is not shared between instances — fine for a single-instance
marketing site. If you scale to multiple instances, swap in a shared store
(Redis/Upstash) behind the same interface.

---

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx              Root layout, metadata, Organization + WebSite JSON-LD
│  ├─ page.tsx                Home
│  ├─ about|services|products|contact|privacy|terms/page.tsx
│  ├─ api/contact/route.ts    Contact form endpoint
│  ├─ sitemap.ts              /sitemap.xml
│  ├─ robots.ts               /robots.txt
│  ├─ manifest.ts             /manifest.webmanifest
│  ├─ opengraph-image.tsx     Generated 1200×630 OG image
│  ├─ twitter-image.tsx       Re-exports the OG image
│  ├─ not-found.tsx           404
│  └─ globals.css             Design tokens, base styles, theming
├─ components/
│  ├─ ui/                     Container, Section, Button, Card, SectionHeading,
│  │                          PageHeader, Reveal
│  ├─ layout/                 Header, Footer, ThemeToggle, ThemeScript
│  ├─ contact/                ContactForm, MapEmbed
│  ├─ Logo.tsx, ServiceIcon.tsx, JsonLd.tsx, LegalPage.tsx
├─ content/site.ts            ← all editable copy and business data
└─ lib/
   ├─ schema.ts               JSON-LD builders
   ├─ validation.ts           Shared zod schema
   ├─ mailer.ts               Resend + Nodemailer transports
   ├─ rate-limit.ts           In-memory rate limiter
   └─ utils.ts
```

Pages are React Server Components. Only `Header`, `ThemeToggle`, `Reveal`,
`ContactForm` and `MapEmbed` are client components, which keeps the JavaScript
sent to the browser small.

### Design system

Colour, typography, spacing and motion tokens are defined in
`src/app/globals.css` under `@theme`. Semantic tokens (`canvas`, `surface`,
`fg`, `accent`, `line`, …) are re-pointed per theme, so components never
hardcode a colour — the entire palette can be changed from that one file.

**Colour.** The brand is green on black, and the site follows that: black
carries the page, with layered near-blacks (`#000000` canvas, `#080a0b` bands,
`#0e1112` cards) providing depth, and the logo green (`#00E38C`, `brand-400`)
reserved for emphasis — primary actions, active navigation, icons, rules and
hover feedback. **Dark is the default theme.** A light theme is available from
the header toggle and uses the darker end of the brand ramp (`brand-700`) so
the green still passes AA on white. The choice is stored in `localStorage`
under `windii-theme` and applied before first paint by an inline script, so
there is no flash of the wrong theme.

**Motion.** One scale, shared by everything: `--dur-fast` (150ms) for presses,
`--dur-base` (220ms) for hover feedback, `--dur-slow` (380ms) for larger
transitions, all on `--ease-out-soft`. Interaction states are pure CSS. Scroll
entrances use `Reveal` / `RevealGroup` / `RevealItem` (`src/components/ui/Reveal.tsx`)
— a 14px rise and a fade, once, with an optional 70ms stagger for grids. There
is no scaling, rotation, parallax or spring anywhere, and every animation is
skipped entirely under `prefers-reduced-motion`.

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project**, import the repository. Framework preset is
   detected as Next.js; leave the build settings alone.
3. Under **Settings → Environment Variables**, add `RESEND_API_KEY`,
   `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` for the Production environment.
   Do **not** set `NEXT_PUBLIC_SITE_URL`.
4. Deploy.
5. Under **Settings → Domains**, add `windiitechnologies.com` and
   `www.windiitechnologies.com`, and set one as primary with the other
   redirecting to it. Add the DNS records Vercel shows you at your registrar.
6. Once the domain is live, confirm `https://windiitechnologies.com/sitemap.xml`
   and `/robots.txt` resolve, then submit the sitemap in Google Search Console.

---

## Deploying to cPanel / shared hosting (GoDaddy)

The site can be exported to plain HTML and served by any Apache host — no Node.js
on the server. The contact form is handled by a single PHP file.

```bash
npm run build:static
```

That produces `out/`, containing the whole site plus `contact.php`,
`contact-config.example.php` and `.htaccess`. Upload the contents of `out/` to
`public_html`.

**Full walkthrough, including what to do about the existing WordPress install at
the domain root: [`DEPLOY-CPANEL.md`](./DEPLOY-CPANEL.md).**

How it works:

- `next.config.ts` switches to `output: "export"` only when `STATIC_EXPORT=true`,
  so the normal Node build and `/api/contact` are unaffected.
- `scripts/build-static.mjs` moves `src/app/api` aside for the build (a static
  export cannot contain route handlers), restores it afterwards, and copies the
  files from `php/` into `out/`.
- The form's endpoint comes from `NEXT_PUBLIC_CONTACT_ENDPOINT`, which the
  static build sets to `/contact.php`. It defaults to `/api/contact` otherwise.
- `php/contact.php` mirrors the Node API exactly: the same validation rules,
  honeypot handling, rate limit and JSON responses.

Both targets were verified against a real Apache 2.4 server and a real PHP 8.4
server — see the last section of `DEPLOY-CPANEL.md` for what was tested.

---


## Brand assets

| File | Used for |
|---|---|
| `public/logo.svg` | Full lockup; referenced as `logo` in the JSON-LD |
| `public/icon.svg` | Favicon (modern browsers) |
| `public/favicon-32.png` | Favicon fallback |
| `public/apple-touch-icon.png` | iOS home screen (180×180) |
| `public/icon-192.png`, `public/icon-512.png` | Web app manifest |
| `src/app/opengraph-image.tsx` | Generated 1200×630 social preview |

The wave mark is also drawn inline as a React component in
`src/components/Logo.tsx`, so it inherits the current text colour.

> **These are a faithful reconstruction of the Windii Tech logo, not the
> original artwork.** Replace them with the official files when you have the
> vector source — see `TODO.md`. The PNGs were generated from `public/icon.svg`;
> regenerate them with any SVG-to-PNG tool at 192, 512, 180 and 32 pixels.

---

## Accessibility and performance

Built to WCAG 2.1 AA:

- Semantic landmarks, one `<h1>` per page, no skipped heading levels
- A skip-to-content link, visible focus rings throughout
- The mobile menu is a labelled dialog with focus trapping, `Escape` to close
  and scroll locking
- Form fields have real `<label>` elements, `aria-invalid` and `aria-describedby`
  on errors, and an `aria-live` alert so failures are announced
- Text meets AA contrast in both themes
- `prefers-reduced-motion` is respected — all scroll and hover animation is
  disabled, and reveal animations render as plain elements

Performance:

- Server Components everywhere except the five interactive components
- No layout shift: the map area reserves its space in both states
- The map is an OpenStreetMap embed that is only inserted **after** the visitor
  clicks "Load map", so no third-party request is made on page load
- Fonts are self-hosted via `next/font` with `display: swap`

Verified at 320px, 768px, 1280px and 1920px in both themes, with no horizontal
overflow and no console errors.

---

## Before you go live

1. Work through [`TODO.md`](./TODO.md) — every placeholder is listed there.
2. Set up the domain email and DNS records per
   [`DNS-AND-EMAIL.md`](./DNS-AND-EMAIL.md), then send a real test enquiry
   through the live form and confirm it arrives and is not marked as spam.
3. **Have the Privacy Policy and Terms of Use reviewed by a qualified lawyer
   before relying on them.** They are written to be honest and conventional, but
   they are not legal advice and have not been reviewed by a professional.
4. Re-read every page against the Form-C, NTN and D&B Company Information
   Template and confirm the name, address and contact details match exactly.
