# Quan hệ Nhà đầu tư — Yêu cầu từ cuộc họp

**Cuộc họp:** 15/09/2026 · TDC Marketing × Tâm  
**Nguồn:** Bản ghi cuộc họp  
**Phạm vi:** Cập nhật giao diện/nội dung IR, sau đó xây dựng backend đồng bộ SGX announcements và gửi Email Alerts tự động.

## Trạng thái release đã xác nhận — 16/09/2026

Cả bảy nội dung cần thống nhất tại §6 đã được xác nhận theo phương án đề xuất. Release UI đã hoàn thành với sáu tab: **Overview → Events & Presentation → SGX Company Announcement → Analyst Coverage → Governance → Resources**.

- Đã xóa dropdown IR trên header.
- Đã xóa News và Financials khỏi điều hướng IR công khai.
- Company Announcement và Analyst Coverage dùng route IR canonical, bao gồm `/investor-relations/company-announcement/[slug]`.
- Đã cập nhật presentation tại cả hai vị trí và giữ nguyên ba whitepaper.
- Đã xóa/ẩn Recent Press Releases, Gateway Group và các điểm truy cập Email Alerts khi launch.
- Đã cấu hình redirect cho URL cũ.
- **Hiện tại chỉ niêm yết SGX; Nasdaq được lên kế hoạch cho giai đoạn sau.**
- Announcements hiện dùng dữ liệu tĩnh `src/constants/announcements.json`.
- **Hoãn, chưa triển khai:** tự động đồng bộ SGX và backend lưu subscriber/gửi Email Alerts.

---

## 1. Tóm tắt các yêu cầu cập nhật

### Điều hướng và cấu trúc thông tin


| #   | Yêu cầu                                                                      | Mục đích                                                                                                      |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Xóa **dropdown Investor Relations** trên header                              | Khi nhấn **INVESTOR RELATIONS**, người dùng được đưa thẳng đến trang IR Overview, không hiển thị menu con.    |
| 2   | Gộp các trang SGX / giao diện kiểu NASDAQ trước đây thành một trải nghiệm IR | Company Announcements và Analyst Coverage độc lập sẽ được đưa vào hệ thống tab của IR.                        |
| 3   | Sắp xếp lại các tab IR                                                       | **Overview → Events & Presentation → SGX Company Announcement → Analyst Coverage → Governance and Resources** |
| 4   | Xóa tab/phần **News**                                                        | Nội dung được gộp ở nơi khác; chỉ giữ lại các phần TDC yêu cầu rõ ràng.                                       |
| 5   | Thay toàn bộ tab **Financials** bằng **SGX Company Announcement**            | Tái sử dụng phần triển khai ASAP / company-announcement hiện có làm nội dung cho tab mới.                     |
| 6   | Giữ nguyên các phần còn lại không được yêu cầu xóa                           | Không thay đổi Governance / Resources, ngoại trừ nội dung liên quan đến Gateway Group và Email Alerts.        |




### Trang Overview


| #   | Yêu cầu                                                              | Mục đích                                                                    |
| --- | -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 7   | Xóa **Recent Press Releases** khỏi Overview                          | Phần này trở nên dư thừa sau khi News được gộp/xóa.                         |
| 8   | Xóa khối liên hệ **Investor Relations** ở giữa (Gateway Group)       | Chuyển bố cục thành **hai cột**: Headquarters và Depository Bank.           |
| 9   | Tạm ẩn **Email Alerts** trên Overview và các điểm truy cập liên quan | Ẩn đến khi SGX mirror và subscription backend sẵn sàng trên production; sau đó bật lại. |




### Resources


| #   | Yêu cầu                                                | Mục đích                                                                     |
| --- | ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 10  | Xóa toàn bộ nội dung **Gateway Group** trong Resources | Bao gồm phần liên hệ Gateway trên Contact Us và nội dung tương tự trong FAQ. |
| 11  | Ẩn **Email Alerts** trong Resources                    | Chỉ ẩn tạm thời, không xóa vĩnh viễn tính năng.                              |




### Nội dung/tài nguyên đã nhận từ TDC


| #   | Yêu cầu                                                 | Trạng thái                                                                                      |
| --- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 12  | Cập nhật **Investment Presentation** tại **hai vị trí** | **Đã hoàn thành** — đã cập nhật tại Overview và Events & Presentation. |




### Các tính năng tự động hóa SGX được TDC yêu cầu


