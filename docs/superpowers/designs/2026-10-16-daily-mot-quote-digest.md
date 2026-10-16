# Design: Daily MOT (9MT) stock quote digest

**Implemented plan:** [`2026-10-16-daily-mot-quote-digest.md`](../plans/2026-10-16-daily-mot-quote-digest.md) · **Ops cron checklist:** [`2026-10-16-quote-digest-cron.md`](../plans/checklists/2026-10-16-quote-digest-cron.md)

**Date:** 2026-10-16  
**Status:** Validated (brainstorming lock)  
**Architecture choice:** Separate scheduled Quote Digest job (not synthetic Email Alert campaigns)

---

## Understanding summary

- **What:** Daily MOT (SGX code **9MT**) stock-quote email at **16:00 Asia/Singapore** on **SGX trading days**, to subscribers opted into category **Press Release**.
- **Why:** Client wants Press Release subscribers to receive an afternoon market snapshot every trading day, independent of whether a press release was published that day.
- **Who:** Public Email Alerts subscribers with `Press Release`; IR/CMS ops view history/logs and receive failure alerts only.
- **Content:** Full session pack — last, prior close, change (+/− %), open/high/low, volume, traded value, as-of time; **no chart**; CTA to SGX 9MT page.
- **Pipeline:** Cron → SGX JSON fetch → retries → fan-out via existing mailer → CMS run log; on final fail skip subscriber send + alert admin digest recipients.
- **Constraints:** Unofficial SGX web API (can change); low frequency; reuse subscriber/unsubscribe/email infra.
- **Non-goals (v1):** Charts in email; paid SGX feed; kill switch / draft-approve; weekend/holiday sends (holidays TBD); gating on new PR filings.

---

## Assumptions

- Scale: tens–low hundreds of recipients; one batch/day.
- Reliability: best-effort; retries then skip; ops alerted; no subscriber apology email on failure.
- Security/privacy: same as existing alerts; unsubscribe required; no new PII stores.
- Maintenance: IR/CMS owns the job; API breakage fails closed for that day.
- Press Release category coexists with other categories; announcement Email Alerts remain unchanged (PR subscribers can still get campaign emails if an alert attaches a PR filing).
- 4PM is **intraday** (not official close); copy must say “as of …”, not “closing price”.
- Client accepts unofficial API risk for v1; paid feed later if SLA required.
- Holiday calendar: **v1 skips weekends only**; SG public holidays are a documented follow-up.
- SGX `vl` is in **thousands of shares**; display as `vl × 1000` shares.

---

## Decision log

| Decision | Choice | Alternatives considered | Why |
|---|---|---|---|
| Product intent | Daily quote every trading day | Only on PR days; separate opt-in | Client A |
| Audience | New catalog category `Press Release` | Map existing category; separate checkbox | Clear opt-in on subscribe form |
| Schedule | Trading days, 16:00 SGT | Every calendar day; manual extra trigger | Quote relevance |
| Data source | Unofficial SGX JSON (`securities/v1.1`, filter `nc=9MT`) | Paid feed; manual CMS paste | Available now; low frequency |
| Chart | None — numbers + SGX link | Embedded image; web-only chart CTA | Email-client reliability |
| Failure | Retry then skip + ops alert | Skip only; always email “unavailable” | Balance reliability vs noise |
| Ops control | Fully automatic + history logs | Kill switch; draft-approve | Client A |
| Email fields | Full session (lt, pv, Δ, o/h/l, vl, v) | Minimal / session snapshot | Client C |
| Architecture | Separate digest job | Synthetic daily Email Alert; ESP journey | YAGNI; clear boundary from campaigns |
| Primary CTA | SGX 9MT securities page | IR site only | Authoritative quote source |

---

## Final design

### 1. Email UX (subscriber-facing)

**Subject examples**

- `MetaOptics (9MT) — S$0.310 (+1.6%) as of 4:00pm SGT`
- Flat: `MetaOptics (9MT) — S$0.310 (unchanged) as of 4:00pm SGT`

**Preheader:** `Open, high, low, volume for today’s session · Not investment advice`

**Body (top → bottom)**

