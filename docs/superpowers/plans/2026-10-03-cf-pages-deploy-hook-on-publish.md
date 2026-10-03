# Cloudflare Pages Deploy Hook — Publish Announcement → Rebuild FE

**Date:** 3 Oct 2026  
**Audience:** Ops + backend (CI4)  
**Goal:** Khi admin **Publish** (hoặc **Archive**) announcement, tự trigger rebuild FE trên Cloudflare Pages để detail slug mới có HTML trong `output: 'export'`.

**Why:** List FE đã client-fetch API (live). Detail `[slug]` vẫn bake lúc `next build` → slug publish sau deploy trước sẽ **404** trên Pages trừ khi rebuild.

> Production hiện cũng có thể upload `out/` lên host PHP. Doc này chỉ cover **nhánh FE = Cloudflare Pages**. Host PHP dùng cùng ý tưởng (webhook → CI/script build + rsync) với URL khác.

---

## 1) Flow

```text
Admin Publish (CI4)
    → state = published (DB)
    → HTTP POST Cloudflare Deploy Hook (async, non-blocking)
    → CF Pages: pull repo → npm ci → next build (export)
    → generateStaticParams + loadAnnouncement đọc API published
    → Pages serve HTML mới (list vẫn live; detail slug mới có file)
```

**Latency kỳ vọng:** vài phút (queue build CF). Trong cửa sổ đó list đã hiện item; detail có thể 404 đến khi build xong.

---

## 2) Cloudflare Pages — tạo Deploy Hook

1. Cloudflare Dashboard → **Workers & Pages** → chọn project FE.
2. **Settings** → **Builds & deployments** → **Deploy hooks**.
3. **Add deploy hook**
   - Name: `ir-announcement-publish` (hoặc tương đương).
   - Branch: branch production (thường `main` / `master` / branch Pages đang dùng).
4. Copy URL dạng:

   `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<UUID>`

5. **Bảo mật:** URL = secret. Chỉ lưu trong BE `.env` / secret store. Không commit git. Rotate = xóa hook cũ + tạo hook mới.

### Test thủ công

```bash
curl -X POST "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<UUID>"
```

CF → **Deployments**: thấy build mới. Chờ Success rồi mở detail slug vừa publish.

---

## 3) Build env trên Cloudflare (bắt buộc)

Trong Pages project → **Settings** → **Environment variables** (Production / Preview nếu cần):

| Variable | Giá trị | Ghi chú |
|----------|---------|---------|
| `NEXT_PUBLIC_IR_API_BASE` | `https://xxxx/backend` | Origin CI4 `public/` — **build phải gọi được** API này từ CF build workers |
| (flags) | — | `useAnnouncementsApi` hiện hardcode trong `src/constants/ir-feature-flags.js`; bật `true` trên branch deploy CF trước khi rely hook |

**Build command / output** (Pages):

- Build: `npm ci && npm run build` (hoặc script repo đang dùng).
- Output directory: `out` (Next `output: 'export'`).

**Kiểm tra quan trọng:** Từ môi trường build CF, `GET {NEXT_PUBLIC_IR_API_BASE}/api/announcements?page=1&page_size=1` phải **200**. Nếu API chỉ allowlist IP host PHP / chặn datacenter CF → `generateStaticParams` không lấy slug mới → hook chạy mà detail vẫn thiếu.

Nếu API private: mở firewall cho CF build **hoặc** dùng staging API reachable lúc build **hoặc** chuyển sang client-detail (không phụ thuộc hook).

---

## 4) Backend — cấu hình

Thêm vào `backend/.env` (không commit secret):

```ini
# Cloudflare Pages Deploy Hook (POST empty body). Leave empty to disable.
fe.deployHookURL = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<UUID>'

# Optional: timeout seconds for the outbound POST (default 5)
fe.deployHookTimeout = 5
```

| Key | Ý nghĩa |
|-----|---------|
| `fe.deployHookURL` | URL hook từ §2. Rỗng = không gọi (local/dev). |
| `fe.deployHookTimeout` | Timeout HTTP ngắn; Publish UI không được treo vì CF. |