| #   | Tính năng                              | Trạng thái                                                                                                                   |
| --- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 13  | **Mirror SGX Company Announcements**   | Đã xác định scope — tự động lấy thông báo mới của MetaOptics từ SGX và hiển thị trên website. Cần backend quản lý session.   |
| 14  | **Email Alerts**                       | Đã xác định scope — lưu subscriber và gửi email khi phát hiện thông báo SGX mới. Đây là newsletter, không phải form hiện tại. |




### Trạng thái bàn giao

- **Đã hoàn thành trong release UI:** cập nhật presentation, sáu tab, route canonical, dọn Gateway/Overview, ẩn Email Alerts và cấu hình redirect.
- **Hoãn sang follow-up:** tự động đồng bộ SGX và backend Email Alerts.

---

## 2. Scope — Đồng bộ SGX Company Announcements

### Nguồn dữ liệu

- Trang filter: `https://www.sgx.com/stock-exchange/company-announcements?value=METAOPTICS%20LTD&type=company`
- Endpoint cần session SGX:

```text
GET https://api.sgx.com/announcements/v1.1/company
  ?value=METAOPTICS%20LTD
  &exactsearch=true
  &periodstart=...
  &periodend=...
  &pagestart=0
  &pagesize=20
```

Đây có vẻ là endpoint nội bộ của website SGX, không phải public API có tài liệu chính thức. Endpoint cần session hợp lệ và SGX có thể thay đổi hoặc chặn truy cập tự động. Cần xác nhận quyền sử dụng/licensing của SGX trước khi chạy production.

### Backend PHP đề xuất

1. PHP sync chạy định kỳ mỗi **15 phút** bằng cron trên server.
2. Script khởi tạo/làm mới session SGX và gọi endpoint announcements.
3. Validate, chuẩn hóa response và lưu announcements vào MySQL.
4. Dùng reference/ID của SGX làm khóa duy nhất để chống dữ liệu trùng.
5. Request lỗi được retry có giới hạn và ghi log; dữ liệu cache hiện tại vẫn hoạt động khi SGX gián đoạn.
6. PHP cung cấp read-only JSON endpoint trả announcements đã cache cho frontend.
7. Phần announcements trên website đọc endpoint này và giữ search, filter, pagination hiện có.
8. Trong MVP, mỗi item link đến announcement/file gốc trên SGX.

### Tiêu chí hoàn thành MVP

- Announcement mới xuất hiện trên website trong vòng **30 phút** sau khi có trên SGX.
- Chạy sync nhiều lần không tạo dữ liệu trùng.
- SGX/API lỗi không làm mất nội dung đang có trên website.
- Hiển thị date, title, category, issuer, reference và attachment/source link khi dữ liệu có sẵn.
- Lỗi sync được ghi log và có thể điều tra.
- Frontend hiển thị fallback phù hợp nếu backend không khả dụng.

### Không bao gồm trong MVP

- Copy và host toàn bộ nội dung bài viết/file SGX trên website.
- Giao diện CMS/admin.
- Backfill lịch sử ngoài khoảng thời gian ban đầu được thống nhất.
- Cam kết tương thích nếu SGX thay đổi hoặc xóa endpoint nội bộ.

---

## 3. Scope — Email Alerts

Form Email Alerts hiện tại chỉ gửi thông báo đăng ký qua Web3Forms. Form này **không** lưu danh sách subscriber và không gửi newsletter. Cần thay bằng backend subscription thực tế.

### Backend PHP đề xuất

1. Tạo PHP subscribe endpoint có server-side validation, rate limiting và chống bot.
2. Lưu email, tên tùy chọn, trạng thái, thời điểm consent và confirmation token vào MySQL.
3. Gửi email xác nhận **double opt-in**; chỉ kích hoạt subscription sau khi người dùng xác nhận.
4. Khi SGX sync thêm announcement mới, tạo một notification cho mỗi subscriber đang active.
5. Gửi email có thương hiệu gồm title, date, summary/category và link website/SGX gốc.
6. Dùng email provider chuyên dụng như Amazon SES, Postmark, SendGrid hoặc Mailgun, không dùng PHP `mail()`.
7. Lưu trạng thái gửi và retry lỗi tạm thời nhưng không gửi trùng.
8. Mỗi email có signed one-click unsubscribe link; email hủy đăng ký được chặn gửi ngay.
9. SMTP/API credentials và SGX session chỉ được lưu phía server.
10. Cập nhật form frontend và các trạng thái success/error/confirmation để dùng PHP API.

### Tiêu chí hoàn thành MVP

