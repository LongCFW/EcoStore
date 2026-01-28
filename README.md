# EcoStore - Nền Tảng Thương Mại Điện Tử MERN Stack

Dự án E-commerce chuyên kinh doanh các sản phẩm xanh, hữu cơ và thân thiện với môi trường. Hệ thống bao gồm giao diện mua sắm cho khách hàng và trang quản trị (Admin Dashboard) với phân quyền chặt chẽ.
![EcoStore Banner](https://via.placeholder.com/1200x400?text=EcoStore+Project+Banner)

## Giới Thiệu

**EcoStore** là một ứng dụng Full-stack được xây dựng trên nền tảng **MERN (MongoDB, Express, React, Node.js)**. Dự án tập trung vào trải nghiệm người dùng mượt mà (Optimistic UI), bảo mật cao (HttpOnly Cookie, RBAC) và kiến trúc mã nguồn sạch sẽ, dễ bảo trì.

---

## Công Nghệ Sử Dụng

### Frontend (Client & Admin)

* **Core:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/) (Build tool).
* **UI Framework:** [React Bootstrap](https://react-bootstrap.github.io/) (Responsive layout).
* **State & Routing:** Context API (Auth, Cart, Wishlist), [React Router DOM v7](https://reactrouter.com/).
* **Data Fetching:** [Axios](https://axios-http.com/) (với Interceptors xử lý Token/Lỗi).
* **Utilities:**
* `react-hot-toast`: Thông báo (Toast notification).
* `recharts`: Biểu đồ thống kê.
* `react-icons`: Bộ icon đa dạng.
* `js-cookie`, `jwt-decode`: Xử lý cookie và token.

### Backend (API Server)

* **Runtime:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/).
* **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/).
* **Authentication:** JWT (JSON Web Token), BCrypt (Mã hóa mật khẩu).
* **File Upload:** [Multer](https://github.com/expressjs/multer) (Xử lý upload ảnh).
* **Email Service:** [Nodemailer](https://nodemailer.com/).
* **Security & Validation:** `cookie-parser`, `cors`, `express-validator`, `dotenv`.
* **Utilities:** `slugify` (Tạo URL thân thiện).

---

## Tính Năng Nổi Bật

### Client (Khách Hàng)

#### 1. Xác thực (Auth)

* Đăng ký / Đăng nhập / Đăng xuất.
* **Quên mật khẩu & Đặt lại mật khẩu** (qua Email xác thực).
* Bảo mật phiên làm việc bằng **HttpOnly Cookie**.

#### 2. Mua sắm (Shopping Flow)

* **Sản phẩm:** Xem danh sách, chi tiết sản phẩm, lọc theo (Danh mục, Thương hiệu, Giá), Tìm kiếm thời gian thực.
* **Giỏ hàng (Cart):**
* Đồng bộ giỏ hàng với Database (giữ giỏ hàng khi đăng nhập thiết bị khác).
* Tự động tính toán tổng tiền và Freeship tại Backend.
* **Thanh toán (Checkout):**
* Quản lý sổ địa chỉ (Thêm mới/Chọn có sẵn).
* **Snapshot giá:** Lưu cứng giá sản phẩm tại thời điểm mua (tránh sai lệch khi giá gốc thay đổi).
* Kiểm tra và trừ tồn kho (Inventory Check).
* **Đơn hàng:** Xem lịch sử mua hàng, nhận Email xác nhận đơn hàng tự động.

#### 3. Tiện ích (Standalone)

* **Wishlist:** Thêm/Xóa sản phẩm yêu thích (Sử dụng Optimistic UI update - cập nhật ngay lập tức không cần chờ server).
* **Liên hệ:** Gửi thắc mắc, tự động gửi email phản hồi cho khách và thông báo cho Admin.

#### 4. Hệ thống (System)

* **URL Params Sync:** Trạng thái lọc, phân trang, tab đều được đồng bộ lên URL (F5 không mất dữ liệu).
* **Auto Logout:** Tự động đăng xuất khi Token hết hạn.

---

### Admin Dashboard (Quản Trị)

#### 1. Phân quyền (RBAC - Role Based Access Control)

* Hệ thống phân quyền 3 cấp độ: **ADMIN**, **MANAGER**, **STAFF**.
* **Middleware bảo vệ:** Chặn API ngay từ Backend nếu không đủ quyền.
* **Dynamic Sidebar:** Menu tự động ẩn/hiện tùy theo vai trò của người đăng nhập.

#### 2. Quản lý dữ liệu (Management)

* **Dashboard:** Thống kê tổng quan (Chart, Mini stats).
* **Sản phẩm (Product):** Thêm, Sửa, Xóa, Upload ảnh, Quản lý biến thể (SKU, Stock).
* **Danh mục (Category):** CRUD danh mục sản phẩm.
* **Đơn hàng (Order):** Xem chi tiết, Cập nhật trạng thái (Pending -> Shipping -> Delivered).
* **Khách hàng (Customer):** Xem danh sách.
* *Logic đặc biệt:* Chỉ **Admin** mới có quyền Khóa/Mở khóa tài khoản, Manager chỉ được xem.

---

## Cấu Trúc Dự Án

EcoStore/
├── backend/                # API Server (NodeJS/Express)
│   ├── src/
│   │   ├── config/         # DB connection, Seeding
│   │   ├── controllers/    # Xử lý Logic request/response
│   │   ├── middlewares/    # Auth, Role, Error, Validate
│   │   ├── models/         # MongoDB Schemas (User, Product, Order...)
│   │   ├── routes/         # Định nghĩa API endpoints
│   │   ├── seeds/          # Test data
│   │   ├── services/       # Logic nghiệp vụ phức tạp (Business Logic)
│   │   ├── utils/          # SendEmail, Templates
│   │   └── app.js          # Entry point
│   └── .env                # Biến môi trường
│   └── node_module
│   └── scripts
│   └── uploads
│   └── .gitignore
│   └── package-lock.son
│   └── package.json
└── frontend/               # Client & Admin (React/Vite)
    ├── src/
    │   ├── assets/         # CSS, Images
    │   │   ├── images/
    │   │   └── styles/
    │   ├── components/
    │   │   ├── admin/
    │   │   ├── cart/
    │   │   ├── common/
    │   │   ├── product/
    │   │   └── profile/
    │   ├── context/        # Global State (Auth, Cart, Wishlist, AdminTheme)
    │   ├── hooks/          # Custom Hooks (useAuth, useCart...)
    │   ├── layouts/        # AdminLayout, MainLayout
    │   ├── pages/          # Các trang (Client & Admin)
    │   │   ├── admin/
    │   │   ├── auth/
    │   │   └── client/
    │   ├── routes/         # AppRoutes, ProtectedRoute
    │   ├── services/       # API Calls (axiosClient)
    │   ├── App.jsx
    │   └── main.jsx
    │── .env
    │── .gitignore
    │── eslint.config.js
    │── index.html
    │── package.-lock.json
    │── package.json
    └── vite.config.js

## Hướng Dẫn Cài Đặt & Chạy Local

Yêu cầu tiên quyết: Node.js (v16 trở lên), MongoDB (Local hoặc Atlas)

1. Cài đặt Backend
cd backend
npm install
npm run seed  
npm run dev

2. Cài đặt Frontend
cd frontend
npm install
npm run dev

3. Cấu hình biến môi trường (backend/.env)
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecostore
JWT_SECRET=your_super_secret_key_123
JWT_EXPIRES_IN=7d
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=[your-email@gmail.com]
MAIL_PASS=[your-app-password]
CLIENT_URL=[http://localhost:5173]

## Tài Khoản Demo

Admin: [admin@ecostore.com] | pass: 123456 (Full quyền hệ thống)
Manager: [manager@ecostore.com] | pass: 123456 (Quản lý, không được xóa user/cấu hình)
Staff: [staff@ecostore.com] | pass: 123456 (Chỉnh được phép cập nhật đơn hàng)
Customer [customer@ecostore.com] | pass: 123456 (Mua hàng, xem lịch sử)

## API Endpoints

1. Authentication (Xác thực & Hồ sơ)
Prefix: /api/auth
Method   |   Endpoint   |   Quyền hạn   |   Mô tả
POST        /register        Public          Đăng ký tài khoản mới
POST        /login           Public          Đăng nhập (Nhận Token & HttpOnly Cookie)
POST        /logout          Private         Đăng xuất (Xóa Cookie)
GET         /me              Private         Lấy thông tin user đang đăng nhập (dùng cho Context)
POST        /forgot-password Public          Gửi email reset mật khẩu
POST        /reset-password  Public          Đặt lại mật khẩu mới (cần token từ email)
PUT     /profile/update      Private         Cập nhật thông tin cá nhân (Tên, SĐT)
PUT /profile/change-password Private         Đổi mật khẩu
POST      /upload-avatar     Private         Upload ảnh đại diện (User/Admin)

2. Products (Sản phẩm)
Prefix: /api/products
Method   |   Endpoint   |   Quyền hạn   |   Mô tả
GET         /               Public          Lấy danh sách (hỗ trợ ?page, ?limit, ?search, ?category...)
GET         /:slug          Public          Xem chi tiết sản phẩm theo Slug
GET         /related        Public          Lấy sản phẩm liên quan (cùng danh mục)
POST        /               Admin/Manager   Tạo sản phẩm mới
PUT         /:id            Admin/Manager   Cập nhật sản phẩm
DELETE      /:id            Admin/Manager   Xóa sản phẩm

3. Categories (Danh mục)
Prefix: /api/categories
Method   |   Endpoint   |   Quyền hạn   |   Mô tả
GET         /               Public          Lấy danh sách danh mục (cho Menu/Filter)
POST        /               Admin/Manager   Tạo danh mục mới
PUT         /:id            Admin/Manager   Sửa danh mục
DELETE      /:id            Admin/Manager   Xóa danh mục

4. Cart (Giỏ hàng)
Prefix: /api/cart
Method   |   Endpoint   |   Quyền hạn   |   Mô tả
GET             /           Private         Lấy giỏ hàng của user hiện tại
POST            /add        Private         Thêm sản phẩm vào giỏ
PUT             /update     Private         Cập nhật số lượng (+/-)
DELETE   /remove/:productId Private         Xóa 1 sản phẩm khỏi giỏ

5. Orders (Đơn hàng)
Prefix: /api/orders
Method    |    Endpoint    |    Quyền hạn    |      Mô tả
POST              /             Private              Tạo đơn hàng mới (Checkout)
GET         /my-orders          Private              Xem lịch sử đơn hàng của bản thân
GET         /admin/all          Admin/Manager/Staff  Xem toàn bộ đơn hàng hệ thống (có lọc status)
PUT         /admin/:id/status   Admin/Manager/Staff  Cập nhật trạng thái đơn (Pending -> Shipping -> ...)

6. Users & Address (Người dùng & Địa chỉ)
Prefix: /api/users
Method     |     Endpoint     |     Quyền hạn     |     Mô tả
GET             /wishlist           Private         Lấy danh sách yêu thích
POST            /wishlist/toggle    Private         Thêm/Xóa sản phẩm yêu thích
POST            /address            Private         Thêm địa chỉ nhận hàng mới
PUT             /address/:addressId Private         Sửa địa chỉ
DELETE          /address/:addressId Private         Xóa địa chỉ
PUT     /address/:addressId/default Private         Đặt làm địa chỉ mặc định
GET                 /               Admin/Manager   Lấy danh sách User (Admin Dashboard)
GET             /:id                Admin/Manager   Xem chi tiết 1 User
PUT             /:id/status         Admin           Khóa/Mở khóa tài khoản User
DELETE           /:id               Admin           Xóa vĩnh viễn User

7. Contact (Liên hệ)
Prefix: /api/contact
Method   |   Endpoint   |   Quyền hạn   |   Mô tả
POST            /           Public          Gửi form liên hệ (Gửi mail cho Admin & Auto-reply khách)

## Tác giả

Dự án được phát triển bởi Lê Nguyễn Bảo Long (Brian Lee). Mọi đóng góp hoặc báo lỗi vui lòng tạo Issue hoặc Pull Request.

© 2025 EcoStore. All rights reserved.
