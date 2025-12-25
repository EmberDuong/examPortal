# ExamPortal Deployment Guide

## Architecture
```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Vercel    │ ──▶  │   Railway   │ ──▶  │ MongoDB Atlas│
│  (Frontend) │      │  (Backend)  │      │  (Database)  │
└─────────────┘      └─────────────┘      └──────────────┘
```

---

## Step 1: MongoDB Atlas Setup (Free)

1. **Tạo tài khoản**: https://cloud.mongodb.com
2. **Create Cluster** → Shared (Free)
3. **Database Access** → Add User với password
4. **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. **Connect** → Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/examportal?retryWrites=true&w=majority
   ```

---

## Step 2: Push Code to GitHub

```bash
# Trong thư mục project
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/examportal.git
git push -u origin main
```

---

## Step 3: Deploy Backend to Railway

1. **Tạo tài khoản**: https://railway.app (login với GitHub)

2. **New Project** → Deploy from GitHub repo

3. **Chọn thư mục**: `backend` (hoặc set Root Directory)

4. **Set Environment Variables**:
   | Variable | Value |
   |----------|-------|
   | `MONGODB_URI` | `mongodb+srv://...` (từ Atlas) |
   | `JWT_SECRET` | `your-super-secret-key-here` |
   | `NODE_ENV` | `production` |
   | `PORT` | `3001` |

5. **Deploy** → Copy URL backend (vd: `https://examportal-backend.up.railway.app`)

---

## Step 4: Update Frontend for Production

Trước khi deploy frontend, cần cập nhật API URL:

### Tạo file `.env.production` trong thư mục root:
```env
VITE_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
```

### Cập nhật các file frontend để sử dụng environment variable:

Thay thế `const API_BASE = '/api';` bằng:
```typescript
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

---

## Step 5: Deploy Frontend to Vercel

1. **Tạo tài khoản**: https://vercel.com (login với GitHub)

2. **Import Project** → Chọn repo

3. **Configure**:
   - Framework: **Vite**
   - Root Directory: `.` (root)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**:
   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://YOUR-RAILWAY-URL.up.railway.app/api` |

5. **Deploy!**

---

## Step 6: Configure CORS on Backend

Cập nhật `backend/server.js` để cho phép domain Vercel:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',
    'https://examportal.vercel.app'
  ],
  credentials: true
}));
```

---

## Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] GitHub repo pushed
- [ ] Railway backend deployed
- [ ] Environment variables set on Railway
- [ ] Frontend updated with production API URL
- [ ] Vercel frontend deployed
- [ ] CORS configured for Vercel domain
- [ ] Test login on production

---

## Troubleshooting

### CORS Error
→ Thêm Vercel domain vào CORS config trong `server.js`

### 500 Internal Server Error
→ Kiểm tra Railway logs, đảm bảo `MONGODB_URI` đúng

### Login không hoạt động
→ Kiểm tra JWT_SECRET có set không, CORS có được config không

---

## Cost Estimate (Free Tier)

| Service | Free Tier |
|---------|-----------|
| Vercel | Unlimited static sites |
| Railway | $5/month credits (đủ cho project nhỏ) |
| MongoDB Atlas | 512MB free forever |
