# SGX Sync Auto-Publish (env flag)

**Status:** design lock  
**Date:** 2026-10-20  
**Branch context:** `feat/sgx-mirror-ci4` (extends existing SGX sync + FeDeploy + AdminDigest)

## Understanding summary

- Add an `.env` flag so cron/`sgx:sync` can **auto-live** brand-new SGX announcements (skip admin CMS review).
- When enabled: new items → `published` + `live_at` → Cloudflare Pages deploy hook → admin digest with auto-publish copy.
- When disabled (default): keep today’s flow → `pending_review` + “review and publish” digest.
- Existing `pending_review` backlog is **not** bulk-published when the flag is turned on.
- Admin can still unpublish / preview via existing CMS after auto-live.
- **Non-goals:** investor Email Alerts automation; changing manual Publish / Publish-to-live-site UX beyond reuse of deploy hook.

## Assumptions

- Env key: `sgx.autoPublish` (bool, default `false`) on `Config\Sgx`.
- Same path for CLI cron and admin “Sync data now” (`SgxSyncRunner`).
- One CF hook call per sync run that auto-publishes (not per item).
- Empty `fe.deployHookURL` counts as deploy failure → rollback.
- `sgx.backfill=true` ignores auto-publish (existing backfill publish behavior unchanged).
- Unpublish/preview = existing CMS archive / live controls (no new UI).

## Decision log

| # | Decision | Alternatives | Why |
|---|----------|--------------|-----|
| 1 | Full live: `published` + `live_at` + CF rebuild | CMS-only publish (`live_at` null) | Client wants site live without second “Publish to live” click |
| 2 | Keep unpublish/preview in CMS after auto-live | Remove review surface | Admin safety net |
| 3 | Reuse admin digest; change copy by mode | Separate email product; dual emails | Already wired in `SgxSyncRunner` |
| 4 | Only **new** inserts this run | Also flush existing pending | Avoid surprising live of old backlog |
| 5 | No investor Email Alerts auto-send | Draft or auto-queue campaigns | Out of scope; keep manual alert flow |
| 6 | CF fail → rollback new ids to `pending_review` + failure digest | Keep live + log; or Ready without live | Prefer wrong-on-site over silent live without rebuild |
| 7 | Approach A: post-sync step after `SyncService` | Insert-live inside SyncService; reuse full `PublishToLiveSiteService::run()` | Clear rollback; don’t live **all** published Ready rows |

## Final design

### Config

- `Config\Sgx::$autoPublish` from `env('sgx.autoPublish', false)`.
- Reuse `Config\FeDeploy` / `FeDeployHook`.

### Data flow

```
SgxSyncRunner
  → SyncService.run()
       insert new (non-backfill) as pending_review
       SyncResult{…, newIds: list<int>}
  → if autoPublish && !backfill && newIds ≠ []:
       AutoPublishNewItems(newIds)
         UPDATE → published + published_at + live_at + needs_review=0
         FeDeployHook.trigger('sgx_auto_publish') once
         OK  → AdminDigestNotifier mode=auto_published
         FAIL→ UPDATE newIds → pending_review, clear published_at/live_at
              → AdminDigestNotifier mode=auto_publish_failed
  → else if !backfill && newCount > 0:
       AdminDigestNotifier mode=review (current copy)
```

### SyncResult

Extend with `newIds: list<int>` (ids inserted this run). Updated-only / hash-change rows stay out of `newIds` (they may set `needs_review=1` as today).

### Admin digest modes

| Mode | Intent |
|------|--------|
| `review` | Flag off — pending review (current template) |
| `auto_published` | Live + rebuild triggered; can unpublish in CMS |
| `auto_publish_failed` | Sync wrote rows then rollback; need manual review |

Pass real refs (e.g. `sgx_reference` / titles), not empty arrays.

### Explicit non-goals

- No auto investor campaigns.
- No bulk-live of historical `pending_review`.
- Do not call `PublishToLiveSiteService::run()` for this path (it lives **all** published rows).

### Test plan (minimum)

1. Flag off → `pending_review` + review digest.
2. Flag on + hook OK → `published`+`live_at`, one hook, auto_published digest.
3. Flag on + hook fail / empty URL → back to `pending_review`, auto_publish_failed digest.
4. Updates-only run → `newIds` empty → no auto-publish side effects.

## Implementation notes (for planning)

- Likely touch: `Config\Sgx`, `SyncResult`, `SyncService`, `SgxSyncRunner`, small `AutoPublishNewItems` (or equivalent), `AdminDigestNotifier` + `emails/admin_digest` (mode param), unit/feature tests around runner.
- Keep CF transport mockable in tests (same pattern as existing FeDeploy tests if any).
