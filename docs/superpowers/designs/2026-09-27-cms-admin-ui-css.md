# CMS Admin UI CSS Refresh + Root Redirect

**Date:** 2026-09-27  
**Status:** Design accepted (brainstorming)  
**Branch context:** `feat/sgx-mirror-ci4` (CI4 admin under `/admin`)

## Understanding summary

- Refresh CSS/layout for the full CI4 IR admin CMS (login, dashboard, announcements list/detail, sync history, settings) to a shadcn-like admin look with MetaOptics brand accent.
- `GET /` on the CI4 app always redirects to `/admin` (auth filter then sends unauthenticated users to `/admin/login`).
- Audience: internal IR operators (shared single admin account).
- Stay on server-rendered PHP views — no React, no real shadcn component library.

## Assumptions

- Scale remains small (≤5 admins, ≤20 announcements/month); a static CSS file is enough.
- One shared stylesheet; no Tailwind build/CDN pipeline for CI4 unless revisited later.
- CSRF, session cookie flags, login rate-limit, and Publish-before-Send logic stay unchanged.
- CI4 `welcome_message` at `/` is removed in favor of redirect (no public landing on the admin app).
- “shadcn-like” means design tokens and patterns (radius, borders, muted surfaces, buttons, tables, cards) — not React components.
- Desktop-first; tables may horizontal-scroll on small screens.
- No new dashboard metrics or list filters beyond what controllers already provide.

## Explicit non-goals

- Renaming routes from `/admin` to `/backend`
- Next.js admin / mounting shadcn React
- Flipping FE feature flags (`showEmailAlerts`, `useAnnouncementsApi`)
- Email Status dashboard polish from the Email plan
- Dark mode, charts, DataTables, new admin features

## Decision log

| Decision | Alternatives considered | Why chosen |
|----------|-------------------------|------------|
| Keep CI4 PHP views; CSS polish only | Next.js + shadcn; hybrid | Minimal stack change; CMS already shipped |
| Keep `/admin/*`; “backend” = CI4 app root | Rename URL to `/backend` | Matches existing routes, filters, tests |
| `GET /` always → `/admin` | Conditional auth-aware redirect from `/` | Simplest; `AdminAuthFilter` already handles login |
| Refresh **all** admin screens | Shell-only first; priority subset | User requested full pass |
| Brand accent + admin chrome | Neutral zinc-only; ultra-minimal CSS | Align with public site accent (e.g. `#D44C39`) |
| Approach 1: shared `admin.css` + layout shell | Tailwind CDN/build; per-page CSS | YAGNI, one maintainable surface |

## Final design

### Architecture

1. **Root redirect:** `App\Controllers\Home::index` returns `redirect()->to('/admin')`. Unauthenticated access to `/admin` (except login/logout routes) continues to use `AdminAuthFilter` → `/admin/login`. `/api/*` unchanged.
2. **Assets:** Add e.g. `backend/public/css/admin.css`. Link from `app/Views/admin/layout.php` (login uses same layout or a thin variant that still loads this CSS).
3. **Tokens (CSS variables):** `--background`, `--foreground`, `--muted`, `--border`, `--primary` (MetaOptics red `#D44C39` or nearest brand token), `--radius`, `--card`. Prefer system stack or a lightweight font already used on the public site without pulling the Next bundle.
4. **Shell:** Header with “MetaOptics IR Admin”, nav (Dashboard, Announcements, Sync history, Settings), logout POST + CSRF. Main content in a constrained container with shadcn-like density.

### Screen patterns

| Screen | Pattern |
|--------|---------|
| Login | Centered card (~400px), title, fields, primary button, error flash; no nav |
| Dashboard | Title + existing summary links/cards; CTA to Announcements |
| Announcements list | `.table`, status `.badge`, empty state line |
| Announcement detail | Card for summary/email fields; card for actions; Publish/Send/Archive buttons keep current enablement rules |
| Sync history / Settings | Same table/form patterns |

**CSS-only components:** `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-danger`, `.card`, `.table`, `.badge`, `.form-group`, `.input`, `.label`, `.flash` (success/error). Prefer zero new JS.

### Errors & edge cases

- Restyle session flash only; no new error taxonomy.
- Long titles wrap/truncate in tables.
- Empty lists: muted “No …” line.
- Optional: logged-in visit to `/admin/login` redirects to `/admin` (nice-to-have).

### Testing

- Feature/unit: `GET /` asserts redirect to `/admin`.
- Existing admin auth + CSRF tests remain green.
- Manual spot-check: login, list, detail, one mutating POST.
- Do not require visual regression suite; avoid asserting CSS class names in PHPUnit except optionally that layout links `admin.css`.

### Implementation notes (for later plan)

- Touch views under `backend/app/Views/admin/**` and `Home` controller; keep controller business logic intact.
- Follow ponytail: fewest files; one CSS file + layout + view class hooks + redirect.
- After implementation, run `graphify update .` for touched code.

## Risks

- Styling without enough markup wrappers → weak polish; wrap major blocks in `.card` / `.table`.
- Overusing primary red → limit `--primary` to primary CTAs.
