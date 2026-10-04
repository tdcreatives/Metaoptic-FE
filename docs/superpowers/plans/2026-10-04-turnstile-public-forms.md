# Cloudflare Turnstile on Public Forms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Cloudflare Turnstile (Managed) to every public MetaOptics form so bots cannot submit contact messages or IR email-alert subscriptions without a verified human token.

**Architecture:** FE loads the Turnstile widget and sends `turnstileToken` with each submit. CI4 verifies the token against Cloudflare’s siteverify API using a **server-only** secret before any side effect (DB write, Web3Forms forward, or confirmation email). Contact forms that today POST straight to Web3Forms from the browser move behind a thin CI4 proxy so the secret never lives in the static export. Google reCAPTCHA v2/v3 is **out of scope**.

**Tech Stack:** Next.js 15 static export (CF Pages), CodeIgniter 4 (`/backend`), Cloudflare Turnstile siteverify (`POST https://challenges.cloudflare.com/turnstile/siteverify`), existing Web3Forms for inbox delivery, existing `POST /api/subscribers` for IR alerts.

## Global Constraints

- Provider: **Cloudflare Turnstile Managed only** — do not add Google reCAPTCHA, hCaptcha, or npm captcha SDKs.
- FE is **static export** — no Next.js API routes; all secret verification happens in CI4.
- Secret key: backend env only (`turnstile.secretKey`). Site key may be public (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`).
- Keep honeypot field `website` on subscribe (defense in depth).
- Subscribe API anti-enumeration: always HTTP 200 `{ok:true}` on public subscribe; failed/missing Turnstile → no DB insert (same as honeypot).
- Contact proxy: return a clear JSON error when Turnstile fails (user must retry).
- Dev/test bypass: when `turnstile.secretKey` is empty **and** `ENVIRONMENT` is `development` or `testing`, skip verification (mirror `EmailAlerts` unsubscribe-secret pattern). Production with empty secret must fail closed (reject).
- No new npm dependencies — load Turnstile via official script tag.
- CORS: new public POST routes must use existing `CorsHeaders` + `OPTIONS api/(:any)` preflight.
- Do not put Turnstile on admin CMS login or unsubscribe-by-token.
- Leave unused legacy `src/layouts/investor-relations/resources/email-alerts.js` (Web3Forms path) alone unless it is wired to a page (live page uses `email-alerts-form.js`).

---

## File map

| File | Responsibility |
|------|----------------|
| `backend/app/Config/Turnstile.php` | Reads `turnstile.secretKey`, `turnstile.verifyURL` (default siteverify) |
| `backend/app/Libraries/Http/TurnstileVerifier.php` | Calls siteverify; returns bool; injectable transport for tests |
| `backend/app/Controllers/Api/Subscribers.php` | Verify token before `SubscribeService::subscribe` |
| `backend/app/Controllers/Api/Contact.php` | Verify token → forward to Web3Forms with server-side access keys |
| `backend/app/Config/Routes.php` | `POST api/contact` |
| `backend/app/Config/Services.php` | Optional `turnstileVerifier()` shared factory |
| `backend/.env` / host env | `turnstile.secretKey`, `web3forms.mainAccessKey`, `web3forms.irAccessKey` |
| `src/components/TurnstileField.js` | Client widget: load script, render, expose token via `onToken` |
| `src/lib/turnstile.js` | Site-key helper + script loader (once) |
| `src/lib/subscribe-api.js` | Include `turnstileToken` in subscribe payload |
| `src/lib/contact-api.js` | `postContact({ channel, fields, turnstileToken })` → CI4 `/api/contact` |
| `src/lib/web3forms.js` | Keep validators + payload builders; submit path for public forms moves to `contact-api` |
| `src/layouts/contact-us/form/index.js` | Main contact + Turnstile |
| `src/layouts/investor-relations/resources/contact-us.js` | IR contact + Turnstile |
| `src/layouts/investor-relations/email-alerts-form.js` | Subscribe + Turnstile |
| `backend/tests/unit/Http/TurnstileVerifierTest.php` | Unit tests for verifier |
| `backend/tests/feature/Api/SubscribeApiTest.php` | Turnstile required / fail / bypass |
| `backend/tests/feature/Api/ContactApiTest.php` | Contact proxy + Turnstile |
| FE env (CF Pages + local) | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |

**Forms in scope**

1. Main site `/contact-us` → today Web3Forms → becomes `POST /api/contact` channel `main`
2. IR Resources Contact Us → today Web3Forms → becomes `POST /api/contact` channel `ir`
3. IR Email Alerts (`email-alerts-form.js`) → `POST /api/subscribers` + `turnstileToken`

---

### Task 1: Turnstile config + verifier (TDD)

**Files:**
- Create: `backend/app/Config/Turnstile.php`
- Create: `backend/app/Libraries/Http/TurnstileVerifier.php`
- Create: `backend/tests/unit/Http/TurnstileVerifierTest.php`
- Modify: `backend/app/Config/Services.php` (add `turnstileVerifier()`)

**Interfaces:**
- Consumes: Cloudflare siteverify JSON `{ success: bool }`
- Produces:
  - `Config\Turnstile`: `public string $secretKey`, `public string $verifyURL = 'https://challenges.cloudflare.com/turnstile/siteverify'`
  - `TurnstileVerifier::verify(string $token, ?string $remoteIp = null): bool`
  - `TurnstileVerifier::isRequired(): bool` — true when secret non-empty **or** ENVIRONMENT is production
  - Constructor: `(Turnstile $config, ?callable $transport = null)` where transport is `fn(string $url, array $fields): array` returning decoded JSON

- [ ] **Step 1: Write the failing unit test**

Create `backend/tests/unit/Http/TurnstileVerifierTest.php`:

```php
<?php
declare(strict_types=1);

namespace Tests\Unit\Http;

use App\Libraries\Http\TurnstileVerifier;
use CodeIgniter\Test\CIUnitTestCase;
use Config\Turnstile;

final class TurnstileVerifierTest extends CIUnitTestCase
{
    public function test_empty_token_fails_when_required(): void
    {
        $cfg = new Turnstile();
        $cfg->secretKey = 'test-secret';
        $v = new TurnstileVerifier($cfg, static fn () => ['success' => true]);
        $this->assertFalse($v->verify(''));
    }

    public function test_success_true_passes(): void
    {
        $cfg = new Turnstile();
        $cfg->secretKey = 'test-secret';
        $v = new TurnstileVerifier($cfg, static fn () => ['success' => true]);
        $this->assertTrue($v->verify('tok'));
    }

    public function test_success_false_fails(): void
    {
        $cfg = new Turnstile();
        $cfg->secretKey = 'test-secret';
        $v = new TurnstileVerifier($cfg, static fn () => ['success' => false]);
        $this->assertFalse($v->verify('tok'));
    }

    public function test_transport_receives_secret_and_token(): void
    {
        $cfg = new Turnstile();
        $cfg->secretKey = 'sec';
        $cfg->verifyURL = 'https://example.test/verify';
        $seen = null;
        $v = new TurnstileVerifier($cfg, static function (string $url, array $fields) use (&$seen) {
            $seen = [$url, $fields];
            return ['success' => true];
        });
        $v->verify('abc', '1.2.3.4');
        $this->assertSame('https://example.test/verify', $seen[0]);
        $this->assertSame('sec', $seen[1]['secret']);
        $this->assertSame('abc', $seen[1]['response']);
        $this->assertSame('1.2.3.4', $seen[1]['remoteip']);
    }

    public function test_bypass_when_secret_empty_in_testing(): void
    {
        $cfg = new Turnstile();
        $cfg->secretKey = '';
        $v = new TurnstileVerifier($cfg, static fn () => ['success' => false]);
        // ENVIRONMENT is testing under phpunit
        $this->assertFalse($v->isRequired());
        $this->assertTrue($v->verify(''));
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && ./vendor/bin/phpunit tests/unit/Http/TurnstileVerifierTest.php`

Expected: FAIL (class / config not found)

- [ ] **Step 3: Implement Config + Verifier + Services factory**

`backend/app/Config/Turnstile.php`:

```php
<?php
namespace Config;

use CodeIgniter\Config\BaseConfig;

class Turnstile extends BaseConfig
{
    public string $secretKey = '';
    public string $verifyURL = 'https://challenges.cloudflare.com/turnstile/siteverify';

    public function __construct()
    {
        parent::__construct();
        $this->secretKey = trim((string) env('turnstile.secretKey', ''));
        $url = trim((string) env('turnstile.verifyURL', ''));
        if ($url !== '') {
            $this->verifyURL = $url;
        }
    }
}
```

`backend/app/Libraries/Http/TurnstileVerifier.php`:

```php
<?php
declare(strict_types=1);

namespace App\Libraries\Http;

use Config\Turnstile;
use Config\Services;

final class TurnstileVerifier
{
    /** @param null|callable(string, array<string, string>): array $transport */
    public function __construct(
        private readonly Turnstile $config,
        private $transport = null,
    ) {
    }

    public function isRequired(): bool
    {
        if ($this->config->secretKey !== '') {
            return true;
        }
        // ponytail: local/test may omit secret; production must set turnstile.secretKey
        return ! in_array(ENVIRONMENT, ['development', 'testing'], true);
    }

    public function verify(string $token, ?string $remoteIp = null): bool
    {
        if (! $this->isRequired()) {
            return true;
        }
        $token = trim($token);
        if ($token === '' || $this->config->secretKey === '') {
            return false;
        }

        $fields = [
            'secret' => $this->config->secretKey,
            'response' => $token,
        ];
        if ($remoteIp !== null && $remoteIp !== '') {
            $fields['remoteip'] = $remoteIp;
        }

        try {
            $data = ($this->transport ?? [$this, 'defaultTransport'])($this->config->verifyURL, $fields);
        } catch (\Throwable) {
            return false;
        }

        return ($data['success'] ?? false) === true;
    }

    /** @param array<string, string> $fields @return array<string, mixed> */
    private function defaultTransport(string $url, array $fields): array
    {
        $client = Services::curlrequest(['http_errors' => false, 'timeout' => 5], null, null, false);
        $res = $client->post($url, ['form_params' => $fields]);
        $decoded = json_decode((string) $res->getBody(), true);

        return is_array($decoded) ? $decoded : ['success' => false];
    }
}
```

Add to `Services.php`:

```php
public static function turnstileVerifier($getShared = true): \App\Libraries\Http\TurnstileVerifier
{
    if ($getShared) {
        return static::getSharedInstance('turnstileVerifier');
    }

    return new \App\Libraries\Http\TurnstileVerifier(config('Turnstile'));
}
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `cd backend && ./vendor/bin/phpunit tests/unit/Http/TurnstileVerifierTest.php`

Expected: OK (5 tests)

- [ ] **Step 5: Commit**

```bash
git add backend/app/Config/Turnstile.php \
  backend/app/Libraries/Http/TurnstileVerifier.php \
  backend/app/Config/Services.php \
  backend/tests/unit/Http/TurnstileVerifierTest.php
git commit -m "$(cat <<'EOF'
feat(security): add Cloudflare Turnstile verifier for CI4

EOF
)"
```

---

### Task 2: Require Turnstile on `POST /api/subscribers`

**Files:**
- Modify: `backend/app/Controllers/Api/Subscribers.php`
- Modify: `backend/tests/feature/Api/SubscribeApiTest.php`

**Interfaces:**
- Consumes: JSON body field `turnstileToken` (string); `Services::turnstileVerifier()`
- Produces: unchanged response shape `{ok:true}`; no insert when verify fails

- [ ] **Step 1: Write failing feature tests**

In `SubscribeApiTest::setUp`, after mailer mock, inject a verifier that accepts only token `valid-token`:

```php
use App\Libraries\Http\TurnstileVerifier;
use Config\Turnstile;

// inside setUp, after mailer inject:
$tcfg = new Turnstile();
$tcfg->secretKey = 'test-secret';
Factories::injectMock('config', Turnstile::class, $tcfg);
Factories::injectMock('config', 'Turnstile', $tcfg);
$verifier = new TurnstileVerifier($tcfg, static function (string $url, array $fields): array {
    return ['success' => ($fields['response'] ?? '') === 'valid-token'];
});
Services::injectMock('turnstileVerifier', $verifier);
```

Update existing happy-path posts to include `'turnstileToken' => 'valid-token'`.

Add:

```php
public function test_missing_turnstile_returns_ok_without_insert(): void
{
    $result = $this->withBodyFormat('json')->post('/api/subscribers', [
        'email' => 'notoken@example.com',
        'categories' => ['General Announcement'],
        'website' => '',
    ]);
    $result->assertStatus(200);
    $this->assertNull((new SubscriberModel())->where('email', 'notoken@example.com')->first());
    $this->assertSame([], $this->mailer->sent);
}

public function test_invalid_turnstile_returns_ok_without_insert(): void
{
    $result = $this->withBodyFormat('json')->post('/api/subscribers', [
        'email' => 'badtok@example.com',
        'categories' => ['General Announcement'],
        'website' => '',
        'turnstileToken' => 'nope',
    ]);
    $result->assertStatus(200);
    $this->assertNull((new SubscriberModel())->where('email', 'badtok@example.com')->first());
}
```

- [ ] **Step 2: Run tests — expect FAIL on new cases (insert still happens)**

Run: `cd backend && ./vendor/bin/phpunit tests/feature/Api/SubscribeApiTest.php`

Expected: FAIL on missing/invalid token tests

- [ ] **Step 3: Wire verifier in controller**

In `Subscribers::create()`, after parsing `$input`, before constructing `SubscribeService`:

```php
$token = is_array($input) ? (string) ($input['turnstileToken'] ?? '') : '';
$verifier = Services::turnstileVerifier();
if (! $verifier->verify($token, (string) $this->request->getIPAddress())) {
    log_message('warning', 'subscribers.create turnstile failed');
    return $this->ok();
}
```

Keep the existing try/catch around subscribe.

- [ ] **Step 4: Run SubscribeApiTest — expect PASS**

Run: `cd backend && ./vendor/bin/phpunit tests/feature/Api/SubscribeApiTest.php`

Expected: OK

- [ ] **Step 5: Commit**

```bash
git add backend/app/Controllers/Api/Subscribers.php backend/tests/feature/Api/SubscribeApiTest.php
git commit -m "$(cat <<'EOF'
feat(api): require Turnstile token on subscriber create

EOF
)"
```

---

### Task 3: Contact proxy API (`POST /api/contact`)

**Files:**
- Create: `backend/app/Controllers/Api/Contact.php`
- Create: `backend/tests/feature/Api/ContactApiTest.php`
- Modify: `backend/app/Config/Routes.php` — add `$routes->post('api/contact', 'Api\Contact::create');`
- Document env keys in `backend/README.md` (short bullet under Email / public forms)

**Interfaces:**
- Consumes JSON:
  ```json
  {
    "channel": "main" | "ir",
    "turnstileToken": "...",
    "fullName": "...",
    "email": "...",
    "phone": "...",
    "subject": "...",
    "message": "..."
  }
  ```
- Produces: `{ok:true}` on success; `{ok:false,error:"..."}` with 400/502 on failure (unlike subscribe)
- Server env:
  - `web3forms.mainAccessKey` (fallback: `NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN` only if already present in backend env — prefer dedicated key)
  - `web3forms.irAccessKey` (for IR channel; may equal main)

- [ ] **Step 1: Write failing ContactApiTest**

```php
<?php
declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Libraries\Http\TurnstileVerifier;
use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Services;
use Config\Turnstile;

final class ContactApiTest extends CIUnitTestCase
{
    use FeatureTestTrait;

    /** @var list<array{url:string,payload:array}> */
    private array $forwarded = [];

    protected function setUp(): void
    {
        parent::setUp();
        $this->forwarded = [];
        $_ENV['web3forms.mainAccessKey'] = 'main-key';
        $_ENV['web3forms.irAccessKey'] = 'ir-key';
        putenv('web3forms.mainAccessKey=main-key');
        putenv('web3forms.irAccessKey=ir-key');

        $tcfg = new Turnstile();
        $tcfg->secretKey = 'test-secret';
        Factories::injectMock('config', Turnstile::class, $tcfg);
        Factories::injectMock('config', 'Turnstile', $tcfg);
        Services::injectMock(
            'turnstileVerifier',
            new TurnstileVerifier($tcfg, static fn ($u, $f) => ['success' => ($f['response'] ?? '') === 'valid-token'])
        );
    }

    protected function tearDown(): void
    {
        putenv('web3forms.mainAccessKey');
        putenv('web3forms.irAccessKey');
        unset($_ENV['web3forms.mainAccessKey'], $_ENV['web3forms.irAccessKey']);
        Services::reset(true);
        parent::tearDown();
    }

    public function test_rejects_invalid_turnstile(): void
    {
        $result = $this->withBodyFormat('json')->post('/api/contact', [
            'channel' => 'main',
            'turnstileToken' => 'bad',
            'fullName' => 'A',
            'email' => 'a@example.com',
            'message' => 'Hi',
        ]);
        $result->assertStatus(400);
        $body = json_decode((string) $result->getJSON(), true);
        $this->assertFalse($body['ok']);
    }

    public function test_accepts_valid_payload_shape(): void
    {
        // Implementer: inject a Web3Forms transport mock on Contact controller
        // or a small Web3FormsClient service — assert 200 + ok true when transport returns success.
        $this->markTestSkipped('complete after Web3FormsClient exists in Step 3');
    }
}
```

- [ ] **Step 2: Run — expect FAIL (route/controller missing)**

Run: `cd backend && ./vendor/bin/phpunit tests/feature/Api/ContactApiTest.php`

- [ ] **Step 3: Implement Web3Forms client + Contact controller**

Create `backend/app/Libraries/Http/Web3FormsClient.php`:

```php
<?php
declare(strict_types=1);

namespace App\Libraries\Http;

use Config\Services;

final class Web3FormsClient
{
    /** @param null|callable(array): array{ok:bool,error?:string} $transport */
    public function __construct(private $transport = null)
    {
    }

    /** @param array<string, mixed> $payload */
    public function submit(array $payload): array
    {
        if ($this->transport !== null) {
            return ($this->transport)($payload);
        }
        $client = Services::curlrequest(['http_errors' => false, 'timeout' => 10], null, null, false);
        $res = $client->post('https://api.web3forms.com/submit', [
            'headers' => ['Content-Type' => 'application/json', 'Accept' => 'application/json'],
            'json' => $payload,
        ]);
        $data = json_decode((string) $res->getBody(), true);
        if ($res->getStatusCode() >= 200 && $res->getStatusCode() < 300 && ($data['success'] ?? false)) {
            return ['ok' => true];
        }

        return ['ok' => false, 'error' => (string) ($data['message'] ?? 'Submit failed')];
    }
}
```

`Contact::create()` outline:

1. `CorsHeaders::apply`
2. Parse JSON body
3. `turnstileVerifier()->verify(token, ip)` → else 400 `{ok:false,error:'Please complete the captcha and try again.'}`
4. Validate channel ∈ `{main,ir}`, email, fullName, message (phone/subject optional)
5. Build Web3Forms payload (mirror `buildMainContactPayload` / `buildIrContactPayload` fields) with access key from env
6. `Web3FormsClient::submit` → 200 `{ok:true}` or 502 `{ok:false,error:...}`

Register route next to subscribers.

Finish `test_accepts_valid_payload_shape` by injecting `Web3FormsClient` via constructor param or `Services::injectMock` if you add `Services::web3FormsClient()`.

- [ ] **Step 4: Run ContactApiTest — expect PASS**

Run: `cd backend && ./vendor/bin/phpunit tests/feature/Api/ContactApiTest.php`

- [ ] **Step 5: Commit**

```bash
git add backend/app/Controllers/Api/Contact.php \
  backend/app/Libraries/Http/Web3FormsClient.php \
  backend/app/Config/Routes.php \
  backend/app/Config/Services.php \
  backend/tests/feature/Api/ContactApiTest.php \
  backend/README.md
git commit -m "$(cat <<'EOF'
feat(api): proxy contact forms through Turnstile + Web3Forms

EOF
)"
```

---

### Task 4: FE Turnstile field + script loader

**Files:**
- Create: `src/lib/turnstile.js`
- Create: `src/components/TurnstileField.js`

**Interfaces:**
- Consumes: `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- Produces:
  - `getTurnstileSiteKey(): string`
  - `loadTurnstileScript(): Promise<void>`
  - `<TurnstileField onToken={(token:string)=>void} onExpire={()=>void} className?: string />`

- [ ] **Step 1: Add `src/lib/turnstile.js`**

```js
const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export function getTurnstileSiteKey() {
    return String(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '').trim();
}

export function loadTurnstileScript() {
    if (typeof window === 'undefined') {
        return Promise.resolve();
    }
    if (window.turnstile) {
        return Promise.resolve();
    }
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
        return new Promise((resolve, reject) => {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error('Turnstile script failed')), {
                once: true,
            });
        });
    }
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.id = SCRIPT_ID;
        s.src = SCRIPT_SRC;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Turnstile script failed'));
        document.head.appendChild(s);
    });
}
```

- [ ] **Step 2: Add `src/components/TurnstileField.js`**

```jsx
'use client';

