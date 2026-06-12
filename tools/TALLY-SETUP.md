# Contact Forms → Google Sheet (Tally) — setup guide

The contact page is built and embed-ready. Three slots are marked in
`src/contact.html` and `src/zh/contact.html` with HTML comments + a `.form-embed`
placeholder div. This guide creates the Tally forms, connects them to your
Google Sheet, and tells you exactly where to paste the embed codes.

**Time:** ~15 min. **Cost:** free.

---

## 1. Create a Tally account
- Go to https://tally.so → sign up (free). Use your agency email.

## 2. Build the 3 forms
Create each form (New form → Start from scratch). Suggested fields:

### A. Request a Quote (RFQ)  — the important one
| Field | Type | Required |
|---|---|---|
| Name | Short text | ✅ |
| Company | Short text | |
| Email | Email | ✅ |
| Phone | Phone | |
| Country | Short text | |
| Part / project name | Short text | |
| Material | Dropdown (Steel, Stainless, Aluminium, Brass, Titanium, Other) | |
| Quantity | Number | |
| Tolerance | Short text | |
| Target lead time | Short text | |
| Drawings (STEP/PDF/DWG) | File upload | |
| Message | Long text | |

### B. General Enquiry
Name (✅), Email (✅), Company, Message (long text, ✅).

### C. Newsletter
Email (✅), Name (optional).

> Tip: on 繁中 forms, set the field **labels in 繁體中文** (Tally lets you duplicate
> a form and translate labels), so the Chinese page form reads naturally.

## 3. Connect each form to Google Sheets
In each form: **Integrations** (or **⋯ → Integrations**) → **Google Sheets** →
**Connect** → sign in to your Google account → authorize.
- Tally creates/links a spreadsheet in your Drive and writes one row per submission.
- A ready-made hub sheet already exists — **"SOAR CNC — Customer Leads"** in the
  shared *SOAR Website Materials* Drive folder — use it, or keep Tally's auto-created
  sheets; either way the data lives in **your** Google account.
- ⏰ Make sure **2-factor authentication** is ON for that Google account.

## 4. Get each embed code & paste it in
For each form: **Share → Embed → Inline** → copy the code snippet.
In the HTML, find the matching comment and **replace the `<div class="form-embed">…</div>`
placeholder** right below it with the copied snippet:

| Form | EN file / marker | 繁中 file / marker |
|---|---|---|
| RFQ | `src/contact.html` → `TALLY_FORM_QUOTE_CART` | `src/zh/contact.html` → `TALLY_FORM_QUOTE_CART` |
| General Enquiry | `src/contact.html` → `TALLY_FORM_CONTACT` | `src/zh/contact.html` → `TALLY_FORM_CONTACT` |
| Newsletter | `src/contact.html` → `TALLY_FORM_NEWSLETTER` | `src/zh/contact.html` → `TALLY_FORM_NEWSLETTER` |

(Send me the embed codes and I'll paste them in for you, if you prefer.)

## 5. Test
Submit a test entry on each form → confirm a new row appears in the Google Sheet,
including any 繁中 text (should show correctly — UTF-8 end to end).

---

## Why this is safe (what to tell the client)
- Forms submit over **HTTPS** (enforced at Cloudflare).
- **No customer-data fields live in the website code** — only Tally embeds.
- Submissions are stored in **your** Google Sheet, protected by **2FA**.
- Tally provides built-in **spam protection**; the Privacy Policy (linked in the
  footer + above each form) explains data handling.
- The site's Content-Security-Policy already allows only `tally.so` for forms.
