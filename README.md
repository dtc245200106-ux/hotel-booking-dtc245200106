# 🏨 Hệ thống Đặt phòng Khách sạn

**Sinh viên:** Nguyễn Thị Hường  
**MSV:** dtc245200106  
**Email:** dtc245200106@ictu.edu.vn  
**Môn học:** Triển khai và Quản trị Hệ thống Phần mềm  
**Trường:** Đại học Công nghệ Thông tin và Truyền thông (ICTU)

---

## 📖 Giới thiệu

Đây là đồ án môn học **Triển khai và Quản trị Hệ thống Phần mềm** với đề tài **"Hệ thống Đặt phòng Khách sạn"**. Hệ thống được xây dựng theo kiến trúc microservices, triển khai hoàn toàn bằng **Docker Compose**, bao gồm đầy đủ các thành phần: website, database, reverse proxy, giám sát (monitoring), log tập trung (logging) và các biện pháp bảo mật (hardening).

---

## 🏗️ Kiến trúc hệ thống
┌─────────────┐
│ Client │
│ (Browser) │
└──────┬──────┘
│
┌──────▼──────┐
│ Nginx │ ← Reverse Proxy (Port 80)
│ (frontend) │
└──────┬──────┘
│
┌──────▼──────┐
│ NodeJS App │ ← Backend (Port 3000, internal)
│ (backend) │
└──────┬──────┘
│
┌──────▼──────┐
│ PostgreSQL │ ← Database (Port 5432, internal)
│ + pgAdmin │
└─────────────┘

┌───────────────────────────────────────┐
│ Hệ thống giám sát │
│ Prometheus + Grafana + Node Exporter │
│ + cAdvisor │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│ Hệ thống log tập trung │
│ Loki + Promtail │
└───────────────────────────────────────┘

text

---

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ | Mô tả |
| :--- | :--- | :--- |
| **Backend** | NodeJS 18 + Express | Xây dựng API và giao diện web |
| **Database** | PostgreSQL 15 | Hệ quản trị CSDL quan hệ |
| **DB Tool** | pgAdmin 4 | Quản trị database qua web |
| **Reverse Proxy** | Nginx (alpine) | Reverse proxy, security headers |
| **Monitoring** | Prometheus + Grafana | Giám sát metrics của container |
| **Metrics Exporter** | Node Exporter + cAdvisor | Thu thập metrics hệ thống & container |
| **Logging** | Loki + Promtail | Thu thập và truy vấn log tập trung |
| **Container** | Docker + Docker Compose | Đóng gói và triển khai |
| **Version Control** | Git + GitHub | Quản lý mã nguồn |

---

## 📁 Cấu trúc thư mục
hotel-booking-dtc245200106/
├── app/
│ ├── Dockerfile # Cấu hình build image NodeJS
│ ├── package.json # Khai báo dependencies
│ └── server.js # Code chính của ứng dụng
├── nginx/
│ └── nginx.conf # Cấu hình Nginx reverse proxy
├── prometheus/
│ └── prometheus.yml # Cấu hình scrape metrics
├── loki/
│ └── loki-config.yml # Cấu hình Loki
├── promtail/
│ └── promtail-config.yml # Cấu hình Promtail
├── grafana/
│ └── datasource.yml # Cấu hình Data Source cho Grafana
├── docker-compose.yml # Định nghĩa các service
├── init.sql # Khởi tạo database và dữ liệu mẫu
├── .env # Biến môi trường (không push lên GitHub)
├── .gitignore # Loại trừ file không cần thiết
└── README.md # File này

text

---

## 🚀 Hướng dẫn chạy hệ thống

### Yêu cầu hệ thống
- Ubuntu 22.04/24.04 hoặc mới hơn
- Docker Engine 24.0+
- Docker Compose v2.0+
- RAM tối thiểu: 4GB
- Ổ cứng trống: 10GB

### Các bước cài đặt