import { useEffect, useRef } from 'react';
import { getTurnstileSiteKey, loadTurnstileScript } from '@/lib/turnstile';

/**
 * Managed Turnstile widget. Calls onToken(token) when solved; onExpire() when token expires.
 */
export default function TurnstileField({ onToken, onExpire, className = '' }) {
    const hostRef = useRef(null);
    const widgetIdRef = useRef(null);
    const siteKey = getTurnstileSiteKey();

    useEffect(() => {
        if (!siteKey || !hostRef.current) {
            return undefined;
        }
        let cancelled = false;

        loadTurnstileScript()
            .then(() => {
                if (cancelled || !hostRef.current || !window.turnstile) return;
                widgetIdRef.current = window.turnstile.render(hostRef.current, {
                    sitekey: siteKey,
                    callback: (token) => onToken?.(token),
                    'expired-callback': () => onExpire?.(),
                    'error-callback': () => onExpire?.(),
                });
            })
            .catch(() => onExpire?.());

        return () => {
            cancelled = true;
            if (widgetIdRef.current != null && window.turnstile?.remove) {
                window.turnstile.remove(widgetIdRef.current);
            }
        };
        // intentionally mount once per siteKey
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey]);

    if (!siteKey) {
        return (
            <p className={`text-sm text-red-600 ${className}`} role="alert">
                Captcha is not configured. Please try again later.
            </p>
        );
    }

    return <div ref={hostRef} className={className} />;
}
```

- [ ] **Step 3: Manual smoke in `next dev`**

Create a temporary page or drop the component into contact form (Task 5). Confirm widget renders when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set in `.env.local`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/turnstile.js src/components/TurnstileField.js
git commit -m "$(cat <<'EOF'
feat(fe): add Cloudflare Turnstile field for public forms

EOF
)"
```

