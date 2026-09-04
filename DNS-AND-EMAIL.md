# Domain Email & Deliverability Setup

What you need to configure so that **info@windiitechnologies.com** works, and so
that mail sent from the website's contact form actually reaches your inbox
instead of the spam folder.

Written in plain language — no prior DNS knowledge assumed. Everything here is
done at your **domain registrar** (or wherever your DNS is hosted), in a screen
usually called "DNS", "DNS Zone Editor" or "Manage DNS".

---

## Part 1 — Get the mailbox working

You need an actual mailbox for `info@windiitechnologies.com`. Two normal ways:

**Option A — your web host's mail (usually included with cPanel).**
In cPanel → *Email Accounts* → *Create*, make `info@windiitechnologies.com`.
Your host will already have set the MX records for you.

**Option B — a hosted email provider** (Google Workspace, Microsoft 365, Zoho
Mail). More reliable and better for deliverability. Sign up, verify the domain,
then add the **MX records** the provider gives you.

> An MX record tells the rest of the internet which server receives mail for
> your domain. You can only have one set of MX records, so pick one provider —
> mixing two is the most common way to lose incoming mail.

Once the mailbox exists, send it a test message from an outside address (e.g.
your phone) and confirm it arrives before going further.

---

## Part 2 — The three records that stop your mail being marked as spam

Receiving mail servers ask three questions about every message claiming to come
from `windiitechnologies.com`:

1. **SPF** — "Is the server that sent this allowed to send for this domain?"
2. **DKIM** — "Is this message cryptographically signed, and unmodified?"
3. **DMARC** — "What should I do if SPF or DKIM fails?"

If you answer none of them, your mail is treated as suspicious. All three are
just DNS records you add once.

### SPF — who is allowed to send

One TXT record, on the root of the domain, listing every service that sends mail
as your domain.

| Field | Value |
|---|---|
| Type | `TXT` |
| Name / Host | `@` (means the domain itself) |
| Value | `v=spf1 include:_spf.google.com include:amazonses.com ~all` |

Replace the `include:` parts with the ones your providers give you:

- Google Workspace → `include:_spf.google.com`
- Microsoft 365 → `include:spf.protection.outlook.com`
- Zoho → `include:zoho.com`
- Resend → `include:amazonses.com`
- cPanel host → usually `include:` your host's domain, or `a mx`

**Critical rule: you may only have ONE SPF record.** If you already have one,
edit it and add the new `include:` inside it — do not create a second TXT
record. Two SPF records cause both to be ignored.

`~all` at the end means "anything else is probably not us" (soft fail). Start
with `~all`; you can tighten it to `-all` (hard fail) later once you are certain
every legitimate sender is listed.

### DKIM — the cryptographic signature

Your email provider generates a key pair, keeps the private half, and gives you
a public half to publish in DNS. You do not invent these values — copy exactly
what the provider shows you.

| Field | Value |
|---|---|
| Type | `TXT` (occasionally `CNAME`) |
| Name / Host | something like `google._domainkey` or `resend._domainkey` |
| Value | the long `v=DKIM1; k=rsa; p=MIGf...` string from your provider |

Where to find it:

- **Google Workspace** → Admin console → Apps → Google Workspace → Gmail →
  *Authenticate email* → Generate new record, then click **Start
  authentication** after publishing.
- **Microsoft 365** → Defender portal → Email & collaboration → Policies →
  Email authentication → DKIM.
- **Resend** → Domains → your domain → it lists every record to add.
- **cPanel** → *Email Deliverability* → *Manage* → it shows the exact SPF and
  DKIM records and offers to install them for you.

The value is long and must be pasted **without line breaks or added spaces**.
This is the single most common mistake — if DKIM does not validate, re-copy the
value.

### DMARC — what to do when a check fails

One TXT record telling receivers how to treat mail that fails SPF and DKIM, and
where to send reports.

| Field | Value |
|---|---|
| Type | `TXT` |
| Name / Host | `_dmarc` |
| Value | `v=DMARC1; p=none; rua=mailto:info@windiitechnologies.com; fo=1` |

`p=none` means "don't block anything yet, just report". Start there.

**Recommended progression** (do not skip straight to the last one — you will
block your own legitimate mail):

1. `p=none` — monitor for 2–4 weeks. Read the reports that arrive.
2. `p=quarantine` — failing mail goes to spam. Watch for another 2–4 weeks.
3. `p=reject` — failing mail is refused outright. The strongest setting, and
   where you eventually want to be.

Only move to the next step once the reports show all your genuine mail passing.

---

## Part 3 — The website's contact form

The form does not send mail *from* the visitor's address — that would fail SPF
and DKIM immediately, because you are not authorised to send as
`someone@theircompany.com`. Instead it sends from an address on **your** domain
and sets the visitor's address as `Reply-To`, so hitting Reply in your inbox
goes back to them.

Set in your environment (see `.env.example`):

```
CONTACT_TO_EMAIL=info@windiitechnologies.com
CONTACT_FROM_EMAIL="Windii Technologies <no-reply@windiitechnologies.com>"
```

The From address must be on a domain you have authorised for sending:

- **Using Resend:** verify `windiitechnologies.com` in the Resend dashboard and
  add every DNS record it lists (an SPF include, a DKIM record, and usually a
  return-path CNAME). The From address will not work until the domain shows as
  verified.
- **Using SMTP:** send as the mailbox you are authenticating with — normally
  `info@windiitechnologies.com` itself. Some hosts reject a From address that
  does not match the authenticated account.

---

## Part 4 — Check your work

Give DNS changes time to propagate. Most appear within 15–30 minutes; allow up
to 48 hours before concluding something is wrong.

Then verify:

1. **Send a test enquiry through the live contact form.** Confirm it arrives at
   `info@windiitechnologies.com` and lands in the inbox, not spam.
2. **Check the headers.** In Gmail, open the message → ⋮ → *Show original*. You
   want to see:

   ```
   SPF:   PASS
   DKIM:  PASS
   DMARC: PASS
   ```

   Any `FAIL` or `NONE` means that record is missing or mistyped.
3. **Use a checker.** Free tools such as [mail-tester.com](https://www.mail-tester.com)
   (send a message to the address it gives you and it scores you out of 10) or
   MXToolbox's SPF/DKIM/DMARC lookups will point at the specific problem.

---

## Quick reference

| Record | Name / Host | Purpose |
|---|---|---|
| `MX` | `@` | Where incoming mail is delivered |
| `TXT` (SPF) | `@` | Which servers may send as your domain — **only one** |
| `TXT` (DKIM) | `<selector>._domainkey` | Public key that signs your mail |
| `TXT` (DMARC) | `_dmarc` | Policy for failures + where reports go |

## Common mistakes

- **Two SPF records.** Both get ignored. Merge them into one.
- **DKIM pasted with line breaks.** Must be a single unbroken string.
- **Jumping straight to `p=reject`.** Blocks your own mail before you know
  whether everything passes. Start at `p=none`.
- **Sending the form as the visitor's address.** Guarantees SPF failure. The
  site already avoids this — do not "fix" it.
- **Changing MX records without moving the mailboxes.** Incoming mail stops.
- **Not waiting.** DNS is cached. Give it time before assuming it failed.
