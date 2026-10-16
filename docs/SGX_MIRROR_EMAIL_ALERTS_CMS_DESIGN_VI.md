# SGX Mirror, Email Alerts và CMS — Thiết kế đã xác nhận

**Ngày:** 17/09/2026  
**Trạng thái:** Design approved, chưa implementation  
**Phạm vi:** PHP backend, MySQL, cron, CMS nội bộ, public announcements API và Email Alerts

## 1. Understanding summary

- PHP backend chạy daily lúc 08:00 SGT để lấy announcement của MetaOptics từ SGX.
- Lần đầu import toàn bộ lịch sử SGX có sẵn, mark Published và không gửi email.
- Announcement mới vào trạng thái Pending Review và tạo email digest báo admin.
- CMS có hai action riêng: Publish to Website và Send Email Alert.
- Send Email chỉ được phép sau khi announcement đã publish.
- Admin được xem dữ liệu SGX gốc, chỉnh summary và email copy; source payload không bị sửa.
- Subscriber active ngay sau khi đăng ký, nhận email xác nhận thành công và có one-click unsubscribe.
- Subscriber chọn category theo danh sách cố định do TDC cung cấp.
- MVP phục vụ tối đa khoảng 5 admin, 5.000 subscriber và 20 announcement/tháng.
- Đội dev nội bộ chịu trách nhiệm vận hành và xử lý lỗi kỹ thuật.

## 2. Assumptions và dependencies

- Hosting có PHP 8.2+ (CodeIgniter 4.7+), MySQL, HTTPS, ext-intl/mbstring/curl, và cron.
- SGX internal endpoint cần session được dùng cho MVP; TDC chấp nhận maintenance risk.
- Email transport provider chưa chốt. Implementation phải dùng adapter để không phụ thuộc domain logic vào SES, Postmark, SendGrid, Mailgun hoặc SMTP.
- TDC sẽ cung cấp danh sách category cố định trước implementation.
- TDC sẽ chốt sender address/domain và cho phép cấu hình SPF, DKIM, tốt nhất có DMARC.
- Danh sách email nhận admin digest được quản lý trong CMS.
- Published announcement chỉ gửi tối đa một campaign; retry chỉ gửi lại failed deliveries.

## 3. Architecture

Hệ thống là một ứng dụng **CodeIgniter 4** (appstarter) dùng MySQL qua Query Builder/Model, CLI Commands (`php spark`) cho cron sync/worker, và Controllers cho public API + admin CMS.

### Thành phần

1. **Daily SGX sync**
   - Cron chạy 08:00 SGT.
   - Tạo/refresh SGX session, fetch dữ liệu có pagination.
   - Validate response, normalize, tính source hash và deduplicate bằng SGX reference.
   - Initial backfill: mark Published, suppress toàn bộ email.
   - Incremental sync: item mới vào Pending Review.
   - Sau transaction thành công, gửi một admin digest nếu có item mới.

2. **Admin CMS**
   - Server-rendered PHP pages.
   - Một admin account, password hash trong server config.
   - PHP session cookie dùng HttpOnly, Secure, SameSite=Strict; rotate session sau login.
   - CSRF cho tất cả mutation.
   - Dashboard: Pending Review, Published, Email Status, Sync History, Settings.
   - Review source data read-only; edit summary, email subject và email intro.
   - Publish và Send Email là hai action riêng.
   - Send Email disabled cho đến khi item Published.

3. **Public announcements API**
   - Chỉ trả Published records.
   - Hỗ trợ pagination, date range, category và search.
   - Không trả source payload, subscriber data, internal error hoặc secret.
   - Next.js frontend đọc API runtime; MySQL/backend trở thành source of truth sau migration.

4. **Subscriber và email delivery**
   - Subscribe API validate input, rate-limit và chống bot.
   - Subscriber active ngay; queue email xác nhận đăng ký thành công.
   - Category preferences lấy từ danh sách cố định của TDC.
   - Admin Send tạo campaign và delivery jobs.
   - Worker gửi theo batch, retry lỗi tạm thời và chống gửi trùng.
   - Signed unsubscribe token chuyển user sang Unsubscribed ngay.

