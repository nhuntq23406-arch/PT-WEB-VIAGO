# VIAGO - Website Đặt Vé và Hỗ Trợ Hành Trình Xe Khách Thông Minh

**VIAGO** là hệ thống website đặt vé xe khách và đồng hành hỗ trợ hành trình toàn diện dành cho thương hiệu vận tải chất lượng cao VIAGO. Dự án được phát triển nhằm tối ưu hóa trải nghiệm khách hàng từ khâu tra cứu, đặt vé cho đến suốt thời gian di chuyển thực tế, đồng thời số hóa toàn bộ quy trình quản trị vận hành nội bộ của nhà xe.

---

## 📌 Tổng Quan Dự Án & Định Hướng Sản Phẩm
VIAGO không chỉ dừng lại ở vai trò là một kênh bán vé xe trực tuyến thông thường mà tập trung giải quyết trọn vẹn vòng đời hành trình của khách hàng và tối ưu hóa nguồn lực vận hành của doanh nghiệp:
* **Khẩu hiệu thương hiệu**: *"VIAGO - Khởi đầu mọi hành trình, kết nối mọi tuyến đường"*.
* **Phân khúc dịch vụ**: Vận tải hành khách chất lượng cao với các dòng xe Limousine hiện đại (Limousine cabin 22 phòng riêng tư có WC, Limousine giường nằm 34 chỗ nâng cấp, và Limousine 9 ghế ngồi tiện nghi).
* **Định hướng chiến lược**: 
  - Chuyển đổi từ hỗ trợ thủ công sang cơ chế khách hàng tự phục vụ (*Self-service*) đối với các thao tác đổi thông tin vé, hủy vé và nhận tiền hoàn tự động trực tuyến.
  - Tích hợp công nghệ hỗ trợ hành trình thực tế ảo, định vị GPS, dự báo thời tiết điểm đến và đề xuất dịch vụ lưu trú/đi lại.
  - Tự động hóa bộ máy quản trị của nhà xe (quản lý điều phối tài xế, phụ xe, phương tiện, lịch trình, phòng ngừa trùng lặp lịch).

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)
Hệ thống được phát triển hoàn chỉnh trên nền tảng Web hiện đại, đáp ứng tốt giao diện đa thiết bị (Responsive Design):
* **Core Framework**: Angular v21.2.0 & TypeScript.
* **Styling (CSS)**: Tailwind CSS v4.3.1 (kết hợp PostCSS) mang lại giao diện hiện đại, mượt mà và tối ưu hiệu năng hiển thị.
* **Xác thực & Bảo mật**: Firebase Authentication (hỗ trợ đăng nhập, đăng ký và xác thực số điện thoại bằng OTP).
* **Trình soạn thảo nội dung**: Quill & ngx-quill (phục vụ viết tin tức, chính sách ở trang Admin).
* **Gửi email thông báo**: EmailJS Browser.
* **Công cụ thiết kế & phân tích**: Draw.io (sơ đồ BPMN, DFD, Use Case, ERD), Figma (Style Guide, Wireframe & UI mockup).
* **Kiểm thử đơn vị (Unit Test)**: Vitest & JSDOM.

---

## 🌟 Tính Năng Nổi Bật Của Hệ Thống

Hệ thống được chia thành 2 phân hệ chuyên biệt đáp ứng nhu cầu của hai nhóm người dùng chính:

### 1. Phân Hệ Khách Hàng (Customer Site)
* **Đặt Vé Nhanh Chóng & Trực Quan**: 
  - Tìm kiếm chuyến xe theo điểm đi/đến, thời gian (hỗ trợ hiển thị Lịch Âm nhờ Lunar Date Picker).
  - Chọn vị trí trực tiếp trên sơ đồ ghế 2D động theo đúng dòng xe.
  - Áp dụng các Voucher giảm giá tự động từ ví khuyến mãi.
  - Thanh toán linh hoạt qua các cổng điện tử mô phỏng (MoMo, VNPay, VietQR, ZaloPay).
* **Trợ Lý Hỗ Trợ Hành Trình Thông Minh**:
  - **Theo dõi thời gian thực**: Định vị vị trí xe đang chạy trên bản đồ số, cập nhật thời gian xe đến dự kiến (ETA) và đếm ngược giờ xe cập bến đón để hành khách không cần đợi lâu dọc đường.
  - **Cảnh báo thông minh**: Cảnh báo trễ chuyến và thông báo tình trạng xe qua thông báo hệ thống.
  - **Tiện ích điểm đến**: Tự động hiển thị thời tiết tại điểm đến, gợi ý chuẩn bị hành lý phù hợp, đề xuất các khách sạn lưu trú gần điểm trả và các phương tiện đi lại tiếp theo (Grab, taxi, thuê xe máy).
* **Quản Lý Vé & Hóa Đơn Tự Phục Vụ**:
  - Tra cứu thông tin vé qua mã QR.
  - Tự chỉnh sửa thông tin hành khách hoặc thay đổi điểm đón/trả trực tuyến.
  - Kích hoạt quy trình hủy vé và nhận tiền hoàn tự động theo chính sách của nhà xe.
  - Tra cứu và xác thực hóa đơn điện tử chính thức.
* **Dịch Vụ Mở Rộng**:
  - Đăng ký thuê xe hợp đồng nguyên chuyến cho đoàn/doanh nghiệp.
  - Tìm kiếm và gửi yêu cầu hỗ trợ tìm hành lý thất lạc trên xe.
  - Đánh giá chất lượng chuyến đi (chấm sao và gửi ý kiến phản hồi về tài xế, phương tiện).
  - Chatbot hỗ trợ giải đáp nhanh các thắc mắc thường gặp.

