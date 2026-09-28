# CodeIgniter 4 Application Starter

## What is CodeIgniter?

CodeIgniter is a PHP full-stack web framework that is light, fast, flexible and secure.
More information can be found at the [official site](https://codeigniter.com).

This repository holds a composer-installable app starter.
It has been built from the
[development repository](https://github.com/codeigniter4/CodeIgniter4).

More information about the plans for version 4 can be found in [CodeIgniter 4](https://forum.codeigniter.com/forumdisplay.php?fid=28) on the forums.

You can read the [user guide](https://codeigniter.com/user_guide/)
corresponding to the latest version of the framework.

## Installation & updates

`composer create-project codeigniter4/appstarter` then `composer update` whenever
there is a new release of the framework.

When updating, check the release notes to see if there are any changes you might need to apply
to your `app` folder. The affected files can be copied or merged from
`vendor/codeigniter4/framework/app`.

## Setup

Copy `env` to `.env` and tailor for your app, specifically the baseURL
and any database settings.

## FE-parity launch order

On a new environment, in this order:

1. `php spark migrate`
2. FE-parity baseline: `php spark announcements:import-json` (from `src/constants/announcements.json`) — this is the live-slug source of truth (full nested detail + attachments)
3. SGX sync (`php spark sgx:sync`) for ongoing/new items — list API + **HTML detail parse** from `source_url` (`links.sgx.com/.../corporate-announcements/...`) for description, designation, status, additional rows, and attachments. Disable with `sgx.fetchDetailHtml = false` if needed. Sync never wipes children when HTML is skipped/fails. JSON import remains the baseline for historical live slugs.
4. Staging: diff key slugs Presenter/API vs JSON (include the press-release placement slug)
5. Only then consider flipping `useAnnouncementsApi` (still **off** in repo)

## SGX sync cron

Daily 08:00 SGT (step 3 ongoing, not a substitute for step 2):

```
0 8 * * * TZ=Asia/Singapore cd /var/www/metaoptics-ir/backend && php spark sgx:sync >> /var/log/sgx-sync.log 2>&1
```

Optional extra SGX history: set `sgx.backfill = true`, run `php spark sgx:sync` once, then set `sgx.backfill = false`. This does not replace the JSON baseline.

## FE announcements JSON import

One-shot seed of Published CMS rows from the live site contract (`src/constants/announcements.json`). Keeps JSON slugs; does **not** prompt for Email Alerts.

```
cd backend && php spark announcements:import-json
# or: php spark announcements:import-json /absolute/path/to/announcements.json
```

Public API (`GET /api/announcements`, `GET /api/announcements/{slug}`) emits that same nested JSON shape. Frontend flags `useAnnouncementsApi` and `showEmailAlerts` stay **false** until staging diffs key slugs against the bundled JSON.

After **Publish to Website**, CMS may offer a prefilled Email Alert **draft** (attach + subject/intro + `{{announcement}}`). Declining or a draft failure leaves the announcement Published. Re-opening an already-published item does not auto-offer.

## Email workers

CMS **Email Alerts** are a separate entity from announcements (attach 1…N Published items, then schedule or Send now). `email:dispatch-scheduled` picks due scheduled alerts; `email:work` sends queued deliveries.

```
* * * * * TZ=Asia/Singapore cd /var/www/metaoptics-ir/backend && php spark email:work >> /var/log/email-work.log 2>&1
* * * * * TZ=Asia/Singapore cd /var/www/metaoptics-ir/backend && php spark email:dispatch-scheduled >> /var/log/email-dispatch.log 2>&1
```

### SGX source (real website API)

`sgx:sync` calls the same undocumented endpoints as [www.sgx.com](https://www.sgx.com/securities/company-announcements):

1. Load `sgx.appConfigURL` (default `https://www.sgx.com/config/appconfig.json`)
2. Fetch CMS token (`we_chat_qr_validator`, ROT13) → `authorizationToken` header
3. `GET {sgx.baseURL}/company/count` and `/company` with `value`, `exactsearch`, `pagestart` (**0-based page index**), `pagesize`

Example `.env`:

```
sgx.baseURL = 'https://api.sgx.com/announcements/v1.1'
sgx.companyCode = 'METAOPTICS LTD'
sgx.exactSearch = true
sgx.pageSize = 20
sgx.appConfigURL = 'https://www.sgx.com/config/appconfig.json'
sgx.backfill = false
sgx.fetchDetailHtml = true
```

`sgx.fetchDetailHtml` (default true): after the list fetch, sync GETs each item’s `url` on `links.sgx.com` and parses the announcement HTML (`dl/dt/dd` + attachment links) into FE detail fields. Soft-fails per item if HTML is unreachable.

SGX may change or block this without notice; licensing must be confirmed for production.

## Important Change with index.php

`index.php` is no longer in the root of the project! It has been moved inside the *public* folder,
for better security and separation of components.

This means that you should configure your web server to "point" to your project's *public* folder, and
not to the project root. A better practice would be to configure a virtual host to point there. A poor practice would be to point your web server to the project root and expect to enter *public/...*, as the rest of your logic and the
framework are exposed.

**Please** read the user guide for a better explanation of how CI4 works!

## Repository Management

We use GitHub issues, in our main repository, to track **BUGS** and to track approved **DEVELOPMENT** work packages.
We use our [forum](http://forum.codeigniter.com) to provide SUPPORT and to discuss
FEATURE REQUESTS.

This repository is a "distribution" one, built by our release preparation script.
Problems with it can be raised on our forum, or as issues in the main repository.

## Server Requirements

PHP version 8.2 or higher is required, with the following extensions installed:

- [intl](http://php.net/manual/en/intl.requirements.php)
- [mbstring](http://php.net/manual/en/mbstring.installation.php)

> [!WARNING]
> - The end of life date for PHP 7.4 was November 28, 2022.
> - The end of life date for PHP 8.0 was November 26, 2023.
> - The end of life date for PHP 8.1 was December 31, 2025.
> - If you are still using below PHP 8.2, you should upgrade immediately.
> - The end of life date for PHP 8.2 will be December 31, 2026.

Additionally, make sure that the following extensions are enabled in your PHP:

- json (enabled by default - don't turn it off)
- [mysqlnd](http://php.net/manual/en/mysqlnd.install.php) if you plan to use MySQL
- [libcurl](http://php.net/manual/en/curl.requirements.php) if you plan to use the HTTP\CURLRequest library
