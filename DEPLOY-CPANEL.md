# Deploying to cPanel / shared hosting

How to put the Windii Technologies site on your existing GoDaddy hosting as
plain HTML plus one PHP file. No Node.js on the server, nothing to keep
running, nothing to patch.

**Before you start, read [Step 0](#step-0--decide-what-happens-to-wordpress).
WordPress currently occupies your domain root and this decision is not
reversible without a backup.**

---

## What you are uploading

`npm run build:static` produces an `out/` folder containing:

| | |
|---|---|
| `index.html`, `about.html`, `services.html`, … | The seven pages, fully rendered |
| `_next/` | CSS and JavaScript |
| `about/`, `contact/`, … | Navigation data (Next.js uses these for instant page switches) |
| `contact.php` | Handles contact form submissions |
| `contact-config.example.php` | Template for your mail settings |
| `.htaccess` | Clean URLs, security headers, HTTPS |
| `sitemap.xml`, `robots.txt`, icons, `logo.svg` | SEO and branding assets |

---

## Step 0 — Decide what happens to WordPress

Your domain root currently runs WordPress (5 posts, 6 pages, the Gutenify
Business Hub theme). Apache reads `public_html/.htaccess` first, and
WordPress's copy sends **every** request to `index.php`. If you upload the site
alongside WordPress without deciding this, visitors keep seeing WordPress.

The site must live at `https://windiitechnologies.com` — not a subfolder — for
the D-U-N-S application, so the root has to be yours.

**Before you touch anything:**

1. **Check with your supervisor.** The WordPress install isn't yours, and the
   content on it may or may not matter to them. From the post titles
   ("10 Things Successful Mompreneurs Do Different", a 2023 marketing article)
   it looks like the Gutenify theme's demo content rather than real Windii
   material — but confirm, don't assume.
2. **Take a full backup regardless.** In cPanel: **Files → Backup → Download a
   Full Account Backup**. Do this even if everyone agrees the content is
   disposable. It costs five minutes and it is the only way back.

Then, in cPanel → **File Manager** → `public_html`:

1. Turn on **Settings → Show Hidden Files (dotfiles)** — you must be able to
   see `.htaccess`.
2. Select everything in `public_html` and move it into a new folder called
   `wordpress-old/` (safer than deleting — you can remove it in a few weeks
   once you're happy).
3. `public_html` should now be empty.

> Leaving WordPress files on the server does not slow your site down, but an
> unmaintained WordPress install is a security liability. Once you're confident
> the new site is working, delete `wordpress-old/` and remove the WordPress
> database in cPanel → MySQL Databases.

---

## Step 1 — Build the site

On your own machine:

```bash
git pull
npm install
npm run build:static
```

That writes the `out/` folder. It does not affect `npm run dev` or the normal
`npm run build` — both still work as before.

---

## Step 2 — Create your mail configuration

1. In the `out/` folder, rename `contact-config.example.php` to
   **`contact-config.php`**.
2. Open it and check the values. The defaults are already correct for you:

   ```php
   'to_email'   => 'info@windiitechnologies.com',
   'from_email' => 'no-reply@windiitechnologies.com',
   'transport'  => 'mail',
   ```

`'mail'` uses your host's own mail server. Because
`info@windiitechnologies.com` is a GoDaddy mailbox on the same infrastructure,
delivery is essentially local and needs no setup. Start here.

If enquiries end up in spam, switch to Resend later — see
[Improving deliverability](#improving-deliverability).

---

## Step 3 — Upload

**Using cPanel File Manager (easiest):**

1. On your machine, zip the **contents** of `out/` — not the folder itself. You
   want `index.html` at the top level of the zip, not `out/index.html`.
   - Windows: open `out/`, select all (`Ctrl+A`), right-click → *Send to →
     Compressed (zipped) folder*.
2. cPanel → **File Manager** → `public_html` → **Upload** → choose the zip.
3. Back in `public_html`, select the zip → **Extract**.
4. Delete the zip file.

**Critical:** `.htaccess` is a hidden file. Turn on **Show Hidden Files** in
File Manager settings and confirm `.htaccess` is present in `public_html` after
extracting. Without it, `/about` will not work. Windows Explorer sometimes
skips dotfiles when zipping — if it's missing, create it manually in File
Manager (**+ File** → name it `.htaccess`) and paste in the contents from
`php/.htaccess` in the repo.

**Using FTP instead:** upload the contents of `out/` into `public_html` with
FileZilla. Enable **Server → Force showing hidden files** so `.htaccess`
transfers.

---

## Step 4 — Test the live site

Visit each of these and confirm they load:

- `https://windiitechnologies.com`
- `/about`, `/services`, `/products`, `/contact`, `/privacy`, `/terms`
- `/sitemap.xml` and `/robots.txt`

Then check:

- [ ] The address bar shows `https://` (the `.htaccess` forces it)
- [ ] The dark/light toggle in the header works
- [ ] The site looks right on your phone
- [ ] `https://windiitechnologies.com/contact-config.php` returns
      **403 Forbidden** — it must never be downloadable
- [ ] Submit a real enquiry through the contact form and confirm it arrives at
      `info@windiitechnologies.com`

---

## Step 5 — Verify for D&B

- [ ] Company name, address, phone and email are identical on every page
- [ ] `https://windiitechnologies.com` loads over HTTPS with a valid certificate
- [ ] The contact form works end to end
- [ ] Submit the sitemap in Google Search Console

---

## Updating the site later

```bash
# edit src/content/site.ts
npm run build:static
```

Then re-upload the contents of `out/`. Your `contact-config.php` lives only on
the server, so it is not overwritten — but if you ever wipe `public_html`
completely, recreate it.

---

## Improving deliverability

PHP `mail()` is fine for delivery to your own mailbox, but messages sometimes
land in spam. To switch to Resend:

1. Sign up at [resend.com](https://resend.com) and verify
   `windiitechnologies.com` as a sending domain.
2. Add the DNS records Resend gives you at GoDaddy. **They are additions — none
   of them touch your MX records, so your email keeps working.** See
   [`DNS-AND-EMAIL.md`](./DNS-AND-EMAIL.md).
3. Edit `contact-config.php` on the server:

   ```php
   'transport'      => 'resend',
   'resend_api_key' => 're_your_key_here',
   ```

No rebuild or re-upload needed — it takes effect on the next submission.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Home page works, `/about` is 404 or 403 | `.htaccess` missing or hidden files not uploaded | Enable Show Hidden Files; confirm `.htaccess` is in `public_html` |
| You still see WordPress | WordPress files still at the root | Redo Step 0 — `public_html` must be empty first |
| Site loads but is unstyled | `_next/` folder not uploaded | Re-upload; make sure the whole `_next` directory came across |
| Form shows a red error | `contact-config.php` missing, or mail blocked | Confirm the file sits next to `contact.php`; check cPanel → Errors |
| Form succeeds but no email arrives | Delivered to spam | Check the spam folder, then switch to Resend |
| "Too many enquiries" message | Rate limit hit (5 per 10 minutes) | Expected — wait, or raise `rate_limit_max` in the config |

Server-side errors are logged by PHP. In cPanel → **Metrics → Errors**, look
for lines starting `[contact]`.

---

## What was verified before shipping

Rather than assuming this works, it was tested against a real Apache 2.4 server
with the actual `.htaccess`, and a real PHP 8.4 server for `contact.php`:

- All seven pages return 200 through the clean-URL rules; `/about/` redirects
  to `/about`
- `contact-config.php`, `contact-config.example.php` and `.htaccess` all return
  403 to a browser
- Security headers present; HTTP redirects to HTTPS
- Pages render with full styling and fonts, client-side navigation works, and
  the theme toggle works, with zero console errors
- No horizontal overflow at 320, 768, 1280 or 1920 px
- The form posts to `contact.php` and shows its success state
- `contact.php` returns the same responses as the Node API: valid → mail
  actually delivered with correct `To`/`Reply-To`; invalid → 400 with per-field
  errors; honeypot → silent 200 and no mail sent; a CRLF header-injection
  attempt in the subject was neutralised; 6th rapid request → 429 with
  `Retry-After`
