# Backend host layout — Option A (clean `/backend` URLs)

**Date:** 3 Oct 2026  
**Goal:** Public URLs `https://metaoptics.sg/backend/api/...` and `/backend/admin` without `/public/index.php`, while keeping `app` / `vendor` / `writable` outside the web root.

Local PHPUnit / `php spark serve` stay on the full `backend/` tree in the repo — **no repo restructure**.

---

## Layout

```text
/home/<user>/
  apps/ir-backend/                 ← rsync of repo backend/ (full CI4)
    app/
    writable/
    vendor/
    public/                        ← only this is web-visible
      index.php                    ← paths stay ../app (unchanged)
      .htaccess                    ← enable: RewriteBase /backend/
      css/ js/
    .env
    spark
  public_html/                     ← domain document root (FE static upload optional)
    index.html …
    backend  → symlink to ../apps/ir-backend/public
```

One-time on host:

```bash
mkdir -p ~/apps
# after first rsync of backend → ~/apps/ir-backend
ln -sfn ~/apps/ir-backend/public ~/public_html/backend
```

---

## `.env` (production)

```ini
app.baseURL = 'https://metaoptics.sg/backend/'
app.indexPage = ''
cors.allowedOrigins = 'https://metaoptics.sg,https://www.metaoptics.sg'
admin.fePublicOrigin = 'https://metaoptics.sg'
email.publicSiteURL = 'https://metaoptics.sg'
fe.deployHookURL = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<UUID>'
```

In `apps/ir-backend/public/.htaccess` uncomment:

```apache
RewriteBase /backend/
```

---

## Local (unchanged)

```text
repo/backend/          # full tree
php spark serve        # or vhost → backend/public
./vendor/bin/phpunit
```

```ini
app.baseURL = 'http://localhost:8080/'
# app.indexPage = ''   # optional locally if rewrite hides index.php
# fe.deployHookURL =   # leave empty
```

---

## FE / CF Pages

```text
NEXT_PUBLIC_IR_API_BASE=https://metaoptics.sg/backend
```

Smoke:

- `GET https://metaoptics.sg/backend/api/announcements?page=1&page_size=1`
- `https://metaoptics.sg/backend/admin/login`

---

## Deploy sketch

```bash
rsync -az --delete \
  --exclude '.env' \
  --exclude 'writable/cache/*' \
  --exclude 'writable/logs/*' \
  --exclude 'writable/session/*' \
  ./backend/ user@host:apps/ir-backend/
# ensure symlink public_html/backend → apps/ir-backend/public still exists
```

Do **not** rsync the whole monorepo into `public_html/backend`.

---

## Related

- [CF Deploy Hook on Publish](./2026-10-03-cf-pages-deploy-hook-on-publish.md)
- Plan index: [2026-09-18-README.md](./2026-09-18-README.md)
