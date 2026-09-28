# MetaOptics IR — Feature Scope 

**Product areas:** SGX Mirror · Internal CMS · Email Alerts  
**Audience:** Client   
**Date:** 18 September 2026 (revised 28 September 2026 — Email Alerts decoupled from announcement detail)  
**Purpose:** Confirm what the delivers — workflows, features, and screens — without deep technical detail.

---

## 1. What this project solves

Today, SGX announcements for MetaOptics are mirrored on the Investor Relations website. Going forward, the system will:

1. **Pull announcements from SGX automatically** each day  
2. Let an **internal admin review and publish** them to the website  
3. Optionally compose **Email Alerts** (a separate CMS item) that can include **one or more Published** announcements, then **schedule** or **Send now** to subscribers  

Website visitors continue to use the existing IR pages. Admins use a separate, password-protected CMS. Investors use a subscription form (Email Alerts page) when that feature is switched on.

**Scale (agreed):** up to ~5 admins, ~10,000 subscribers, ~20 announcements per month.

---

## 2. End-to-end flow (big picture)

```text
SGX filings
    │
    ▼  Daily sync (08:00 Singapore time)
New / changed filings land in CMS
    │
    ├─ First-time history import ──► Published on website (no emails)
    │
    └─ Ongoing new filings ──► Pending Review
                │
                ▼
         Admin opens CMS
                │
                ├─ Edits website summary (optional)
                └─ Publish to Website ──► Visible on IR site
                         │
                         ▼
         Email Alerts (separate CMS entity)
                │
                ├─ Attach 1…N Published announcements
                ├─ Compose body (WYSIWYG; {{announcement}} insert)
                ├─ Schedule (Singapore time)  or  Send now
                └─ Matching subscribers receive one email
                         │
                         ▼
              One-click unsubscribe always available
```

**Important rule:** **Publish to Website** and **Email Alerts** are separate. An announcement is not emailed from its detail page. Only **Published** items can be attached to an alert; send/schedule requires at least one attach.

---

## 3. Feature A — SGX Mirror (automatic sync)

### What it does

- Once per day at **08:00 SGT**, the system fetches MetaOptics announcements from SGX.  
- It avoids duplicates (same SGX filing is not imported twice).  
- If SGX later changes a filing that was already imported, the CMS flags it for admin review **without overwriting** the admin’s edited summary.

### First-time vs ongoing

| Scenario | What happens on the website | Emails to investors |
|----------|-----------------------------|---------------------|
| **Initial history import** | All available history is marked **Published** | None (suppressed) |
| **Daily new filings** | Items arrive as **Pending Review** | None until admin publishes, then attaches the item to an Email Alert and schedules or sends |

### What the public website shows

- Only **Published** announcements appear on the IR Company Announcements pages.  
- Visitors can browse, filter by category, search, and open detail pages as they do today.  
- Pending or archived items never appear publicly.

### Admin visibility (via CMS)

- Sync history: last runs, success/failure, how many items were fetched / new / updated.  
- If sync fails, previously published content on the website **stays available**; the team is alerted to investigate.

### Client / TDC dependencies

- Access details for the SGX listing feed used in this feature (TDC accepts that this feed may need maintenance if SGX changes).  
- Confirmation of company / listing identifiers for MetaOptics.

---

## 4. Feature B — Internal CMS (admin console)

### Who uses it

Internal operators only (single shared admin login for MVP). Not public.

### Screens & UI (what admins see)

| Screen | Purpose |
|--------|---------|
| **Login** | Username + password; secure session; limited retries if password is wrong |
| **Dashboard** | Snapshot counts: Pending Review, Published, items flagged for re-review |
| **Announcements list** | Filter by status (Pending / Published / Archived); create manual items; open any item |
| **Announcement detail** | Full review workspace (see below) |
| **Email Alerts** | Separate list / compose / detail: attach Published announcements, schedule or Send now, delivery report |
| **Sync history** | Recent automatic sync runs and outcomes |
| **Settings → Digest recipients** | Who gets notified when new SGX items arrive |

### Announcement detail — review workspace

**Read-only (from SGX):**

- Original title, category, filing date/time, issuer, source link  
- Full original SGX content snapshot (cannot be edited)

**Editable by admin:**

- **Summary** — short text used for the website / listing context  
- Manual items also have title, category, filing time, optional source URL / body  

Email subject and intro are **not** edited on announcement detail. Compose happens on the **Email Alert**.

**Actions (separate buttons):**

1. **Publish to Website** — makes the item live on IR pages  
2. **Archive** — removes the item from the public website; history kept for audit  
3. **Delete** — when the item is not locked by an in-flight alert  
4. **Create Email Alert with this** — shortcut when Published (opens a new Email Alert with this item attached)

There is **no Send on announcement detail**. One announcement may appear on **many** Email Alerts over time.

### New-item admin notification

When the daily sync brings in **new** filings (not the first history import):

- Active addresses in **Settings → Digest recipients** are notified (digest email once mail delivery is live; until then, system logging supports operations).

### Security & trust (client-relevant)

- Password-protected CMS  
- Session cookies hardened for admin use  
- Forms protected against forged requests  
- Changes of consequence (login, edits, publish, archive, Email Alert compose/schedule/send, settings) are recorded in an audit trail  

### Client / TDC dependencies

- Agreed admin username / password process for go-live  
- List of emails that should receive “new SGX item” digests  

---

