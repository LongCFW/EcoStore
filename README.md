# EcoStore

EcoStore là ứng dụng thương mại điện tử (MERN Stack) chuyên dành cho sản phẩm xanh, hữu cơ và thân thiện môi trường.

> **Chạy toàn bộ dự án chỉ với 1 lệnh:** `docker compose up --build`

---

## Tính Năng Chính

### Khách Hàng (Client)

- **Xác thực:** Đăng ký, đăng nhập, quên/đặt lại mật khẩu qua email
- **Sản phẩm:** Tìm kiếm, lọc theo danh mục, xem chi tiết, nhiều biến thể (size/weight)
- **Giỏ hàng:** Lưu trữ và đồng bộ giỏ hàng client ↔ server
- **Đặt hàng:** Tạo đơn, chọn địa chỉ, thanh toán COD / PayOS
- **Wishlist:** Thêm/xóa yêu thích với Optimistic UI
- **Lịch sử đơn hàng:** Xem trạng thái, nhận email xác nhận tự động
- **Liên hệ:** Gửi thắc mắc, tự động gửi email phản hồi

### Admin Dashboard

- **Phân quyền RBAC:** 3 cấp — Admin / Manager / Staff
- **Dashboard:** Thống kê tổng quan, biểu đồ doanh thu
- **Sản phẩm:** CRUD, upload ảnh, quản lý biến thể (SKU, tồn kho)
- **Danh mục:** CRUD danh mục sản phẩm
- **Đơn hàng:** Xem chi tiết, cập nhật trạng thái (Pending → Shipping → Delivered)
- **Khách hàng:** Xem danh sách, khóa/mở khóa tài khoản (chỉ Admin)

### Hệ Thống

- Snapshot giá tại thời điểm mua (tránh sai lệch khi giá thay đổi)
- URL Params Sync: lọc/phân trang đồng bộ URL, F5 không mất dữ liệu
- Auto logout khi token hết hạn
- Activity log ghi nhận hoạt động admin

---

## 🛠 Công Nghệ

| Frontend | React (Vite), Context API, React Router, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT, HttpOnly Cookie, bcryptjs |
| Email | Nodemailer |
| Payment | PayOS |
| DevOps | Docker, Docker Compose |

---

## Cài Đặt & Chạy

Xem hướng dẫn chi tiết tại **[SETUP.md](SETUP.md)**

### Nhanh (TL;DR)

```bash
# 1. Clone
git clone <repo-url>
cd EcoStore

# 2. Tạo file môi trường
cp backend/.env.example backend/.env
# → Mở backend/.env và điền thông tin của bạn

# 3. Khởi động Docker
docker compose up --build

# 4. Seed data mẫu (terminal mới)
docker exec ecostore_backend npm run seed
```

**Truy cập:**

- Frontend: [http://localhost:5173]
- Backend API: [http://localhost:5000/api]

---

## Tài Khoản Demo

| Role | Email | Password |
| Admin | [admin@ecostore.com] | 123456 |
| Staff | [staff@ecostore.com] | 123456 |
| Customer | [customer@ecostore.com] | 123456 |

> Tài khoản demo chỉ có sau khi chạy `npm run seed`

---

## Tác Giả

Phát triển bởi **Lê Nguyễn Bảo Long (Brian Lee)**

Mọi đóng góp hoặc báo lỗi vui lòng tạo Issue hoặc Pull Request.

© 2025 EcoStore. All rights reserved.
