# DNS update guide — metaoptics.sg

**Audience:** MetaOptics client / IT contact who can edit DNS  
**Prepared:** 2026-10-06  
**Goal:** Point the public site to Cloudflare Pages, keep CMS + downloads on MOT hosting, and verify Resend for IR email alerts.

---

## 1) Where DNS is managed today

| Item | Current value |
| --- | --- |
| Domain | `metaoptics.sg` |
| Registrar (WHOIS) | Domain Registration Pte Ltd (SGNIC) |
| **Authoritative DNS (live)** | **MySecureCloudHost / MochaHost** |
| Nameservers in use | `ns1.mysecurecloudhost.com` … `ns4.mysecurecloudhost.com` |
| Apex (`metaoptics.sg`) today | **A → `209.42.27.225`** (MOT / MochaHost) |
| `www.metaoptics.sg` today | Points at apex → same IP |
| `cms.metaoptics.sg` today | **A → `209.42.27.225`** (already) |
| `downloads.metaoptics.sg` today | **Not set** |
| Mail (MX) | Microsoft 365 (`metaoptics-sg.mail.protection.outlook.com`) — **do not remove** |

**Where to edit records**

1. Log in to the **MochaHost / MySecureCloudHost** control panel used for `metaoptics.sg` (cPanel → **Zone Editor** / **DNS Zone**, or the host’s DNS UI).  
2. If you only have registrar login and do **not** see DNS records there, ask the host for Zone Editor access — nameservers are on MySecureCloudHost, so that is the place that must change.

> WHOIS may still list older MochaHost NS (`ns1sg.mochahost.com`). Trust the live NS above (`mysecurecloudhost.com`).

---

## 2) Changes to make

Do these in the DNS zone for `metaoptics.sg`. TTL: `3600` (or panel default) is fine.

### Step A — Public website → Cloudflare Pages (`metaoptic.pages.dev`)

Cloudflare Pages project target: **`metaoptic.pages.dev`** (confirmed live).

#### Important limitation (apex / root domain)

A normal DNS host **cannot** put a true **CNAME on `@` (apex)** the way Cloudflare DNS can.  
For **`metaoptics.sg` (no www)** to serve Cloudflare Pages cleanly, you usually need **one** of:

| Option | What client does | Notes |
| --- | --- | --- |
| **A — Recommended** | Add `metaoptics.sg` as a zone in **Cloudflare**, change nameservers at the registrar to Cloudflare, then attach the Pages custom domain | Cloudflare creates/flattens the apex record for Pages. Then re-create `cms`, `downloads`, mail-related, and Resend records in Cloudflare DNS. |
| **B — Keep MochaHost DNS** | Point **`www`** only: `CNAME www → metaoptic.pages.dev`, and redirect apex → `www` on hosting / Cloudflare | Apex cannot be a pure CNAME to Pages on MochaHost. |

**If staying on MochaHost DNS (Option B) — minimum records**

| Type | Name / Host | Value / Points to | Action |
| --- | --- | --- | --- |
| CNAME | `www` | `metaoptic.pages.dev` | **Add or replace** existing `www` record |
| A | `@` | *(keep or set redirect strategy)* | Do **not** replace with a fake CNAME unless the panel offers **ALIAS/ANAME** that MochaHost documents as supported |

Also in **Cloudflare Dashboard → Pages → project → Custom domains**: add `www.metaoptics.sg` (and apex only if using Option A).

**If moving DNS to Cloudflare (Option A) — high-level**

1. Cloudflare → Add site `metaoptics.sg` → copy the two Cloudflare nameservers.  
2. At **Domain Registration Pte Ltd / SGNIC registrar**, replace NS with Cloudflare’s.  
3. In Cloudflare DNS, ensure:
   - Pages custom domain for `metaoptics.sg` / `www` (Pages UI usually creates the records).  
   - `cms` and `downloads` A records (Step B / C) still point to `209.42.27.225` (**DNS only / grey cloud**, not proxied, unless you intentionally proxy).  
   - Existing **MX** for Outlook stays.  
   - Resend records (Step D) are added.

---

### Step B — CMS → MOT hosting