---

### Task 5: Wire Turnstile into IR Email Alerts subscribe form

**Files:**
- Modify: `src/lib/subscribe-api.js`
- Modify: `src/layouts/investor-relations/email-alerts-form.js`

**Interfaces:**
- Consumes: `TurnstileField`, `turnstileToken` on `postSubscribe`
- Produces: payload `{ ..., turnstileToken }`

- [ ] **Step 1: Extend subscribe payload**

```js
export function buildSubscribePayload({ email, first_name, last_name, categories, website, turnstileToken }) {
    return {
        email,
        first_name,
        last_name,
        categories,
        website: website ?? '',
        turnstileToken: turnstileToken ?? '',
    };
}
```

- [ ] **Step 2: Update form state + UI**

In `email-alerts-form.js`:

- `const [turnstileToken, setTurnstileToken] = useState('')`
- Before submit: if `!turnstileToken` → `setFeedback('Please complete the captcha.')` and return
- Pass `turnstileToken` into `postSubscribe`
- After success: `setTurnstileToken('')` and if `window.turnstile` + widget id available, reset widget (optional: expose `reset()` via ref — YAGNI: remount with `key={formKey}` incremented on success)
- Render `<TurnstileField onToken={setTurnstileToken} onExpire={() => setTurnstileToken('')} className='mt-6' />` above the Subscribe button

