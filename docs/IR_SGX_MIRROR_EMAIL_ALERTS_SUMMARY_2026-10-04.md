# MOT — summary & testing guide

**SGX Mirror · Publish to website · Email Alerts**  

---

## What you can do

1. **SGX Mirror** — New filings land in the admin CMS as **Pending review** (not public yet).  
2. **Publish** — Your team publishes an announcement → it can appear on the IR Company Announcements pages.  
3. **Email Alerts** — Separate step: compose an alert, attach published announcement(s), **Send now** or **Schedule** → matching subscribers get email.

**Publish ≠ email.** The website and investor email are always two different actions.

---

## CMS quick start

| Goal | Where | Steps |
|------|--------|--------|
| Review new SGX items | **Announcements** | Filter **Pending** → open → edit if needed → **Publish** (or Archive) |
| Preview before publish | Announcement detail / list | **Preview** |
| See who subscribed | **Subscribers** | Check Active + preferences; export if needed |
| Email investors | **Email Alerts** | New alert → attach **Published** items → check estimated subscribers → **Send now** or **Schedule** |
| Sync status | **Sync history** | Confirm latest intake OK |

---

## Suggested test path

1. Confirm a **Pending** announcement exists (from sync or create manually).  
2. Set **Category** to one of the preference labels below → **Publish**.  
3. On the public IR site, confirm the item appears under Company Announcements.  
4. On Email Alerts (public), subscribe with a test email and tick that **same category**.  
5. In CMS **Subscribers**, confirm the email is **Active**.  
6. Create an **Email Alert**, attach the published item → estimated subscribers ≥ 1 → **Send now**.  
7. Check the test inbox (and CMS delivery status on the alert detail).

---

## Please note — preferences vs category

Signup **Alert Preferences** use a fixed list (below).  
SGX announcements keep SGX’s own category text and are **not auto-mapped** to that list.

If the announcement **Category** does not **exactly match** a preference the subscriber chose, estimated reach can be **0** and nobody gets the email.

**While testing:** always set the announcement Category to a label from this list, and subscribe with that same preference.

- General Announcement  
- Disclosure of Interest  
- Placements  
- Personnel Changes  
- Annual Reports  
- AGM / EGM  
- Equity & Listing  
- Financial Statements  

---

## Pass / fail at a glance

| Check | Pass |
|-------|------|
| New SGX item in CMS | Shows as Pending |
| After Publish | Visible on IR announcements |
| Subscribe | Appears under Subscribers (Active) |
| Send Email Alert | Estimated subscribers > 0; test inbox receives mail |
| Unsubscribe link in email | Subscriber becomes inactive |

Questions during testing: note the CMS screen, what you clicked, and what you expected vs what you saw.

---

## Note — public website hosting (for auto-publish)

Today the **MOT frontend is still served from the PHP hosting**. On that setup, publishing an announcement in the CMS does **not** automatically refresh the public pages the way we want for go-live.

To support **auto-publish** (new / updated announcements appearing on the live site after CMS Publish, including optional rebuild when you publish or archive), the public site should move to **Cloudflare** (Pages / DNS in front of the domain).

**What we need from you to start that move:** DNS / domain details so Cloudflare can be configured for the IR site, for example:

- Domain name(s) to use (e.g. `metaoptics.sg` / `www`)
- Access to manage DNS (or a contact who can add/change DNS records)
- Confirmation of which hostname should serve the IR site after the cutover

Until that move is done, treat website visibility in testing as **manual / hosting-dependent**; CMS Publish and Email Alerts can still be tested on their own.
