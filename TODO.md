# TODO — placeholders to confirm before launch

Every placeholder left in the project, and where to change it. Nothing here was
invented as fact: where a detail was unknown it was left blank or described
honestly rather than guessed.

Items are grouped by how much they matter for the D-U-N-S application.

---

## 1. Blocking — needed for D&B / D-U-N-S

### 1.1 Verify the business details match your registration documents

**File:** `src/content/site.ts` → `business`

Check every value below character-for-character against the Partnership
Registration Certificate (Form-C), the NTN record and the D&B Company
Information Template. If any of them differ, change them here — not in the
components — and they update site-wide, including the structured data.

| Field | Currently |
|---|---|
| Name | Windii Technologies |
| Sector | Information Technology & Software Services |
| Address | 7 Bridge Colony, Lahore, Punjab, Pakistan |
| Email | info@windiitechnologies.com |
| Phone | +92 334 9703013 |
| Domain | windiitechnologies.com |

### 1.2 Set up the domain email

`info@windiitechnologies.com` must be a working mailbox before you submit the
application — a free address (Gmail/Yahoo) will count against you.

Follow [`DNS-AND-EMAIL.md`](./DNS-AND-EMAIL.md), then send a test enquiry
through the live form and confirm it arrives.

### 1.3 Add the LinkedIn company page

**File:** `src/content/site.ts` → `business.linkedin` (currently `""`)

D&B likes to see a matching professional profile. Create the LinkedIn company
page using **exactly** the same name, address and business description as the
site, then paste the URL here:

```ts
linkedin: "https://www.linkedin.com/company/your-page",
```

It is automatically added to the `sameAs` array in the JSON-LD. While it is
empty, `sameAs` is omitted so the schema stays valid — nothing breaks if you
launch without it, but add it as soon as the page exists.

### 1.4 Deploy to the official domain

The site must be live at `https://windiitechnologies.com`. See the deployment
sections of [`README.md`](./README.md).

---

## 2. Content placeholders

### 2.1 Business hours

**File:** `src/content/site.ts` → `business.businessHours`
**Currently:** `"Monday to Friday, 9:00 AM – 6:00 PM (PKT, UTC+5)"`

A reasonable default, shown on the Contact page. Change it if your actual hours
differ.

### 2.2 Product name and positioning

**File:** `src/content/site.ts` → `products.flagship`

The transportation/fleet SaaS platform is described at capability level and
marked **"In development — available on request"**. It is deliberately *not*
presented as a shipping commercial product.

Confirm:

- `name` — currently the generic *"SaaS platform for transportation and fleet
  operations"*. Replace with the real product name once decided.
- `status` — change only when it genuinely ships. Until then, leave it.
- `capabilities` — the six listed (booking & dispatch, fleet management, driver
  management, route & trip tracking, reporting dashboards, integrations) should
  be checked against what the platform will actually do.

### 2.3 Map coordinates

**File:** `src/content/site.ts` → `mapLocation`
**Currently:** `31.5497, 74.3436`

Centres on the Bridge Colony area of Lahore — close, but not surveyed. To get
the exact pin: open [openstreetmap.org](https://www.openstreetmap.org), find the
building, right-click → *Show address*, and copy the latitude and longitude.

These coordinates also appear in the `LocalBusiness` structured data on the
Contact page.

---

## 3. Legal review

**Files:** `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`
(content in `src/content/site.ts` → `privacy`, `terms`)

**Have both pages reviewed by a qualified lawyer before relying on them.** They
are written to be honest and conventional and to describe what this site
actually does, but they are not legal advice and have not been professionally
reviewed.

Also update `legalLastUpdated` in `src/content/site.ts` whenever you change
either page. It currently reads `"4 September 2026"`.

---

## 4. Brand assets — send me the real logo file

**Files:** `public/logo.svg`, `public/icon.svg`, `public/icon-192.png`,
`public/icon-512.png`, `public/apple-touch-icon.png`, `public/favicon-32.png`,
and `src/components/Logo.tsx`

The logo has only ever been shared as an image pasted into chat, which cannot be
saved to disk. Everything on the site is therefore a **hand-drawn
reconstruction** of the Windii Tech wordmark — the wave "W", "indii", the "Tech"
line and the registered mark, set in a rounded geometric typeface (Fredoka) in
the brand green `#00E58C`. It is close, but it is not your artwork.

**To use the real thing:**

1. Save the official logo into `public/` as `logo-official.svg` (preferred) or
   `logo-official.png`.
2. In `src/components/Logo.tsx`, set `USE_OFFICIAL_ARTWORK = true` (and adjust
   `OFFICIAL_ARTWORK_SRC` if you used .png).
3. Commit and push. The site then uses your file everywhere the logo appears.

Also regenerate the icon set from the real artwork: 192, 512, 180 (Apple touch
icon) and 32 pixels, replacing the files listed above.

**Colour note:** the artwork is bright green on black. That green fails contrast
requirements on a white background, so the site renders the lockup in the theme
accent — a darker green in light mode, the exact brand green in dark mode. If
you would rather have the exact green everywhere, say so; it is a one-line
change, but light-mode legibility will suffer.

## 5. Deliberately not included

Listed so you know these were omitted on purpose rather than forgotten. The
brief was explicit that nothing on this site may be fabricated, since D&B may
verify it.

| Not on the site | Why |
|---|---|
| Founding year / "established 20XX" | Not supplied. Add to `about` once confirmed. |
| Team size or headcount | Not supplied. |
| Named team members or leadership bios | Not supplied. |
| Client names or logos | None supplied, and using them needs client permission. |
| Testimonials or case studies | None supplied; inventing them is exactly what D&B checks for. |
| Statistics ("500+ projects delivered") | No verifiable figures available. |
| Awards or certifications | None supplied. |

Where a section would normally hold this kind of social proof, it either states
something verifiable instead (sector, head office, delivery scope on the home
page) or is left out. If you later want an "Our work" or "Team" section, send me
the real details and it can be added.

---

## Pre-launch checklist

- [ ] Business details verified against Form-C, NTN and the D&B template (§1.1)
- [ ] `info@windiitechnologies.com` mailbox working (§1.2)
- [ ] SPF, DKIM and DMARC records added and passing (`DNS-AND-EMAIL.md`)
- [ ] Contact form tested on the live site; enquiry arrives, not in spam
- [ ] LinkedIn page created and URL added (§1.3)
- [ ] Business hours confirmed (§2.1)
- [ ] Product name and positioning confirmed (§2.2)
- [ ] Map coordinates confirmed (§2.3)
- [ ] Privacy Policy and Terms reviewed by a lawyer (§3)
- [ ] Official logo files dropped in (§4)
- [ ] Site live at `https://windiitechnologies.com` over HTTPS
- [ ] `sitemap.xml` and `robots.txt` resolve; sitemap submitted to Google Search Console
