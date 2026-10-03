# IR Ship Readiness (local / code-only) — 1 Oct 2026

> **Scope:** Docs + offline checks that unblock staging handoff.  
> **Out of scope:** Deploy staging, cron, SMTP, TDC deps, flipping `useAnnouncementsApi` / `showEmailAlerts`.  
> **Branch:** `feat/sgx-mirror-ci4`  
> **Depends on:** Mirror / CMS / Email / FE↔CMS parity already COMPLETE on this branch.

**Client scope:** `docs/IR_SGX_MIRROR_CMS_EMAIL_CLIENT_SCOPE_EN.md` (revised 28 Sep — Email Alert = separate entity)  
**Shepherd:** `.cursor/rules/project-shepherd.mdc`

## Global constraints

- Do **not** set `useAnnouncementsApi` or `showEmailAlerts` to `true`.
- Do **not** invent staging deploy steps that need host credentials.
- Prefer smallest diff; no new dependencies.
- Staging checklists must match **current** product rules: Publish before Email Alert; no Send on announcement detail; one announcement may attach to many alerts.
- Public API shape is **FE-parity Presenter** (`id`, `title`, `title_btn`, `title_btn_sm`, `title_banner`, `slug`, `desc`, `date`, `details`, `category`) — not the older flat `filed_at`/`summary`/`issuer` checklist wording.
- API `page_size` cap is **100** (not 50).
- History seed is **JSON import first**, then SGX sync (not backfill-only).

---

## Task 1: Align CMS staging checklist with Email Alert entity

**Files:**
- Modify: `docs/superpowers/plans/checklists/2026-09-18-ir-cms-staging.md`

**What to change:**
1. Replace sections **Send gate** and **One campaign** (they assume Send on announcement + unique one campaign per announcement — obsolete).
2. New sections matching client scope §4–5:
   - After Publish, CMS **may** offer prefilled Email Alert **draft** (optional; failure does not un-publish).
   - Announcement detail has **no Send**.
   - **Create Email Alert with this** only when Published.
   - Email Alerts compose: attach **1…N Published** announcements; schedule or Send now; delivery report exists.
   - One announcement may appear on **many** Email Alerts.
3. Update **Summary edit** bullets: FE fields / summary are editable; SGX `source_payload` / source title remain immutable. Drop insistence that only `email_subject`/`email_intro` are edited on announcement detail (compose lives on Email Alert). Keep a check that forbidden fields (`source_payload`, `state`, `title` from SGX) cannot be overwritten via the detail update POST.
4. Keep Login / Cookie / Publish → API / Recipients / Sync runs / Archive sections; tweak intro line if it still says digest-only until Email plan.

**Done when:** Checklist has no “Send on announcement” / `campaign_exists` / unique-one-campaign wording; Email Alert entity checks are present; commit docs only.

**Commit:** `docs: align CMS staging checklist with Email Alert entity`

---

## Task 2: Align SGX Mirror staging checklist (JSON-first + FE API shape)

**Files:**
- Modify: `docs/superpowers/plans/checklists/2026-09-18-sgx-mirror-staging.md`

**What to change:**
1. Prefaces **Backfill once** with **JSON-first history**: run `php spark announcements:import-json` before relying on SGX for baseline; import → Published, no investor emails; then daily/incremental sync. Keep backfill section as optional/legacy note or retitle so JSON-first is the primary path (client scope §3).
2. **API schema** section:
   - `page_size` max **100** (not 50).
   - Each `data[]` item matches Presenter FE shape: `id`, `title`, `title_btn`, `title_btn_sm`, `title_banner`, `slug`, `desc`, `date`, `details`, `category`.
   - Still forbids `source_payload`, `source_hash`, `needs_review`, secrets.
3. Keep FE flag guidance: `useAnnouncementsApi` stays **false** until slug-diff on staging.

**Done when:** Checklist matches Presenter + JSON-first + page_size 100; commit docs only.

**Commit:** `docs: align SGX Mirror staging checklist with FE API + JSON-first`

---

## Task 3: Offline announcement API↔FE parity self-check

**Goal:** Runnable without staging host. Validates Presenter-shaped rows map to legacy FE keys and JSON fixture has expected list keys.

**Files:**
- Create: `scripts/check-announcement-api-parity.mjs`
- Create or extend: `src/lib/announcements-api-parity.test.mjs` (or add cases to `src/lib/announcements-api.test.mjs` if smaller)
- Optionally wire: `package.json` script `"check:announcement-api-parity"`

**Behavior:**
1. Load `src/constants/announcements.json` (or first N items).
2. Assert every list item has: `id`, `slug`, `title`, `category`, `date`, `desc` (or equivalent used by list UI).
3. Build a **synthetic** Presenter-shaped API row (minimal `details.announcement` + layout titles) and run `mapApiAnnouncementToLegacy`; assert output has `id`, `slug`, `title`, `category`, `date`, `desc`, `details`.
4. Assert forbidden keys (`source_payload`, `source_hash`, `needs_review`) are absent from the mapped legacy object.
5. Exit non-zero on failure; print a one-line Pass summary on success.
6. Reuse `mapApiAnnouncementToLegacy` from `src/lib/announcements-api.js` — do not duplicate mapping logic.

**Tests:** Node test for the synthetic mapping + forbidden keys (TDD if adding new file).

**Done when:** `node scripts/check-announcement-api-parity.mjs` exits 0; focused node tests pass; flags untouched.

**Commit:** `test: offline announcement API↔FE parity check`

---

## Task 4: Index plan + shepherd pointer; verify flags stay off

**Files:**
- Modify: `docs/superpowers/plans/2026-09-18-README.md` — add row for this ship-readiness plan (order 4 / post-feature).
- Modify: `.cursor/rules/project-shepherd.mdc` — one line under Ops or snapshot pointing at this plan + staging checklists (no status rewrite beyond a pointer).
- Verify: `src/constants/ir-feature-flags.js` still has `useAnnouncementsApi: false` and `showEmailAlerts: false` (no flip).

**Done when:** Index links this plan; shepherd points agents at checklists + this plan; flags still false; commit.

**Commit:** `docs: index IR ship-readiness plan for staging handoff`

---

## Execution handoff

Use **Subagent-Driven Development**. After Task 4, stop — staging QA (Waves A–C) and flag flips (D) remain human/ops with TDC.
