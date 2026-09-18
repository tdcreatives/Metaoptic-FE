# SGX Mirror staging checklist (CI4)

Manual checks on a production-like staging host. Backend: `php spark sgx:sync` from `backend/`. Public API: `GET /api/announcements`. Frontend: IR company announcements behind `useAnnouncementsApi`.

Digest send is out of scope (CMS/Email plans).

## Backfill once

- [ ] Set `sgx.backfill = true` in backend `.env`.
- [ ] Run `php spark sgx:sync` **once**.
- [ ] New rows land `published` with `published_at` set.
- [ ] No digest/campaign/email is created (backfill suppresses all email).
- [ ] Set `sgx.backfill = false` immediately after the successful run.

## Dedupe

- [ ] Run `php spark sgx:sync` again with unchanged SGX data.
- [ ] No duplicate announcements (`sgx_reference` unique).
- [ ] `new` count is 0; existing rows are not re-inserted.

## Incremental pending

- [ ] With `sgx.backfill = false`, introduce a new SGX item (or fixture) and sync.
- [ ] New items insert as `pending_review` (not published).
- [ ] CLI prints `digest_pending new_count=<n>` when `new_count > 0`.
- [ ] Hash change on an existing item updates payload, sets `needs_review=1`, and does **not** overwrite admin `summary`.

## Malformed failure

- [ ] Point the client at empty/malformed SGX JSON (or expire the session).
- [ ] Sync exits non-zero with `SYNC_FAILED:` (not empty success).
- [ ] A failed run is recorded; no partial unpublished upsert as “success”.
- [ ] `GET /api/announcements` still returns previously **published** rows only.

## Lock overlap

- [ ] Hold `GET_LOCK('sgx_sync', …)` (or start a long sync) and run a second `php spark sgx:sync`.
- [ ] Second process prints `Another sync is running` and exits error.
- [ ] After the first run releases the lock, a later sync acquires it and proceeds.

## API schema

- [ ] `GET /api/announcements` → `{ data: [...], meta: { page, page_size, total } }`.
- [ ] `GET /api/announcements/:slug` works for a published slug.
- [ ] Query params: `page`, `page_size` (max 50), `category`, `q`, `date_from`, `date_to`.
- [ ] Each `data[]` row has: `id`, `slug`, `title`, `category`, `issuer`, `filed_at`, `source_url`, `summary`, `published_at`.
- [ ] Response never includes `source_payload`, `source_hash`, `needs_review`, subscriber data, secrets, or internal errors.
- [ ] Pending/review rows are absent from the public list.
- [ ] CORS: allowed MetaOptics `Origin` gets `Access-Control-Allow-Origin`; others do not.

## FE flag on staging

- [ ] Staging `.env` has `NEXT_PUBLIC_IR_API_BASE` set to the CI4 `public/` origin.
- [ ] Keep `useAnnouncementsApi` **false** until slug/detail strategy is decided. Do not flip for merge or this staging deploy.
- [ ] With flag **off**: company announcements still render from JSON fallback.
- [ ] With flag **on** (only after that decision): list loads from `/api/announcements`; `filed_at` maps to Asia/Singapore date strings.
- [ ] Flag-on failure (API down) does not leak unpublished/internal fields to the page.

## Host / fetch contract

- [ ] Verify `CI_ENVIRONMENT=production` on the staging/production host (not `development`).
- [ ] Empty first page `{ok:true,total:0,items:[]}` **must fail** sync (`SgxFetchException`); never treat as success with zero items.