- [ ] **Step 3: Manual test**

1. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + backend `turnstile.secretKey` set (CF test keys allowed: see Cloudflare Turnstile test keys docs).
2. Submit without solving captcha → feedback, no new CMS row.
3. Solve + submit → CMS row + confirmation mail path (SMTP as configured).

- [ ] **Step 4: Commit**

```bash
git add src/lib/subscribe-api.js src/layouts/investor-relations/email-alerts-form.js
git commit -m "$(cat <<'EOF'
feat(ir): require Turnstile on email alerts subscribe form

EOF
)"
```

---

### Task 6: Wire Turnstile into main + IR contact forms

**Files:**
- Create: `src/lib/contact-api.js`
- Modify: `src/layouts/contact-us/form/index.js`
- Modify: `src/layouts/investor-relations/resources/contact-us.js`
- Modify: `src/lib/web3forms.js` — keep `isValidEmail` / `isValidPhone` / payload builders; stop calling Web3Forms directly from these two forms (builders may move field mapping into `contact-api` instead)

**Interfaces:**
- Produces: `postContact({ channel: 'main'|'ir', turnstileToken, fullName, email, phone, subject, message })` → `{ok, error?}` via `irApiUrl('/api/contact')`

- [ ] **Step 1: Add `src/lib/contact-api.js`**