## 4. Data model

### `announcements`

- `id`
- `sgx_reference` — unique
- `slug` — unique, ổn định sau publish
- `source_url`
- `title`
- `category`
- `issuer`
- `filed_at`
- `source_payload` — JSON immutable
- `source_hash`
- `summary` — admin editable
- `state` — `pending_review`, `published`, `archived`
- `published_at`
- timestamps

### `sync_runs`

- started/finished timestamps
- status
- fetched/new/updated counts
- sanitized error

### `subscribers`

- normalized email — unique
- optional first/last name
- status — `active`, `unsubscribed`
- consent timestamp
- unsubscribe timestamp
- signed unsubscribe token/hash

### `subscriber_categories`

- subscriber ID
- fixed category key
- unique subscriber/category constraint

### `email_campaigns`

- unique announcement ID
- subject/body snapshot
- status — `draft`, `queued`, `sending`, `sent`, `partial_failed`
- recipient count
- created/sent timestamps

### `email_deliveries`

- campaign ID
- subscriber ID
- provider message ID
- attempt count
- status/error
- unique campaign/subscriber constraint

### `admin_recipients`

- email
- active flag

### `audit_log`

- login, summary edit, publish, send, retry, archive và settings changes
- timestamp, action, entity and metadata

## 5. State rules

1. SGX incremental import creates `pending_review`.
2. Admin edits summary/email copy.
3. Publish changes item to `published`; it appears in public API.
4. Send Email becomes available only after publish.
5. Send creates one campaign and a delivery snapshot for matching active subscribers.
6. Repeated Send cannot create a second campaign.
7. Retry Failed Deliveries only retries temporary/failed rows.
8. Archive removes item from public API but keeps source and audit history.
9. SGX source changes update source payload/hash and flag the record for admin review without overwriting admin summary.

## 6. API contract

### Public

- `GET /api/announcements`
- `GET /api/announcements/{slug}`
- `POST /api/subscribers`
- `POST /api/unsubscribe`

Public responses use a stable JSON schema. CORS only permits approved MetaOptics origins.

### Admin

- `POST /admin/login`
- `POST /admin/logout`
- `GET /admin/announcements`
- `GET /admin/announcements/{id}`
- `POST /admin/announcements/{id}/summary`
- `POST /admin/announcements/{id}/publish`
- `POST /admin/announcements/{id}/send`
- `POST /admin/campaigns/{id}/retry-failed`
- `GET /admin/sync-runs`
- `GET|POST /admin/settings/recipients`

Các admin mutation yêu cầu authenticated session và CSRF token.

## 7. Error handling và reliability

- Database lock ngăn cron overlap.
- Empty/malformed SGX response là failure, không được hiểu là danh sách rỗng hợp lệ.
- Chỉ commit dữ liệu sau khi toàn bộ response cần thiết đã pass validation.
- SGX session refresh một lần; network/5xx retry có bounded backoff.
- Khi SGX lỗi, published data cũ vẫn được phục vụ.
- Sync failure được ghi log và gửi alert cho đội dev nội bộ.
- Email worker claim jobs atomically và gửi theo batch khoảng 100.
- Temporary delivery failure retry tối đa ba lần.
- Permanent failure hiển thị trong CMS.
- Unsubscribe được kiểm tra cả lúc tạo campaign và ngay trước khi gửi.
- MySQL backup daily, retention tối thiểu 30 ngày; test restore trước launch.

## 8. Security và privacy

- PDO prepared statements cho mọi query.
- Escape output mặc định; không render arbitrary HTML từ SGX/admin.
- Login rate limiting, session expiry, Secure/HttpOnly/SameSite cookie và CSRF.
- Subscriber API có rate limiting, honeypot và generic response chống email enumeration.
- Admin password hash, SGX cookies và email credentials nằm ngoài web root.
- Signed unsubscribe token không chứa email dạng plain text.
- Sau unsubscribe, xóa dữ liệu cá nhân không cần thiết trong 30 ngày nhưng giữ suppression record tối thiểu để tránh gửi lại.
- Audit log không lưu secret hoặc full subscriber payload.

## 9. Test strategy

### Unit tests

