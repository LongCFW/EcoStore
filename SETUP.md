# 🌿 EcoStore - Hướng Dẫn Cài Đặt

## Yêu Cầu

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (bắt buộc)
- Git

---

## Cách Chạy Dự Án

### Bước 1: Clone repository

```bash
git clone https://github.com/LongCFW/EcoStore.git
cd EcoStore
```

### Bước 2: Tạo file môi trường

```bash
# Copy file mẫu
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Mở `backend/.env` và điền thông tin của bạn:

```dotenv
PORT=5000
MONGO_URI=mongodb://mongo:27017/ecostore   # Giữ nguyên nếu dùng Docker

JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=7d

# Gmail App Password (không phải password gmail thường)
# Lấy tại: https://myaccount.google.com/apppasswords
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password

# PayOS (đăng ký tại https://payos.vn)
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key

YOUR_DOMAIN=http://localhost:5173
ADMIN_EMAIL=your_admin_email@gmail.com
```

### Bước 3: Khởi động Docker

```bash
docker compose up --build
```

Chờ đến khi thấy:

- ecostore_mongo    → running
- ecostore_backend  → MongoDB connected
- ecostore_frontend → VITE ready

### Bước 4: Seed data mẫu

Mở terminal mới (giữ terminal Docker đang chạy):

```bash
docker exec ecostore_backend npm run seed
```

Kết quả:

- 🔗 MongoDB connected for seeding
- Roles seeded
- Categories seeded (6 categories)
- Products seeded (5 products)
- Users seeded (3 users)
- [admin@ecostore.com] | 123456
- [staff@ecostore.com] | 123456
- [customer@ecostore.com] | 123456
- SEEDING COMPLETED

---

## Truy Cập

- Frontend | [http://localhost:5173]
- Backend  | [http://localhost:5000/api]
- MongoDB  | [mongodb://localhost:27017]

---

## Tài Khoản Mặc Định (sau khi seed)

| Role     | Email                    | Password |

| Admin    | [admin@ecostore.com]       | 123456   |
| Staff    | [staff@ecostore.com]       | 123456   |
| Customer | [customer@ecostore.com]    | 123456   |

---

## Lệnh Thường Dùng

```bash
# Khởi động (lần đầu hoặc sau khi sửa code)
docker compose up --build

# Khởi động nhanh (không build lại)
docker compose up

# Chạy ngầm (không chiếm terminal)
docker compose up -d

# Dừng tất cả
docker compose down

# Xem log realtime
docker compose logs -f

# Xem log của 1 service cụ thể
docker compose logs -f backend

# Restart 1 service
docker compose restart backend

# Seed lại data (xóa data cũ và tạo mới)
docker exec ecostore_backend npm run seed
```

---

## Xử Lý Lỗi Thường Gặp

**Lỗi port đã được dùng:**

```bash
# Kiểm tra port đang dùng
netstat -ano | findstr :5173
# Dừng process hoặc đổi port trong docker-compose.yml
```

**Backend không kết nối được MongoDB:**

```bash
# Kiểm tra container mongo đang chạy
docker compose ps
# Restart mongo
docker compose restart mongo
```

**Muốn reset toàn bộ data:**

```bash
docker compose down -v    # Xóa cả volume (data mất hết)
docker compose up --build
docker exec ecostore_backend npm run seed
```