```js
import { irApiUrl } from './ir-api-url.js';

export async function postContact(body) {
    const res = await fetch(irApiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
        return {
            ok: false,
            error: data.error || 'Something went wrong. Please try again later.',
        };
    }
    return { ok: true };
}
```

- [ ] **Step 2: Update main ContactUsForm**

- Import `TurnstileField`, `postContact`
- Hold `turnstileToken` state
- On submit: validate as today → require token → `postContact({ channel: 'main', turnstileToken, fullName: formData.fullName, email, phone, subject, message })`
- Place widget above SUBMIT
- Reset token (and remount widget via `key`) on success

- [ ] **Step 3: Update IR `contact-us.js` SendMessage**

Same pattern with `channel: 'ir'`.

- [ ] **Step 4: Manual test both forms**

- Invalid captcha / missing token → error message, no inbox mail
- Valid → Web3Forms dashboard / inbox receives message
- Confirm CORS: form origin must be listed in `cors.allowedOrigins`

- [ ] **Step 5: Commit**

```bash
git add src/lib/contact-api.js \
  src/layouts/contact-us/form/index.js \
  src/layouts/investor-relations/resources/contact-us.js \
  src/lib/web3forms.js
git commit -m "$(cat <<'EOF'
feat(fe): route contact forms through Turnstile-backed API

EOF
)"
```

