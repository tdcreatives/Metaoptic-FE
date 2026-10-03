# FE ↔ CMS Announcement Parity (+ Publish → Email Alert draft)

**Date:** 2026-09-28  
**Status:** Design accepted (brainstorming)  
**Branch context:** `feat/sgx-mirror-ci4`  
**Related:** `docs/superpowers/designs/2026-09-28-announcements-crud-email-alerts.md` (Email Alerts entity already shipped)

---

## Understanding summary

- **What:** Expand CMS/DB + public API so announcement data matches the live FE contract (`src/constants/announcements.json` / IR detail UI). Keep Sync → Admin review → Publish → FE. On Publish, optionally create a prefilled Email Alert **draft**.
- **Why:** FE is live on a rich JSON shape; CMS/API today is flat (`AnnouncementPresenter`), so enabling `useAnnouncementsApi` would break list/detail parity (e.g. URL  
  `…/general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly`).
- **Who:** CMS admins (review/publish/alerts); IR visitors (Published only); subscribers later when `showEmailAlerts` flips.
- **Constraints:** FE UI stays; API/DB expand to FE shape; layout fields hybrid (derive + override); full normalize of FE-used fields + child tables; baseline = one-shot import of `announcements.json` as Published (no bulk email prompts); do not flip FE flags until QA.
- **Non-goals:** Redesign IR pages; force an Email Alert on every publish; re-review imported baseline; flip `showEmailAlerts` in this phase unless requested later.

## Assumptions (NFR)

| Area | Assumption |
|------|------------|
| Scale | ~5 admins, ~10k subscribers, ~20 announcements/month; JSON baseline ~66 rows |
| Perf | List/detail API adequate for current IR traffic; list revalidate ~5 min when flag on |
| Security | Existing admin auth; `useAnnouncementsApi` / `showEmailAlerts` stay false until schema + import + mapper QA |
| Reliability | SGX sync failure must not wipe Published imports; Email Alert draft creation after Publish is best-effort (failure does not roll back Publish) |
| Ownership | Backend owns schema/sync/import/Presenter; FE keeps UI, thins mapper + detail fetch-by-slug when flag on |

## Decision log

| # | Decision | Alternatives | Why |
|---|----------|--------------|-----|
| 1 | Expand API/DB to match FE (A) | Change FE / thin hybrid | Preserve live IR UI |
| 2 | Layout fields: derive + admin override | Admin-only / derive-only | Prefill + banner/btn control |
| 3 | Publish → prompt “Create Email Alert draft?” | Manual only / always auto-draft | Choice without draft spam |
| 4 | Prefill: attach + subject=title + intro=summary + categories + `{{announcement}}` | Smaller prefill sets | Minimize admin edits |
| 5 | Full normalize FE fields + attachments (+ optional blocks as tables/columns) | JSON blob / core-only | Match detail component |
| 6 | Baseline = import `announcements.json` | Re-sync SGX / hybrid import+SGX | Match live content |
| 7 | Import → Published, no email prompts | Pending / bulk prompts | No behavior change on live site |
| 8 | NFR package above | — | Safe launch |
| 9 | Approach 1: FE contract schema + Presenter rebuild | Two-phase raw blob / codegen | One source of truth, shippable |
| 10 | Keep JSON `slug` on import | Regenerate slugs | Stable live URLs |
| 11 | Manual create: minimal fields; nested optional | Require full SGX-like detail | YAGNI for rare manual rows |
| 12 | SGX nested mostly read-only; editable summary + layout overrides | Full CMS edit of all SGX fields | Mirror + light curation |

---

## Final design

### Approach

**FE contract schema + Presenter rebuild:** migrations expand `announcements` and add child tables to hold every field the FE list/detail already consume; a one-shot JSON importer seeds Published rows; SGX sync writes the same schema; `AnnouncementPresenter` emits the legacy nested shape; Publish may open a modal to create a prefilled Email Alert draft.

### Architecture & data flow