- Người dùng hợp lệ có thể đăng ký, xác nhận và hủy đăng ký.
- Submission không hợp lệ, trùng hoặc tự động được xử lý an toàn.
- Subscriber đã xác nhận nhận đúng một email cho mỗi SGX announcement mới.
- Dữ liệu announcement import ban đầu không gửi email.
- Retry hoặc chạy cron lại không gửi trùng cùng announcement cho cùng subscriber.
- Mọi email đều có thông tin công ty và unsubscribe link.
- Dữ liệu subscriber không bị lộ ra frontend hoặc log.

### Không bao gồm trong MVP

- Marketing campaign không liên quan đến SGX announcements.
- Newsletter builder, phân nhóm audience hoặc analytics dashboard.
- Chế độ daily/weekly digest nếu chưa được yêu cầu.
- Import mailing list cũ.

---

## 4. Giả định backend và nội dung cần xác nhận

Estimate bên dưới dựa trên các giả định:

- Hosting production hỗ trợ **PHP 8.1+**, MySQL, HTTPS và cron job.
- TDC cung cấp/phê duyệt email provider và sender domain đã xác thực.
- Tài khoản email provider được duyệt và có thể thêm DNS records SPF, DKIM, tốt nhất có cả DMARC.
- TDC đồng ý dùng double opt-in và cung cấp nội dung Privacy Policy/thông tin liên hệ.
- SGX cho phép cách sử dụng này, hoặc TDC chấp nhận rủi ro bảo trì của endpoint phụ thuộc session.
- MVP chỉ đồng bộ **danh sách/metadata và link đến SGX**, không mirror toàn bộ nội dung article.

Cần xác nhận với TDC/hosting:

1. Chu kỳ sync mong muốn: **đề xuất 15 phút**, hay khoảng thời gian khác?
2. Chỉ mirror danh sách/metadata, hay tái tạo toàn bộ announcement detail trên website?
3. Import lịch sử SGX ban đầu bao lâu: **đề xuất 12 tháng**?
4. Dùng email provider nào và sender address/domain nào?
5. Có dùng double opt-in không? **Đề xuất: có.**
6. Gửi ngay cho từng announcement hay daily digest? **Đề xuất: gửi ngay.**
7. Ai nhận cảnh báo vận hành khi SGX sync hoặc email delivery lỗi?
8. Xác nhận PHP version, MySQL và cron trên production.

---

## 5. Estimate đã điều chỉnh

| Công việc | Ước tính |
|---|---:|
| Technical spike: kiểm tra session/API SGX và mapping response | 0,5–1 ngày |
| PHP sync announcements, refresh session, normalize, database và chống trùng | 2–3 ngày |
| Cron, cached JSON endpoint, log, retry và tích hợp frontend | 1,5–2 ngày |
| Subscriber API, database, double opt-in và unsubscribe | 2–2,5 ngày |
| Tích hợp email provider, template, queue, retry và chống gửi trùng | 1,5–2 ngày |
| Test end-to-end, deploy và verify production | 1–1,5 ngày |
| **Tổng hai backend feature** | **8,5–12 ngày làm việc** |

Estimate không bao gồm thời gian chờ quyết định/quyền truy cập SGX, email provider duyệt tài khoản, DNS propagation và hosting credentials. SGX thay đổi endpoint nội bộ có thể phát sinh thêm thời gian.

Hướng chia delivery:

1. **Phase 2A — SGX mirror:** 4–6 ngày làm việc.
2. **Phase 2B — Email Alerts:** 4–5 ngày làm việc sau Phase 2A.
3. **Contingency:** 0,5–1 ngày cho vấn đề deploy/session, đã tính trong tổng estimate.

---


## 6. Các nội dung đã xác nhận với TDC — giao diện IR

Các nội dung dưới đây từng chưa rõ do cuộc họp sử dụng chia sẻ màn hình. Cả bảy nội dung đã được xác nhận theo phương án đề xuất.

### Quyết định đã xác nhận

**1. Dropdown trên header**  
Xác nhận dropdown cần xóa là menu **INVESTOR RELATIONS** trên header toàn site (Company Announcements / Analyst Coverage), và mục điều hướng sẽ trỏ thẳng đến Overview.

- **Đã xác nhận:** Có — xóa dropdown IR và dẫn đến `/investor-relations`.

**2. Cấu trúc tab cuối — Governance và Resources**  
TDC nói “Governance and Resources”. Cần xác nhận đây là:

- **(A)** Hai tab riêng: Governance và Resources
- **(B)** Một tab được gộp chung
- **Đã xác nhận:** **(A)** Hai tab riêng. Resources giữ Investor FAQs và Contact Us, không có Email Alerts hoặc Gateway Group.