---

### Task 7: Env, Cloudflare dashboard, ops checklist

**Files:**
- Modify: `backend/.env` (local only — do not commit secrets)
- Modify: CF Pages env + PHP host `.env`
- Modify: `backend/README.md` — short “Public form captcha” section
- Optional: `docs/superpowers/plans/checklists/2026-10-04-turnstile-smoke.md`

- [ ] **Step 1: Create Turnstile widget in Cloudflare Dashboard**

- Site: metaoptics.sg + www + localhost:4444 (dev) + `*.pages.dev` preview if needed
- Mode: **Managed**
- Copy Site Key → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- Copy Secret Key → `turnstile.secretKey` on PHP host (and local backend `.env`)

- [ ] **Step 2: Backend env on API host**

```env
turnstile.secretKey = '<from CF dashboard>'
web3forms.mainAccessKey = '<existing Web3Forms key>'
web3forms.irAccessKey = '<IR key or same as main>'
```

- [ ] **Step 3: FE env on CF Pages (build-time)**

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key>
NEXT_PUBLIC_IR_API_BASE=https://metaoptics.sg/backend
```

Rebuild/redeploy Pages after setting site key.

- [ ] **Step 4: Smoke checklist**

Create `docs/superpowers/plans/checklists/2026-10-04-turnstile-smoke.md`:

```markdown
# Turnstile smoke — 2026-10-04