- SGX normalization và pagination.
- Source hash/change detection.
- State transition và publish-before-send rule.
- Signed unsubscribe token.
- Category matching và normalized email.

### Integration tests

- Initial backfill published nhưng không tạo campaign.
- Repeated sync không tạo duplicate.
- Empty/malformed/session-expired SGX fixtures.
- Duplicate Send không tạo campaign thứ hai.
- Retry chỉ gửi failed deliveries.
- Unsubscribe xảy ra giữa queue và delivery.

### End-to-end staging

1. Cron fetch item mới.
2. Admin digest được gửi.
3. Admin login, edit summary và publish.
4. Announcement xuất hiện trên website.
5. Admin preview và Send Email.
6. Matching subscribers nhận đúng một email.
7. Unsubscribe ngăn các lần gửi tiếp theo.

### Load smoke test

- 5.000 active subscribers.
- CMS Send trả response nhanh vì chỉ queue jobs.
- Worker hoàn thành batch mà không timeout hoặc duplicate.

## 10. Scope boundaries

### Included

- SGX session-aware daily import.
- Full-history initial backfill.
- CMS review, edit summary, publish và send.
- Admin digest recipients.
- Public announcement API/frontend integration.
- Subscriber registration, category preferences, confirmation email và unsubscribe.
- Queued provider-based email delivery, retry, deduplication, logs và audit.

### Not included

- Marketing campaign không liên quan SGX.
- Drag-and-drop newsletter builder.
- Multi-role/multi-account admin system.
- Daily/weekly subscriber digest.
- Advanced analytics dashboard.
- Automatic Send Email ngay khi SGX import.
- Guarantee compatibility nếu SGX thay đổi internal endpoint.

## 11. Provisional estimate

- SGX endpoint/session spike và fixtures: 1–2 ngày.
- Schema, migration, sync, pagination, deduplication và backfill: 3–4 ngày.
- CMS login, review, publish/send actions, settings và audit: 3–4 ngày.
- Public API và Next.js frontend migration: 2–3 ngày.
- Subscriber/category/unsubscribe flow: 2–3 ngày.
- Email adapter, templates, queue, worker, retry và deduplication: 2–3 ngày.
- End-to-end tests, deployment, backup/restore và production verification: 2–3 ngày.

**Tổng dự kiến:** 15–22 ngày làm việc cho một developer.

Không bao gồm thời gian chờ TDC cung cấp categories, chọn/approve email provider, xác thực sender domain, DNS propagation hoặc SGX thay đổi endpoint.

## 12. Decision log

1. **Workflow:** Publish Website và Send Email là hai action riêng; phải publish trước khi send.
2. **Subscription:** Single opt-in; active ngay và gửi confirmation email.
3. **Email transport:** Provider chưa chốt; dùng adapter.
4. **CMS auth:** Một admin account với password hash, PHP session và CSRF.
5. **Scale:** Tối đa khoảng 5 admin, 5.000 subscriber, 20 announcement/tháng.
6. **Schedule:** Daily sync lúc 08:00 SGT.
7. **SGX risk:** Chấp nhận internal/session-dependent endpoint cho MVP và monitor lỗi.
8. **Content:** Lưu source payload; admin được edit summary/email copy.
9. **History:** Import toàn bộ dữ liệu có sẵn, mark Published và suppress email.
10. **Admin digest:** Recipients được cấu hình trong CMS.
11. **Categories:** Danh sách cố định do TDC cung cấp.
12. **Privacy:** One-click unsubscribe, xóa PII không cần thiết sau 30 ngày, giữ suppression record tối thiểu.
13. **Ownership:** Đội dev nội bộ nhận technical alerts và maintain integration.
14. **Framework:** CodeIgniter 4 appstarter trong `backend/` (thay plain PHP/PDO); CLI qua `php spark`.

## 13. Open dependencies trước implementation

- TDC cung cấp category keys, labels và mapping SGX.
- Chọn email provider.
- Chốt sender name/address và domain.
- Cung cấp provider credentials và DNS access.
- Chốt Privacy Policy copy cho subscription.
- Xác nhận URL/domain deploy PHP API và CMS.

