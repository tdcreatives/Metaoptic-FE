# Investor Relations — Meeting Requirements

**Meeting:** 15 Sep 2026 · TDC Marketing × Tâm  
**Source:** Meeting transcription  
**Scope:** UI/content updates to Investor Relations; 
SGX API research is lower priority and comes after UI work.

## Confirmed release status — 16 Sep 2026

All seven alignment suggestions were confirmed with the recommended answers. The UI release is implemented with six tabs: **Overview → Events & Presentation → SGX Company Announcement → Analyst Coverage → Governance → Resources**.

- Presentation update, Gateway/Overview cleanup, Email Alerts hiding and legacy redirects are complete.
- Canonical routes include `/investor-relations/company-announcement/[slug]` and `/investor-relations/analyst-coverage`.
- **SGX only for now; Nasdaq is planned for a future phase.**
- Company Announcements currently use the static `src/constants/announcements.json` dataset.
- **Deferred, not implemented:** automatic SGX synchronization and the Email Alerts subscriber/delivery backend.

---

## 1. Summary of requested updates

### Navigation & information architecture

| # | Request | Intent |
|---|---------|--------|
| 1 | Remove the Investor Relations **header dropdown** | Clicking **INVESTOR RELATIONS** should land on the IR Overview page (no submenu). |
| 2 | Combine the previous SGX / NASDAQ-style surfaces into one IR experience | Standalone Company Announcements and Analyst Coverage should live inside the IR tab chrome. |
| 3 | Reorder IR tabs after the change | **Overview → Events & Presentation → SGX Company Announcement → Analyst Coverage → Governance and Resources** |
| 4 | Remove the **News** tab/section | Content is being combined elsewhere; keep only sections TDC explicitly wants retained. |
| 5 | Replace the entire **Financials** tab with **SGX Company Announcement** | Use the existing ASAP / company-announcement page implementation as the new tab content. |
| 6 | Keep remaining sections not called out for removal | Do not change Governance / Resources content except where Gateway Group or Email Alerts are involved. |

### Overview page

| # | Request | Intent |
|---|---------|--------|
| 7 | Remove **Recent Press Releases** on Overview | Redundant after News is combined / removed. |
| 8 | Remove the middle **Investor Relations** contact block (Gateway Group) | Layout becomes **two columns** (Headquarters + Depository Bank). |
| 9 | Temporarily hide **Email Alerts** (Overview CTA and related entry points) | Hide until SGX automation / API research is done; can be re-enabled later. |

### Resources

| # | Request | Intent |
|---|---------|--------|
| 10 | Remove all **Gateway Group** content under Resources | Including the Gateway contact subsection on Contact Us (and any mirrored FAQ copy). |
| 11 | Hide **Email Alerts** under Resources | Same temporary hide as Overview; do not delete the feature permanently. |

### Content / assets (received from TDC)

| # | Request | Status |
|---|---------|--------|
| 12 | Update **Investment Presentation** in **two places** | **Complete** — updated in Overview and Events & Presentation. |

### Research (after UI)

| # | Request | Intent |
|---|---------|--------|
| 13 | Research whether **SGX** offers an API (similar to NASDAQ / B2I) for company announcements | Enable future automation and Email Alerts. Lower priority than UI; report findings to TDC afterward. |

### Delivery status

- **Complete for this UI release:** presentation update, six-tab consolidation, canonical routes, Gateway/Overview cleanup, Email Alerts hiding and redirect configuration.
- **Deferred follow-ups:** SGX automatic synchronization and Email Alerts backend.

---

## 2. Confirmed alignment with TDC

These items were ambiguous in the transcript, but all seven were subsequently confirmed using the recommended answers.

### Confirmed decisions

**1. Header dropdown**  
Confirm the dropdown to remove is the global header **INVESTOR RELATIONS** menu (Company Announcements / Analyst Coverage), so the nav item links straight to Overview.

- **Confirmed:** Yes — remove header IR dropdown; land on `/investor-relations`.

**2. Final tab structure — Governance vs Resources**  
TDC said “Governance and Resources.” Confirm whether that means:

- **(A)** Two separate tabs: Governance + Resources  
- **(B)** One combined tab

- **Confirmed:** **(A)** two tabs. Resources keeps Investor FAQs + Contact Us (no Email Alerts, no Gateway Group).

**3. News removal scope**  
Confirm whether to remove:

- **(A)** The entire News tab (Press Releases + Media)  
- **(B)** Press Releases only, and keep Media somewhere else

- **Confirmed:** **(A)** remove the entire News tab. Do not migrate the Media gallery.

**4. Financials → SGX Company Announcement**  
Confirm:

- Remove **SEC Filings** / Quarterly Results from public IR (replace Financials entirely)?  
- Keep the **“MetaOptics Ltd SGX Listing”** video on the announcements page?  
- Remove the homepage **News** block currently under the announcements page?

- **Confirmed:** Remove SEC/Quarterly from nav; keep listing video + announcements table; remove the extra News block under announcements.

**5. Which Analyst Coverage UI**  
Confirm which UI to keep as the IR tab:

- **(A)** Existing SGX page (`/analyst-coverage` — firms list, disclaimer, video)  
- **(B)** Nasdaq-style Firm / Analyst table under Stock Info (currently mock / hidden)

- **Confirmed:** **(A)** existing SGX page, wrapped in IR banner + tabs.

**6. Legacy URLs & presentation file**  
Confirm:

- Redirect `/company-announcement` and `/analyst-coverage` into the new IR tabs (301)?  
- Events & Presentation: replace **only** the Investor Presentation PDF, and keep the three whitepapers?

- **Confirmed:** Yes to both.

### Listing decision

**7. Dual listing vs SGX-first**  
FAQs still mention Nasdaq ticker **MOT** and ADR / JPMorgan. After replacing Financials with SGX announcements, is the IR site:

- **(A)** SGX-first / SGX-primary for this redesign  
- **(B)** Still dual listing (Nasdaq + SGX), with SEC content kept somewhere else

- **Confirmed:** **SGX only for now; Nasdaq is planned for a future phase.** Current IR copy must not present Nasdaq/MOT as a current listing.

