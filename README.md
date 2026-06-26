# ChipTrip Frontend

Web frontend cho **ChipTrip** — ứng dụng AI Travel Planner: nhập điểm đến, ngày đi, ngân sách và gu du lịch, AI sinh lịch trình chi tiết theo từng khung giờ kèm dự toán chi phí, bản đồ, thời tiết và checklist chuẩn bị. Giao diện tiếng Việt, hướng tới người dùng Việt Nam.

> Backend: [Chiptrip-be](../Chiptrip-be) (Spring Boot · REST + WebSocket).

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5 |
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router 6 |
| Data fetching | TanStack Query (React Query) 5 |
| HTTP client | Axios (interceptor gắn JWT) |
| Forms / Validation | React Hook Form + Zod |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Animation | Framer Motion · GSAP |
| Charts | Recharts (admin dashboard) |
| Realtime | STOMP over SockJS (`@stomp/stompjs`) — chat + notification |
| Maps | Goong Maps JS · Google Maps JS |
| Analytics | PostHog |
| Testing | Vitest + Playwright |
| Lint | ESLint |

## Cài đặt & Chạy

### Yêu cầu

- Node.js 18+ (khuyến nghị 20+)
- npm (hoặc bun — repo có sẵn `bun.lock`)
- Backend [Chiptrip-be](../Chiptrip-be) đang chạy ở `http://localhost:8080`

### 1. Clone repo

```bash
git clone https://github.com/hack3rl0rd/chip-trip-ai-planner.git
cd chip-trip-ai-planner
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Tạo file `.env`

```bash
cp .env.example .env
```

Điền các biến (xem đầy đủ trong `.env.example`):

```env
# Spring Boot API
VITE_API_URL="http://localhost:8080/api/v1"
VITE_WS_URL="http://localhost:8080/ws"

# Google Login
VITE_GOOGLE_CLIENT_ID="your_google_client_id"

# Goong Maps — token render bản đồ (REST API đã proxy qua BE)
VITE_GOONG_MAPTILES_KEY="your_goong_maptiles_key"

# Analytics (tùy chọn)
VITE_POSTHOG_KEY=""
VITE_POSTHOG_HOST="https://us.i.posthog.com"
```

### 4. Chạy ứng dụng

```bash
npm run dev
```

Mặc định chạy ở `http://localhost:5173`.

### Các lệnh khác

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Dev server (HMR) |
| `npm run build` | Build production (`dist/`) |
| `npm run preview` | Xem thử bản build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Kiểm tra type (tsc) |
| `npm run test` | Chạy test (Vitest) |

## Cấu trúc dự án

```
src/
├── app/pages/        # Route pages: Index, Auth, Planning, Result, Profile, Premium, ...
├── components/       # UI dùng chung (ui/ = shadcn) + Navbar, GoongMap, GoogleMap
├── features/         # Logic theo nghiệp vụ: auth, planning, result, explore, chat,
│                     #   notifications, moderation, admin, location
├── integrations/
│   ├── api/          # API client (Axios) + modules theo domain
│   ├── ws/           # WebSocket: chatSocket, notificationSocket
│   └── lovable/
├── hooks/ · lib/ · config/ · types/ · assets/
```

## Team Members

| Họ và tên | MSSV |
|---|---|
| Trần Xuân Bắc | SE180308 |
| Hồ Đình Anh | SE180670 |
| Nguyễn Đình Hoàng | SE192682 |