---

### 2. Phân Hệ Quản Trị & Vận Hành (Admin & Staff Site)
* **Điều Phối & Quản Lý Vận Hành Thông Minh**:
  - **Quản lý lịch trình & Tuyến xe**: Tạo mới, chỉnh sửa, lọc tuyến xe theo thời gian thực.
  - **Quản lý đón/trả**: Thiết lập các trạm trung chuyển, điểm dừng đỗ, điểm đón/trả khách dọc đường.
  - **Điều động tài xế & Phụ xe**: Phân công nhân sự theo ngày và ca chạy. Hệ thống tự động phát hiện xung đột để ngăn chặn việc phân trùng lịch tài xế hoặc phụ xe.
  - **Quản lý phương tiện**: Giám sát thông tin xe, bảo hiểm, đăng kiểm và phân công xe phù hợp với lịch trình.
* **Quản Lý Bán Vé & Đơn Hàng**:
  - Theo dõi danh sách đơn hàng đặt vé, kiểm soát dòng tiền giao dịch.
  - Hỗ trợ nhân viên phòng vé đặt vé mới cho khách hoặc thực hiện đổi trả/hoàn tiền thủ công khi có yêu cầu trực tiếp.
* **Chăm Sóc Khách Hàng**:
  - Quản lý và xử lý danh sách hành lý thất lạc do tài xế hoặc hành khách báo cáo.
  - Duyệt và quản lý phản hồi, đánh giá từ khách hàng.
* **Quản Trị Nội Dung (CMS)**:
  - Viết bài tin tức, thông báo khuyến mãi, chỉnh sửa chính sách hoạt động.
  - Thiết lập danh sách từ khóa cấm nhằm tự động ẩn các bình luận phản cảm hoặc spam từ khách hàng.
* **Báo Cáo & Thống Kê**:
  - Dashboard trực quan hiển thị các chỉ số kinh doanh cốt lõi (Doanh thu, lượng vé bán ra, lượng khách hàng mới).
  - Báo cáo chi tiết hiệu suất hoạt động theo tuyến xe, theo xe, hiệu suất làm việc của tài xế và tỷ lệ lấp đầy ghế ngồi.

---

## 📂 Cấu Trúc Mã Nguồn (Project Structure)
Mã nguồn Angular của dự án được tổ chức chặt chẽ theo hướng mô-đun hóa:
```text
src/app/
├── auth/                       # Quản lý xác thực Firebase, Modal đăng nhập/đăng ký
├── core/                       # Services dùng chung toàn cục (Voucher, Lịch âm, Layout sync...)
├── shared/                     # Components dùng chung (Toast service, thông báo...)
└── featured/                   # Các màn hình chức năng chính của ứng dụng
    ├── customer/               # Phân hệ dành cho hành khách
    │   ├── home/               # Trang chủ, form tìm kiếm chuyến xe nhanh
    │   ├── schedule/           # Trang tra cứu lịch trình các tuyến
    │   ├── ticket-lookup/      # Trang tra cứu vé xe
    │   ├── profile/            # Trang quản lý hồ sơ cá nhân hội viên
    │   ├── invoice/            # Trang tra cứu hóa đơn điện tử
    │   ├── ChatBot/            # Component chatbot tự động
    │   └── about/              # Các trang chính sách, giới thiệu, tuyển dụng...
    │
    └── admin/                  # Phân hệ quản trị (Dashboard & Operations)
        ├── trangchu/           # Trang chủ admin (Dashboard thống kê biểu đồ)
        ├── dat-ve/             # Quản lý đặt vé và danh sách đơn hàng đã bán
        ├── dieu-phoi/          # Quản lý tuyến xe, lịch trình, phương tiện, tài xế & điểm đón trả
        ├── khach-hang/         # Quản lý tài khoản khách hàng, phản hồi và đồ thất lạc
        ├── nhan-vien/          # Quản lý thông tin tài khoản nhân viên nhà xe
        ├── noi-dung/           # Quản lý khuyến mãi, tin tức, từ khóa cấm
        └── bao-cao/            # Quản lý báo cáo doanh thu, hiệu suất tuyến và tài xế
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy Dự Án

### Yêu cầu hệ thống
* Cài đặt sẵn **Node.js** (Khuyến nghị phiên bản LTS mới nhất).

### Các bước khởi chạy dưới Local
1. **Tải các gói phụ thuộc (Dependencies)**:
   Mở terminal tại thư mục dự án và chạy lệnh sau để tải các thư viện cần thiết:
   ```bash
   npm install
   ```

2. **Khởi chạy Development Server**:
   Chạy lệnh dưới đây để khởi động máy chủ thử nghiệm:
   ```bash
   npm run start
   ```
   *Hoặc sử dụng câu lệnh Angular CLI:*
   ```bash
   ng serve
   ```

3. **Truy cập ứng dụng**:
   Sau khi server khởi chạy thành công, mở trình duyệt và truy cập vào đường dẫn:
   ```text
   http://localhost:4200/
   ```
   Ứng dụng sẽ tự động tải lại (Live Reload) bất cứ khi nào bạn thay đổi mã nguồn trong các file.

4. **Xây dựng phiên bản Production (Build)**:
   Để đóng gói dự án và tối ưu hóa mã nguồn cho môi trường vận hành thực tế:
   ```bash
   npm run build
   ```
   Các file sau khi build thành công sẽ được lưu trữ trong thư mục `dist/`.