## 5. Feature C — Email Alerts (investors)

### Public experience (IR website)

**Subscribe page** (IR → Resources → Email Alerts, enabled when ready):

- Email address (required)  
- Optional first / last name  
- Category checkboxes (fixed list — see below)  
- Consent / Privacy Policy acknowledgement  
- Anti-bot field (invisible to normal users)  

**After submit:**

- Subscriber is **active immediately** (single opt-in)  
- They receive a **confirmation email** that registration succeeded  
- UI shows a simple success message (does not reveal whether the email was already registered)

**Unsubscribe:**

- Every alert email includes a **one-click unsubscribe** link  
- Unsubscribe takes effect immediately for future campaigns  

### Categories (MVP)

Fixed list (labels may be refined when TDC finalises the official list):

- General Announcement  
- Disclosure of Interest  
- Placements  
- Personnel Changes  
- Annual Reports  
- AGM / EGM  
- Equity & Listing  
- Financial Statements  

Subscribers only receive alerts for categories they selected. Audience for an Email Alert is the **union of categories** of the attached Published announcements.

### Admin Email Alert flow (separate from announcement detail)

1. Admin publishes one or more announcements to the website  
2. Opens **Email Alerts** (or “Create Email Alert with this” from a Published item)  
3. Attaches **1…N Published** announcements; composes subject, intro, and WYSIWYG body (`{{announcement}}` inserts the attached list)  
4. **Schedule** a one-shot send (Singapore time) **or** **Send now** (confirm)  
5. Subscribers whose categories match the audience union receive **one email per alert**  
6. Detail **report**: queued / sent / failed counts; open/click shown as n/a until the email provider supports tracking  
7. Draft alerts can be deleted; sending/sent content is protected (sent keeps a snapshot). Temporary delivery failures can be **retried** without creating a new alert

### What is intentionally out of scope (MVP)

- Marketing / non-SGX newsletters  
- Drag-and-drop email designer  
- Multiple admin roles / permissions matrix  
- Daily or weekly digests to investors (each Email Alert is a one-shot send)  
- Full analytics (open/click wait on the email provider)  
- Auto-send email the moment SGX sync imports a filing (always requires Publish, then an Email Alert schedule or Send now)

### Client / TDC dependencies (block production email)

- Final **category list** (keys + labels + mapping from SGX if needed)  
- Choice of **email provider** and credentials  
- **From name / address** and DNS (SPF, DKIM; DMARC recommended)  
- **Privacy Policy** wording for the subscription form  
- Confirm live URLs for API / CMS / public site  

---

## 6. Website impact (what visitors see)

| Area | Behaviour |
|------|-----------|
| IR Company Announcements list | Shows published filings; filters / search remain |
| Announcement detail | Shows published content; links to SGX source where available |
| Email Alerts page | Hidden or gated until subscription is switched on for production |
| Other IR tabs | Unchanged by this scope (Financials, Governance, etc.) |

---

## 7. Delivery phases (how we ship)

| Phase | Delivers | Client can validate |
|-------|----------|---------------------|
| **1 — SGX Mirror** | Daily sync, history import, published list on site via backend | New SGX filings appear after publish path; history present without spam email |
| **2 — CMS** | Admin login, review, edit, publish, archive, sync history, digest recipients | Operators can review Pending → Publish without developer help |
| **3 — Email Alerts** | Subscribe form, confirmation, unsubscribe; CMS Email Alert entity (attach Published, schedule / Send now, report) | End-to-end: subscribe → publish → compose alert → send → receive → unsubscribe |

Phases are sequential: Mirror first, then CMS, then Email.

---

## 8. Acceptance checklist (client-friendly)

### Mirror + website

- [ ] Daily sync runs at 08:00 SGT  
- [ ] Historical import published once, with **no** investor emails  
- [ ] New filings appear as Pending Review in CMS  
- [ ] Only Published items show on the public IR site  

### CMS

- [ ] Admin can log in and see Pending / Published  
- [ ] Admin can edit summary without changing SGX source text  
- [ ] **Publish** makes the item live on the website  
- [ ] Announcement detail has **no Send**; email is composed on Email Alerts  
- [ ] Archive removes the item from the public site  
- [ ] Digest recipient list can be maintained in Settings  

### Email Alerts

- [ ] Investor can subscribe and choose categories  
- [ ] Confirmation email arrives  
- [ ] Admin can attach **many Published** announcements to one Email Alert  
- [ ] Admin can **schedule** (SGT) or **Send now**; matching subscribers receive that alert  
- [ ] Report shows queued / sent / failed; open/click n/a until provider tracking  
- [ ] Unsubscribe stops future sends  
- [ ] Failed temporary deliveries can be retried without creating a duplicate alert  

---

## 9. Open items for TDC / client

1. Final announcement **category** list  
2. **Email provider** + sender identity + DNS access  
3. **Privacy Policy** copy for subscribe  
4. Production URLs for CMS and public site  
5. Confirmation of SGX feed access for MetaOptics MVP  

---

## 10. Summary for approval

This MVP gives MetaOptics a controlled pipeline:

**SGX → Admin review → Website publish → Optional Email Alert (many Published items, schedule or Send now)**

with clear separation between “live on website” and “notify subscribers,” and a simple public subscribe / unsubscribe experience.

Please confirm this scope matches expectations, especially **Publish before attach/send**, **Email Alert as its own entity**, and the **single opt-in** subscription model.