| Type | Name / Host | Value | Action |
| --- | --- | --- | --- |
| A | `cms` | `209.42.27.225` | **Confirm** (already live as of 2026-10-06) or **create** if missing |

Result: `https://cms.metaoptics.sg/` → MOT server.

If an old CNAME for `cms` exists, delete it and use the A record above.

---

### Step C — Downloads subdomain → MOT hosting (new)

| Type | Name / Host | Value | Action |
| --- | --- | --- | --- |
| A | `downloads` | `209.42.27.225` | **Create** (does not exist today) |

Result: `https://downloads.metaoptics.sg/` → same MOT host.  
*(Server vhost / SSL for this hostname must be configured on the host after DNS exists.)*

---

### Step D — Resend domain verification (IR email alerts)

Resend does **not** use one fixed universal record set. Values are shown in:

**Resend Dashboard → Domains → Add domain** (e.g. `metaoptics.sg` or a send subdomain such as `alerts.metaoptics.sg`).

Typical records to add (copy **exact** Name + Value from Resend):

| Purpose | Usual type | Example name (illustrative) | Notes |
| --- | --- | --- | --- |
| Domain verify | TXT | `@` or host Resend shows | Required for verify |
| DKIM | TXT or CNAME | e.g. `resend._domainkey` | Often one or more DKIM records |
| Optional SPF | TXT on `@` | Must **merge** with existing SPF — do not create a second SPF | Current SPF already includes Outlook + hosting; Resend will ask for something like `include:amazonses.com` / Resend’s include — **append** into the single existing `v=spf1 …` string |
| Optional DMARC | TXT | `_dmarc` | Recommended later if not already present |

**Do not delete** the existing MX (Outlook) or invent a second `v=spf1` TXT — mail will break.

After records are live, click **Verify** in Resend. Propagation is often minutes–a few hours (up to 24–48h).

---

## 3) Suggested order

1. **Resend** TXT/DKIM (no traffic impact).  
2. **`downloads` A** + ask host to add SSL/vhost.  
3. Confirm **`cms` A**.  
4. **Website → Pages** (Option A or B) — schedule a short cutover window; test `www` / apex before announcing.

---

## 4) How to check (after changes)

From any machine (or [https://dnschecker.org](https://dnschecker.org)):

```bash
dig NS metaoptics.sg +short
dig A metaoptics.sg +short
dig CNAME www.metaoptics.sg +short
dig A cms.metaoptics.sg +short
dig A downloads.metaoptics.sg +short
dig TXT metaoptics.sg +short
```

| Expect after cutover | |
| --- | --- |
| `www` → Pages | CNAME (or flattened A) resolving toward Cloudflare / `metaoptic.pages.dev` |
| `cms` | `209.42.27.225` |
| `downloads` | `209.42.27.225` |
| Resend | Dashboard shows domain **Verified** |

Browser checks:

- `https://www.metaoptics.sg/` (or apex) — public site  
- `https://cms.metaoptics.sg/` — CMS  
- `https://downloads.metaoptics.sg/` — downloads (after host SSL)  

---

## 5) What we need back from the client

- [ ] Confirmation who has MochaHost / MySecureCloudHost Zone Editor login  
- [ ] Choice for main site: **Option A** (move NS to Cloudflare) or **Option B** (`www` CNAME only)  
- [ ] Screenshot or paste of Resend → Domains DNS rows (so we can confirm SPF merge)  
- [ ] Ping when records are saved so we can re-check dig + Resend verify  

---

## 6) Quick reference — target records

| Host | Type | Target | Purpose |
| --- | --- | --- | --- |
| `www` *(and apex if Option A)* | CNAME / CF Pages | `metaoptic.pages.dev` | Public website |
| `cms` | A | `209.42.27.225` | IR CMS |
| `downloads` | A | `209.42.27.225` | File downloads on MOT host |
| *(from Resend UI)* | TXT / CNAME | *(Resend values)* | Send IR alerts via Resend |

---

*Internal note: live lookup 2026-10-06 — NS `*.mysecurecloudhost.com`; apex & cms already on `209.42.27.225`; no `downloads` and no Resend verify records yet.*
