# Turnstile smoke — 2026-10-04

Operator setup (not done in this repo; do not paste real keys here):

- [ ] Cloudflare Dashboard: Turnstile widget, **Managed**, hostnames `metaoptics.sg` + `www.metaoptics.sg` + `localhost:4444` + `*.pages.dev` if preview submits
- [ ] PHP host `.env`: `turnstile.secretKey`, `web3forms.mainAccessKey`, `web3forms.irAccessKey`
- [ ] Cloudflare Pages (then rebuild): `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_IR_API_BASE=https://metaoptics.sg/backend`
- [ ] Local `.env` optional; never commit secrets

Live checks:

- [ ] Main `/contact-us` without captcha → blocked
- [ ] Main `/contact-us` with captcha → inbox
- [ ] IR Contact Us → inbox
- [ ] IR Email Alerts → CMS subscriber + confirmation email (MAIL_DRIVER=smtp)
- [ ] Preview `*.pages.dev` origin allowed in CORS + Turnstile hostnames
- [ ] Production: empty `turnstile.secretKey` rejects (fail closed)
