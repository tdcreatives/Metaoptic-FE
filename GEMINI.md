# Tài liệu Dự án Metaoptic-FE

## 🚀 Tổng quan
Metaoptic-FE là giao diện web của Metaoptics, xây dựng trên Next.js 15. Dự án tập trung vào trải nghiệm người dùng mượt mà với nhiều hiệu ứng chuyển động và khả năng hiển thị nội dung tĩnh (Static Export).

## 🛠 Công nghệ sử dụng
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS, Sass (SCSS)
- **Animations:** GSAP, Framer Motion
- **Content:** MDX (cho bài viết chi tiết), JSON (cho danh sách dữ liệu)
- **Deployment:** Static Export (`output: 'export'`)
- **Alias:** Sử dụng `@/` trỏ vào thư mục `src/`.

## 📁 Cấu trúc thư mục quan trọng
- `src/app/`: Định nghĩa route và Metadata (SEO). Thường gọi các Client Component để xử lý logic.
- `src/components/`: Các UI dùng chung. Các component nền tảng có tiền tố `Base` (vd: `BaseButton`, `BaseInput`).
- `src/constants/`: Nơi chứa dữ liệu "cứng" (Tin tức, sản phẩm, thông tin công ty) dạng JSON. **Đây là nơi anh sẽ sửa nội dung thường xuyên nhất.**
- `src/layouts/`: Chứa giao diện chi tiết theo từng trang (Homepage, News, Product Details).
- `public/`: Chứa tài nguyên tĩnh (Ảnh, Video, Fonts).

## 📐 Quy ước lập trình (Conventions)
1. **Component:** Đặt trong thư mục riêng kèm file `index.js`. Ưu tiên viết Functional Components.
2. **Dữ liệu:** Không viết chết (hardcode) text vào UI. Hãy đưa vào `src/constants/data.json` hoặc các file tương ứng.
3. **Client/Server:** Các trang trong `src/app` giữ vai trò Server Component để làm SEO, sau đó import các `*ClientSide.js` để xử lý tương tác người dùng.
4. **Style:** Ưu tiên dùng Tailwind class. Chỉ dùng SCSS cho các animation phức tạp hoặc global styles.

## 📝 Hướng dẫn cập nhật nội dung
- **Thêm tin tức:** Cập nhật file `src/constants/news.json`. Nếu có bài viết chi tiết, thêm file `.mdx` vào `src/content/news/`.
- **Thay đổi SEO:** Sửa trong `src/constants/metadata.json`.
- **Thêm sản phẩm:** Cập nhật `src/constants/data.json`.

## 🤖 Ghi chú cho AI Assistant
- Luôn kiểm tra `generateStaticParams` khi thêm route động để đảm bảo tính năng Export không bị lỗi.
- Khi chỉnh sửa UI, hãy đảm bảo tính responsive (mobile-first) vì dự án sử dụng `useMobile` hook khá nhiều.
- Giữ nguyên các hiệu ứng GSAP hiện có khi refactor layout.