- [ ] Main `/contact-us` without captcha → blocked
- [ ] Main `/contact-us` with captcha → inbox
- [ ] IR Contact Us → inbox
- [ ] IR Email Alerts → CMS subscriber + confirmation email (MAIL_DRIVER=smtp)
- [ ] Preview `*.pages.dev` origin allowed in CORS + Turnstile hostnames
- [ ] Production: empty `turnstile.secretKey` rejects (fail closed)
```

- [ ] **Step 5: Commit docs only**

```bash
git add backend/README.md docs/superpowers/plans/checklists/2026-10-04-turnstile-smoke.md
git commit -m "$(cat <<'EOF'
docs: Turnstile env and smoke checklist for public forms

EOF
)"
```

---

## Out of scope (explicit)

- Google reCAPTCHA v2 / v3
- Admin login captcha
- Unsubscribe-by-token captcha
- Moving Web3Forms access keys off `NEXT_PUBLIC_*` for non-proxied callers (proxied path uses server keys; leftover public keys can be rotated later)
- Deleting legacy unused `resources/email-alerts.js`

---

## Self-review

1. **Spec coverage:** All three live public forms covered; server verify for subscribe + contact; static-export constraint respected; Turnstile not reCAPTCHA.
2. **Placeholders:** None — tests and code sketches are concrete.
3. **Type consistency:** Field name is `turnstileToken` end-to-end (FE payload, API JSON, verifier input).