1. Existing MOT email chrome  
2. Title: “Daily stock update — MetaOptics Ltd (SGX: 9MT)”  
3. Hero: last price + change vs prior close (absolute + %); do not rely on color alone  
4. As-of: `As of {trading_time or send time} SGT · Intraday (not official close)`  
5. Plain HTML session table: Open · High · Low · Volume (shares) · Value (SGD)  
6. Single CTA → https://investors.sgx.com/market/securities?code=9MT&type=stocks&lang=en  
7. Short disclaimer: informational only; SGX source; may be delayed  
8. Footer: unsubscribe / manage preferences (existing)

**Rules:** text numbers (no images); send even if volume is 0 when quote valid; never label 4PM data as closing price.

### 2. Job & data flow

**Trigger:** Cron `16:00 Asia/Singapore`, trading-day gated.

**SGX endpoints**

- Current: `https://api.sgx.com/securities/v1.1?params=nc,lt,o,h,l,pv,c,vl,v,trading_time` → row where `nc == "9MT"`
- Historic charts API exists but **not used in v1** (no chart)

**Fields:** `lt`, `pv`, `o`, `h`, `l`, `vl`, `v`, `trading_time` (+ `c` if useful for validation)

**Steps**

1. Gate non-trading day → `skipped_non_trading_day`  
2. Fetch + validate (`lt`, `pv` numeric)  
3. Retry **16:05** and **16:15** on failure (idempotent day key `Y-m-d` SGT)  
4. Audience: active subscribers with `category_key = 'Press Release'`  
5. If zero recipients → `skipped_no_recipients` (no ops alert)  
6. Render + enqueue via existing mailer/worker; **at most one successful digest per SGT calendar day**  
7. Persist run log (status, snapshot JSON, counts, error)  
8. Final fail → alert admin digest recipients only

**Prerequisite:** Add `Press Release` to `CategoryCatalog` + FE subscribe form (exact same string).

### 3. CMS history & ops alerts

- Read-only admin page **Daily stock digest** (under Investor Emails or Settings).  
- Columns: Date · Status pill · Recipients · Last · Change · Finished · Error.  
- Detail: quote snapshot + delivery summary + error string.  
- Ops failure email: subject `Daily 9MT digest failed — {date}`; link to history row.  
- No nav badge for failures (email + red row enough).  
- No kill switch / compose in v1.

### 4. Edge cases

| Case | Behavior |
|---|---|
| Weekend | Skip, log `skipped_non_trading_day` |
| SG holiday | Follow-up: holiday list; v1 weekends-only |
| 0 recipients | `skipped_no_recipients`, no ops alert |
| Partial delivery fails | Run success if enqueue ok; per-recipient in delivery logs |
| Duplicate cron | Day-key idempotent; no second success |
| Bad/missing API fields | Fail + retry; never send blank prices |
| Volume `vl` | Display `vl × 1000` shares; footnote Source: SGX |
| Unsubscribed mid-day | Resolve audience at send time |
| API shape change | Fail closed |

### 5. Testing strategy

- Unit: parse/filter 9MT, change %, volume format, trading-day gate, day-key idempotency.  
- Unit: retry then ops alert; no subscriber mail on final fail.  
- Feature: catalog + subscribe accepts `Press Release`.  
- Smoke: mock SGX JSON → test recipient HTML with full field pack + unsubscribe.  
- Manual: clock freeze trading day 16:00 vs Sunday.

### 6. Follow-ups (explicitly out of v1)

- SG public holiday calendar for trading-day gate.  
- Kill switch in Settings.  
- Optional secondary CTA to MetaOptics IR stock page.  
- Paid/licensed SGX feed if product becomes contractual.  
- Historic chart on IR web (not in email) if marketing wants visuals later.

---

## Implementation handoff notes

Suggested work packages (when approved):

1. Category: `Press Release` in catalog + FE form  
2. SGX quote client + validators + volume formatting  
3. Digest command/cron + retry + idempotent day key  
4. Email template + enqueue wiring  
5. `quote_digest_runs` (or equivalent) + admin history UI  
6. Ops failure notifier (reuse admin digest recipients)  
7. Tests as above  
