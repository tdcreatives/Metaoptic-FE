# MOT News — split `/news` into two sections

Source: [MOT News (Notion)](https://tdcreatives.notion.site/MOT-News-3d53114b5952800fa54fd2cecc7220ad)

## Understanding summary

- Split the `/news` listing into two groups, reusing the current card. No new design.
- Purpose: customer wants media/news vs SGX-style announcements on the same page.
- Audience: site visitors on `/news`; editors keep using `src/constants/news.json`.
- Constraints: `/news` only; hide `NEWS & PRESS RELEASES` (do not delete); two group headings in the existing `BaseTitle` style (uppercase Futura condensed); six listed articles under SGX; remaining production articles under News; newest → oldest per group; two `mod: development` CES 2026 items stay hidden in production.
- Non-goals: homepage, IR/B2I, `announcements.json`, new SGX feed, deleting the old title, changing detail pages.

## Assumptions

- Static export, ~30 items, no pagination, no new API.
- Public content; no new security/privacy requirements.
- New articles default to **News** unless tagged SGX.
- Block order: News above, SGX Official Announcements below.
- Detail pages, related news, and homepage are unchanged.
- Stagger offset (`xl:mt-[100px]` when `index % 3 === 1`) resets per group.
- Match the six SGX items by **slug**, not by shortened Notion titles.

## Decision log

| Decision | Alternatives | Why |
|---|---|---|
| Scope = `/news` only | Also homepage / all `news.json` consumers | Customer chose A |
| Hide page title, do not delete | Remove title; replace with new page title | Customer: hide temporarily |
| Two CES 2026 extras stay `mod: development` | Show in News / hide via new flag | Already hidden in production |
| Group headings = existing title style, uppercase | Smaller Title Case headings | Customer chose A |
| New articles default to News | Infer SGX automatically | Confirmed assumption |
| `"section": "sgx"` on items; omit = News | Slug allowlist in JS; split JSON arrays | Explicit in the file editors already use |
| No `"section": "news"` backfill | Tag every item | YAGNI |
| Empty group: skip heading + grid | Empty-state copy | No empty group with current data |
| No new tests/framework | Automated suite | Manual checklist on `/news` |

## Final design

### Data

File: `src/constants/news.json`.

Optional field on top-level news objects only (not on `relatedNews`):

```json
"section": "sgx"
```

- `"section": "sgx"` → SGX Official Announcements
- Missing / anything else → News

Set `"section": "sgx"` on these slugs:

1. `metaoptics-update-on-proposed-nasdaq-dual-listing`
2. `metaoptics-announces-membership-in-stanford-engineerings-systemx-alliance-program-in-the-usa`
3. `metaoptics-provides-year-end-business-review-and-update`
4. `metaoptics-announces-strategic-share-placement-to-accelerate-growth-and-meet-rising-global-demand`
5. `2025-asia-innovation-cup`
6. `metaoptics-deploys-direct-laser-writer-in-taiwan-to-power-prototyping-and-production`

`shouldIncludeNewsItem` / `mod` is unchanged. Homepage, IR, and `[slug]` do not read `section`.

### UI

File: `src/layouts/news/list.js` only.

- Keep `BaseTitle` `NEWS & PRESS RELEASES` in JSX; add a hide class (`hidden`).
- Render two blocks (News, then SGX): `BaseTitle` + existing grid + `BaseNewsCard`.
- Heading copy: `NEWS`, `SGX OFFICIAL ANNOUNCEMENTS`.
- Per group: filter `mod` → split by `section` → sort by `date` descending → stagger from index 0.
- Spacing: reuse existing `gap-8` / `mt-8`. No new card variant, tabs, or pagination.

### Checks (manual, production-like `/news`)

1. Old title not visible; still in source.
2. Two uppercase group headings.
3. Exactly six SGX cards, newest first.
4. News group excludes those six; development-only CES items hidden.
5. Card click / detail unchanged.
6. Homepage still mixed latest 4 + old title.
7. Desktop stagger per group; mobile single column.

After code changes: `graphify update .`