### Khi nào gọi hook

| Sự kiện CMS | Gọi hook? | Lý do |
|-------------|-----------|--------|
| **Publish** (pending/archived → published) | **Có** (chỉ khi state thực sự đổi) | Cần HTML detail mới |
| **Archive** | **Khuyến nghị Có** | Tránh detail cũ vẫn live trên Pages đến lần deploy khác |
| Create / Edit draft (chưa publish) | Không | Chưa public |
| SGX sync → `pending_review` | Không | Chưa publish |

Gọi **sau** DB commit thành công; lỗi HTTP hook **không** rollback Publish.

---

## 5) Backend — đã implement

| Piece | Location |
|-------|----------|
| Config | `Config\FeDeploy` ← `fe.deployHookURL`, `fe.deployHookTimeout` |
| Hook | `App\Libraries\Admin\FeDeployHook` (empty URL = no-op; never throws) |
| Publish | `PublishService` → `trigger('publish')` when state changes |
| Archive | `ArchiveService` → `trigger('archive')` when state changes |
| Tests | `tests/unit/Admin/FeDeployHookTest.php` |

Debounce (batch publish) vẫn optional / chưa làm.

**Không** đưa Deploy Hook URL ra FE / admin UI.

### Smoke test BE

```bash
# Sau khi gắn code + set .env
# 1) Publish 1 pending từ /admin/announcements
# 2) Check backend/writable/logs — có dòng deploy hook 2xx
# 3) CF Deployments — build Running → Success
# 4) Mở https://<pages-host>/investor-relations/company-announcement/<slug>
```

---

## 6) CORS / Preview / Admin (liên quan, không thay hook)

| Config | Giá trị khi FE = CF Pages |
|--------|---------------------------|
| `cors.allowedOrigins` | Origin Pages (vd. `https://xxxx.pages.dev` và custom domain) |
| `admin.fePublicOrigin` | Cùng origin FE public (Preview links) |
| `email.publicSiteURL` | Cùng origin FE (unsubscribe links) |

Hook chỉ lo **rebuild HTML**. List/subscribe vẫn cần API + CORS đúng.

---

## 7) Vận hành & failure modes

| Triệu chứng | Kiểm tra |
|-------------|----------|
| Publish OK, CF không build | `.env` `fe.deployHookURL`; log BE; hook còn sống trên CF |
| Build fail trên CF | Build log; `npm` / Node version; env thiếu |
| Build Success nhưng detail 404 | API không reachable lúc build; hoặc flag `useAnnouncementsApi` false → chỉ JSON slugs |
| List có / detail 404 vài phút | Bình thường trong lúc build; đợi Success |
| Build spam | Debounce hoặc chỉ hook khi `publish()` returns `true` |

**Alert (khuyến nghị):** CF notification email/Slack khi deployment Failed; BE log `ERROR` khi hook non-2xx.

---

## 8) Checklist bàn giao Ops

- [ ] Deploy Hook tạo trên đúng Pages project + branch
- [ ] URL chỉ nằm trong `backend/.env` production
- [ ] `curl -X POST <hook>` tạo được deployment
- [ ] Pages env: `NEXT_PUBLIC_IR_API_BASE` trỏ API prod reachable từ CF build
- [ ] `useAnnouncementsApi: true` trên branch CF deploy
- [ ] BE gọi hook sau Publish (và Archive nếu đã chọn)
- [ ] Publish thử 1 item → build Success → detail 200
- [ ] Document nội bộ: ai rotate hook khi leak

---

## 9) Lối thoát (khi không muốn rebuild mỗi Publish)

Client-side detail + rewrite (Apache/CF) để slug mới không cần HTML bake — xem thảo luận kiến trúc IR (Option A). Khi đó có thể **tắt** Deploy Hook publish để giảm build CF.

---

## Related

- Plan index: [2026-09-18-README.md](./2026-09-18-README.md)
- FE API flag: `src/constants/ir-feature-flags.js`
- Publish: `backend/app/Libraries/Admin/PublishService.php`
- Static params: `src/lib/announcements-api.js` → `announcementStaticParamsFrom`
