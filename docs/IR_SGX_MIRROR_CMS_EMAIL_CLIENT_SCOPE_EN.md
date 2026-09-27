# MetaOptics IR — Feature Scope 

**Product areas:** SGX Mirror · Internal CMS · Email Alerts  
**Audience:** Client   
**Date:** 18 September 2026  
**Purpose:** Confirm what the delivers — workflows, features, and screens — without deep technical detail.

---

## 1. What this project solves

Today, SGX announcements for MetaOptics are mirrored on the Investor Relations website. Going forward, the system will:

1. **Pull announcements from SGX automatically** each day  
2. Let an **internal admin review and publish** them to the website  
3. Optionally **send email alerts** to investors who have subscribed  

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
                ├─ Edits summary / email wording (optional)
                ├─ Publish to Website ──► Visible on IR site
                └─ Send Email Alert   ──► Only after Publish
                         │
                         ▼
              Matching subscribers receive one email
                         │
                         ▼
              One-click unsubscribe always available
```

**Important rule:** Publish to Website and Send Email Alert are **two separate actions**. Email cannot be sent until the item is published.

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
| **Daily new filings** | Items arrive as **Pending Review** | None until admin publishes and explicitly sends |

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
| **Announcements list** | Filter by status (Pending / Published / Archived); open any item |
| **Announcement detail** | Full review workspace (see below) |
| **Sync history** | Recent automatic sync runs and outcomes |
| **Settings → Digest recipients** | Who gets notified when new SGX items arrive |

### Announcement detail — review workspace

**Read-only (from SGX):**

- Original title, category, filing date/time, issuer, source link  
- Full original SGX content snapshot (cannot be edited)

**Editable by admin:**

- **Summary** — short text used for the website / listing context  
- **Email subject** — used when sending an alert  
- **Email intro** — short intro body for the alert  

**Actions (separate buttons):**

1. **Publish to Website** — makes the item live on IR pages  
2. **Send Email Alert** — queues one email campaign (disabled until Published)  
3. **Archive** — removes the item from the public website; history kept for audit  

Once an email campaign has been created for an announcement, **Send cannot create a second campaign** (retry of failed deliveries only — see Email Alerts).

### New-item admin notification

When the daily sync brings in **new** filings (not the first history import):

- Active addresses in **Settings → Digest recipients** are notified (digest email once mail delivery is live; until then, system logging supports operations).

### Security & trust (client-relevant)

- Password-protected CMS  
- Session cookies hardened for admin use  
- Forms protected against forged requests  
- Changes of consequence (login, edits, publish, send, archive, settings) are recorded in an audit trail  

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

Subscribers only receive alerts for categories they selected, matched to the announcement’s category.

### Admin send flow (after Publish)

1. Admin reviews email subject / intro on the CMS detail page  
2. Clicks **Send Email Alert**  
3. System builds **one campaign** for that announcement  
4. Emails go out to active subscribers whose categories match  
5. Temporary delivery failures can be **retried**; permanent failures are visible for ops  
6. A second “Send” for the same announcement is **blocked**

### What is intentionally out of scope (MVP)

- Marketing / non-SGX newsletters  
- Drag-and-drop email designer  
- Multiple admin roles / permissions matrix  
- Daily or weekly digests to investors (alerts are per published announcement)  
- Advanced analytics dashboards  
- Auto-send email the moment SGX sync imports a filing (always requires Publish + Send)

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
| **3 — Email Alerts** | Subscribe form, confirmation, unsubscribe, Send campaign + delivery | End-to-end: subscribe → publish → send → receive → unsubscribe |

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
- [ ] Admin can edit summary and email copy without changing SGX source text  
- [ ] **Publish** makes the item live on the website  
- [ ] **Send** stays disabled until Published  
- [ ] **Send** creates at most one campaign per announcement  
- [ ] Archive removes the item from the public site  
- [ ] Digest recipient list can be maintained in Settings  

### Email Alerts

- [ ] Investor can subscribe and choose categories  
- [ ] Confirmation email arrives  
- [ ] Matching subscribers receive the alert after admin Send  
- [ ] Unsubscribe stops future sends  
- [ ] Failed temporary deliveries can be retried without creating a second campaign  

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

**SGX → Admin review → Website publish → Optional investor email**

with clear separation between “live on website” and “notify subscribers,” protection against duplicate campaigns, and a simple public subscribe / unsubscribe experience.

Please confirm this scope matches expectations, especially the **Publish before Send** rule and the **single opt-in** subscription model.
