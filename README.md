# ExamPortal - Hệ Thống Thi Trực Tuyến

Hệ thống quản lý và tổ chức thi trực tuyến với giao diện hiện đại, hỗ trợ đa ngôn ngữ (Tiếng Việt & English).

## 🏗️ Kiến Trúc

```
exam/
├── backend/         # Node.js + Express API
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── middleware/  # JWT auth
│   └── server.js    # Entry point
├── pages/           # React components
├── App.tsx          # Main app
└── index.html       # Entry HTML
```

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- Node.js 18+
- MongoDB (local hoặc Atlas)

### Backend

```bash
# Di chuyển vào folder backend
cd backend

# Cài đặt dependencies
npm install

# Tạo admin user
npm run seed

# Chạy server (port 5000)
npm run dev
```

### Frontend

```bash
# Ở thư mục gốc
npm install
npm run dev
```

## 🔐 Tài Khoản Đăng Nhập

| Vai Trò | Tên Đăng Nhập | Mật Khẩu |
|---------|---------------|----------|
| Admin | `admin` | `s@uRiengRoiVoDau123` |

> Students có thể tự đăng ký và xác thực qua số điện thoại

## 📡 API Endpoints

| Route | Mô Tả |
|-------|-------|
| `POST /api/auth/login` | Đăng nhập |
| `POST /api/auth/register` | Đăng ký student |
| `POST /api/auth/verify-phone` | Xác thực SĐT |
| `GET /api/users` | Danh sách candidates (Admin) |
| `GET /api/questions` | Ngân hàng câu hỏi (Admin) |
| `GET /api/exams` | Danh sách bài thi |
| `POST /api/exams/:id/start` | Bắt đầu làm bài |
| `POST /api/exams/:id/submit` | Nộp bài |
| `GET /api/results` | Kết quả thi |

## ✨ Tính Năng

### 👨‍💼 Admin
- Dashboard tổng quan
- Quản lý thí sinh (CRUD)
- Ngân hàng câu hỏi (CRUD)
- Quản lý bài thi (CRUD)
- Xem kết quả thi

### 👨‍🎓 Student
- Tự đăng ký + xác thực SĐT
- Xem danh sách bài thi
- Làm bài với đồng hồ đếm ngược
- Phát hiện chuyển tab (anti-cheat)
- Xem kết quả chi tiết

### 🌐 Đa Ngôn Ngữ
- 🇻🇳 Tiếng Việt (mặc định)
- 🇬🇧 English

## 🛠️ Công Nghệ

**Frontend**: React, TypeScript, Tailwind CSS, React Router, Recharts

**Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## 📝 License

MIT