**1. Clone repository:**
```bash
git clone https://github.com/dtc245200106-ux/hotel-booking-dtc245200106.git
cd hotel-booking-dtc245200106
2. Tạo file .env (nếu chưa có):

bash
cat > .env << EOF
POSTGRES_USER=admin
POSTGRES_PASSWORD=StrongPass123!
POSTGRES_DB=hotel_db
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=StrongPass123!
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin123
EOF
3. Khởi động toàn bộ hệ thống:

bash
docker compose up -d --build
4. Kiểm tra trạng thái các container:

bash
docker compose ps
Bạn cần thấy 10 container đang ở trạng thái Up:

hotel_db, hotel_app, hotel_nginx, hotel_pgadmin

hotel_prometheus, hotel_grafana, hotel_node_exporter, hotel_cadvisor

hotel_loki, hotel_promtail

5. Dừng hệ thống:

bash
docker compose down
6. Xóa toàn bộ dữ liệu (reset):

bash
docker compose down -v
🌐 Các dịch vụ và cổng truy cập
Dịch vụ	URL	Tài khoản	Mật khẩu
Website	http://localhost	-	-
pgAdmin	http://localhost:5050	admin@admin.com	StrongPass123!
Grafana	http://localhost:3001	admin	admin123
Prometheus	http://localhost:9090	-	-
cAdvisor	http://localhost:8080	-	-
Node Exporter	http://localhost:9100	-	-
Loki	http://localhost:3100	-	-
💾 Cơ sở dữ liệu
Sơ đồ quan hệ (ERD)
text
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  customers   │         │   bookings   │         │    rooms     │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │◄───────┤ customer_id  │         │ id (PK)      │
│ full_name    │         │ room_id      │────────►│ name         │
│ email        │         │ check_in     │         │ type         │
│ phone        │         │ check_out    │         │ price        │
│ created_at   │         │ status       │         │ status       │
└──────────────┘         │ created_at   │         └──────────────┘
                         └──────────────┘
Dữ liệu mẫu
6 phòng: Phong 101, 102, 201, 202, 301, 302 (Standard, Deluxe, Suite).

3 khách hàng: Nguyen Van A, Tran Thi B, Le Van C.

🔐 Các biện pháp bảo mật (Hardening)
Non-root container: Ứng dụng NodeJS chạy với user appuser thay vì root.

Network isolation:

frontend network: Cho các service cần truy cập từ ngoài (Nginx, Grafana).

backend network: internal: true — Các container không thể truy cập Internet.

Biến môi trường: Mật khẩu lưu trong file .env, không hardcode trong code.

Security headers: Nginx thêm các header bảo mật:

X-Frame-Options: SAMEORIGIN

X-Content-Type-Options: nosniff

X-XSS-Protection: 1; mode=block

Referrer-Policy: strict-origin-when-cross-origin

📊 Giám sát (Monitoring)
Prometheus
Thu thập metrics từ: prometheus, node-exporter, cadvisor.

Truy cập: http://localhost:9090/targets

Grafana
Dashboard ID 14282 (Docker Container & Host Metrics).

Hiển thị: CPU, Memory, Network của tất cả container.

📝 Log tập trung (Logging)
Loki + Promtail
Promtail thu thập log từ tất cả container trong /var/lib/docker/containers/.

Loki lưu trữ log tập trung.

Truy vấn LogQL trong Grafana Explore
text
{job="docker"} |= "hotel_app"
{job="docker"} |= "hotel_nginx"
{job="docker"} |= "error"
rate({job="docker"}[1m])
🧪 Kiểm tra chức năng
1. Website
Truy cập http://localhost

Thêm phòng mới, thêm khách hàng, đặt phòng.

Kiểm tra ràng buộc: ngày check-out > check-in, không trùng lịch.

2. Database
Truy cập http://localhost:5050

Đăng nhập: admin@admin.com / StrongPass123!

Kết nối server: Host db, Port 5432, User admin, Pass StrongPass123!, DB hotel_db.

3. Monitoring
Prometheus: http://localhost:9090/targets

Grafana: http://localhost:3001

4. Logging
Grafana Explore -> Loki -> Query {job="docker"}

🐛 Xử lý sự cố
Lỗi container không khởi động
bash
docker compose logs <tên_service> --tail=50
Lỗi kết nối database
Kiểm tra container hotel_db có đang chạy không: docker compose ps.

Kiểm tra log: docker compose logs db --tail=30.

Lỗi Promtail không thu thập log
Khởi động lại: docker compose restart promtail.

Kiểm tra quyền truy cập: ls -la /var/lib/docker/containers/.

Reset toàn bộ hệ thống
bash
docker compose down -v
docker compose up -d --build
📚 Tài liệu tham khảo
Docker Documentation

Docker Compose Documentation

Nginx Documentation

Prometheus Documentation

Grafana Documentation

Loki Documentation

PostgreSQL Documentation

📞 Liên hệ
Sinh viên: Nguyễn Thị Hường

MSV: dtc245200106

Email: dtc245200106@ictu.edu.vn

GitHub: dtc245200106-ux
