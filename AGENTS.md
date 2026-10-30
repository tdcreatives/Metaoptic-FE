# AGENTS.md — Metaoptic-FE

Hướng dẫn cho AI coding agent làm việc trong repo này.

## Tổng quan

Website của Metaoptics Technologies: Next.js 15 (App Router), static export (`output: 'export'`), Tailwind CSS + SCSS, GSAP/Framer Motion, nội dung từ JSON + MDX.

## Lệnh thường dùng

- `npm run dev` — dev server tại http://localhost:4444
- `npm run build` — build static export ra `out/` (dùng để verify trước khi báo xong)
- `npm run lint` — ESLint
- `npm run check:ir` / `npm run check:announcement-api-parity` — check UI/API của Investor Relations

## Cấu trúc

- `src/app/` — route + `metadata` (SEO). Mỗi page là Server Component, import `*ClientSide.js` cho phần tương tác.
- `src/layouts/` — UI chi tiết theo trang (homepage, news, product details...).
- `src/components/` — UI dùng chung; component nền tảng có tiền tố `Base` (`BaseButton`, `BaseInput`...).
- `src/constants/` — dữ liệu nội dung: `data.json` (sản phẩm), `metadata.json` (SEO), `news.json`, `announcements.json`. Đây là nơi sửa nội dung thường xuyên nhất.
- `public/` — ảnh, video, font, `llms.txt`, `_redirects`.
- `graphify-out/` — knowledge graph của codebase (dùng `graphify query` / `path` / `explain`).

## Quy ước

1. Không hardcode text trong UI — đưa vào `src/constants/*.json`.
2. Route động phải có `generateStaticParams`, nếu không static export sẽ thiếu trang.
3. Giữ pattern Server page + `*ClientSide.js`; không thêm `"use client"` vào `page.js` nếu không cần.
4. Ưu tiên Tailwind class; chỉ dùng SCSS cho animation phức tạp/global.
5. Giữ nguyên hiệu ứng GSAP hiện có khi refactor layout; kiểm tra responsive (mobile-first).
6. Host canonical: `https://www.metaoptics.sg` (apex `metaoptics.sg` 301 → www; Cloudflare deploy ở www). Không tạo URL trỏ tới apex hoặc path legacy bị redirect (`/company-announcement`, `/analyst-coverage`, ...).

## Lưu ý static export

- `output: 'export'` → không có Next server: `redirects()` trong `next.config.js` không chạy khi deploy tĩnh. Redirect thực tế nằm ở `.htaccess` (Apache) và `public/_redirects` (Cloudflare Pages).
- Trong `.htaccess`, pattern RewriteRule không có leading `/` (per-directory context).
- SEO: `public/llms.txt` liệt kê canonical URLs; khi thêm trang public nên cập nhật file này.

## Trước khi hoàn thành

- Chạy `npm run build` và đảm bảo exit code 0.
- Kiểm tra route mới có mặt trong `out/` và không bị redirect ngoài ý muốn.