**3. Phạm vi xóa News**  
Cần xác nhận:

- **(A)** Xóa toàn bộ tab News, bao gồm Press Releases và Media
- **(B)** Chỉ xóa Press Releases và giữ Media tại một vị trí khác
- **Đã xác nhận:** **(A)** Xóa toàn bộ tab News. Không di chuyển Media gallery.

**4. Thay Financials bằng SGX Company Announcement**  
Cần xác nhận:

- Có xóa **SEC Filings** và Quarterly Results khỏi IR công khai không?
- Có giữ video **“MetaOptics Ltd SGX Listing”** trên trang announcements không?
- Có xóa khối **News** đang nằm dưới nội dung announcements không?
- **Đã xác nhận:** Xóa SEC/Quarterly khỏi điều hướng; giữ video và bảng announcements; xóa khối News bổ sung bên dưới.

**5. Giao diện Analyst Coverage cần giữ**  
Cần xác nhận lựa chọn:

- **(A)** Trang SGX hiện tại (`/analyst-coverage` — danh sách công ty, disclaimer và video)
- **(B)** Bảng Firm / Analyst kiểu Nasdaq trong Stock Info (hiện là dữ liệu mẫu và đang bị ẩn)
- **Đã xác nhận:** **(A)** Dùng trang SGX hiện tại và bọc trong banner/tab của IR.

**6. URL cũ và file presentation**  
Cần xác nhận:

- Redirect 301 `/company-announcement` và `/analyst-coverage` đến các tab IR mới?
- Trong Events & Presentation, chỉ thay file Investor Presentation và giữ nguyên ba whitepaper?
- **Đã xác nhận:** Có cho cả hai nội dung.



### Quyết định niêm yết

**7. Dual listing hay ưu tiên SGX**  
FAQ hiện vẫn đề cập mã Nasdaq **MOT** và ADR/JPMorgan. Sau khi thay Financials bằng SGX announcements, website IR sẽ:

- **(A)** Ưu tiên SGX trong lần thiết kế lại này
- **(B)** Vẫn thể hiện dual listing Nasdaq + SGX và giữ nội dung SEC tại một vị trí khác
- **Đã xác nhận:** **Hiện tại chỉ SGX; Nasdaq được lên kế hoạch cho giai đoạn sau.** Nội dung IR hiện tại không được mô tả Nasdaq/MOT là niêm yết đang hoạt động.

---



## Xác nhận đã ghi nhận

```text
1Y 2A 3A 4Y/Y/Y 5A 6Y/Y
7) Hiện tại chỉ SGX; Nasdaq được lên kế hoạch cho giai đoạn sau.
```

---



## Thứ tự triển khai đề xuất

1. **Giai đoạn 1 — Gộp giao diện: đã hoàn thành.** Header, tabs, dọn Overview, xóa Gateway, ẩn Email Alerts, route IR và redirect đã triển khai.
2. **Giai đoạn 1b — Presentation PDF: đã hoàn thành.** Đã cập nhật tại Overview và Events & Presentation.
3. **Giai đoạn 2A — SGX announcements mirror: hoãn, chưa triển khai.** Xây dựng/deploy PHP/MySQL sync service và thay nguồn dữ liệu tĩnh trên frontend.
4. **Giai đoạn 2B — Email Alerts: hoãn, chưa triển khai.** Thay UI đang ẩn bằng subscriber management và gửi thông báo announcement tự động.

**Thời gian dự kiến để gửi TDC nếu sử dụng các đề xuất mặc định:**


| Công việc                      | Ước tính                                         |
| ------------------------------ | ------------------------------------------------ |
| Gộp giao diện giai đoạn 1      | Đã hoàn thành                                    |
| Thay PDF giai đoạn 1b          | Đã hoàn thành                                    |
| SGX announcements mirror       | Khoảng 4–6 ngày làm việc                         |
| Email Alerts                   | Khoảng 4–5 ngày làm việc sau SGX mirror          |
| Tổng hai backend feature       | Khoảng 8,5–12 ngày làm việc                      |


---



## Ngoài phạm vi cuộc họp

- Bật lại Stock Info hoặc quote widgets
- Thay đổi tài liệu Governance, nội dung hội đồng quản trị/ban quản lý hoặc FAQ không liên quan đến Gateway Group
- Nội dung Nasdaq/dual listing mở rộng ngoài thông tin đã xác nhận cho giai đoạn sau
- Newsletter marketing không liên quan đến SGX, admin dashboard và subscriber analytics nâng cao