```text
announcements.json ──(one-shot import)──► DB (published, keep slug)
                                              ▲
SGX daily sync ──normalize──► same columns/tables ┤
                                              │
Admin CMS: review → Publish ──► FE API (Presenter = legacy shape)
                    │
                    └─ optional prompt → Email Alert draft (prefill)
```

- After import, **DB is source of truth**. JSON remains fallback while `useAnnouncementsApi === false`.
- Public API returns Presenter legacy shape. FE mapper becomes near-identity; fix incorrect `reference = slug`.
- Email Alerts entity unchanged; new entry path = Publish modal + existing “Create Email Alert with this” CTA.

### Data model

**`announcements` (extend existing):** keep current columns; add layout overrides `title_btn`, `title_btn_sm`, `title_banner` (NULL ⇒ Presenter derives from title/category); add detail scalars used by FE (`issuer_name`, `securities_name`, `stapled_security_name`, `ann_*` fields including reference/description/disclaimer/dates/report/final year end); add sparse `addl_*` columns for `details.additional.*` keys the detail layout reads.

**Child tables:**

- `announcement_attachments` — name, url, sort_order  
- `announcement_related` — related items FE renders  
- `announcement_event_narratives` / `announcement_event_dates` / `announcement_event_venues` — ordered rows  

**Import:** map 1:1 from JSON; `state=published`; `sgx_reference` = `details.announcement.reference`; preserve `slug`.  
**Presenter:** rebuild top-level list fields + nested `details` (omit empty optional blocks).  
**Manual:** title, category, filed_at, summary required; nested optional (FE hides missing blocks).

### Sync, import, publish → alert

1. **Importer (spark/CLI):** load `announcements.json` → upsert by slug (or reference); full columns + children; Published; audit `import_json`; **no** email modal.  
2. **SGX sync:** write same schema; new → `pending_review`; hash change on Published → `needs_review`, **keep slug**; sync failure must not delete Published.  
3. **Publish success → modal** “Create Email Alert draft for this announcement?”  
   - Yes → draft alert: attach this id; subject=title; intro=summary; categories from announcement category (soft-fail empty audience + flash if unmapped); body includes `{{announcement}}`; redirect to alert edit.  
   - No → stay on announcement; CTA “Create Email Alert with this” remains.  
4. **Edges:** Publish failure → no modal; draft create failure → flash, announcement stays Published; already-Published / re-open → no auto-modal (manual CTA only); bulk import → no modals.

### FE, testing, launch

**FE**

- Presenter ≈ `announcements.json`; mapper thinned; never map SGX reference from slug.  
- List: existing flag + JSON fallback on API error.  
- Detail `[slug]`: when flag on, `GET /api/announcements/{slug}` (published-only); when off, keep JSON/SSG.  
- Do **not** flip flags in the schema/import PR.

**Tests**

- Importer fixture → Presenter snapshot vs sample press-release slug.  
- Sync mapping + slug stability on hash change.  
- Publish modal → draft prefill assertions.  
- Public API published-only.  
- FE mapper / flag path contract tests.

**Launch checklist**

1. Migrate + import on staging  
2. Diff key live slugs (including the placement press-release URL) Presenter vs JSON  
3. Enable `useAnnouncementsApi` on staging → QA  
4. Prod migrate + import → flip flag  

### Risks

- Full normalize is a large migration; child tables and sparse `addl_*` must stay aligned with `announcement-detail-content.js` — treat that component + JSON inventory as the contract.  
- Category name → subscriber category mapping for prefill may not be 1:1; soft-fail is intentional.  
- Accidental early flag flip shows incomplete data — gate remains explicit.

---

## Out of scope (this design)

- Flipping `showEmailAlerts` / public subscribe UX changes  
- Auto-send on publish  
- Editing every SGX nested field in CMS (read-only except summary + layout overrides)  
- Replacing Option A SGX client work already in progress (uncommitted) — integrate mapping into that client when implementing  
