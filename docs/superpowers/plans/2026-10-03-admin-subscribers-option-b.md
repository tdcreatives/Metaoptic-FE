# Admin Subscribers (Option B) — 3 Oct 2026

**Shepherd choice:** Option B — read-only subscriber directory + light unsubscribe action.  
**Branch:** `feat/sgx-mirror-ci4`

## Scope

- CMS nav **Subscribers** → `/admin/subscribers`
- List: email, name, status, categories, consented_at (no `unsubscribe_token_hash`)
- Filters: status, category, email search (`q`)
- CSV export (same filters); audit `export` with count only
- Action: **Mark unsubscribed** (active only) → same status fields as public unsub; audit `unsubscribe` with subscriber id (no email in metadata)
- Dashboard: active subscriber count + link

## Out of scope

- Edit email / names, import, resend confirmation, delete row, reactivate UI, token display

## Files

- `backend/app/Libraries/Admin/SubscriberDirectory.php` — list/export/unsubscribeById
- `backend/app/Controllers/Admin/Subscribers.php`
- `backend/app/Views/admin/subscribers/index.php`
- Routes, layout nav, dashboard
- `backend/tests/feature/Admin/SubscribersAdminTest.php`
- `backend/tests/unit/Admin/SubscriberDirectoryTest.php`
