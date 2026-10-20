<<<<<<< HEAD
-- 1. Xóa các bảng cũ nếu tồn tại (để làm mới hoàn toàn)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS rooms;

-- 2. Tạo bảng rooms (Phòng)
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    price NUMERIC(12, 0) NOT NULL CHECK (price > 0),
    status VARCHAR(20) DEFAULT 'Trong' CHECK (status IN ('Trong', 'Da dat'))
);

-- 3. Tạo bảng customers (Khách hàng)
CREATE TABLE customers (
=======
-- Bang customers: Khach hang
CREATE TABLE IF NOT EXISTS customers (
>>>>>>> 279528a2dd30a2df8df9bd0b24fdf5bb0e4ba5d2
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

<<<<<<< HEAD
-- 4. Tạo bảng bookings (Đặt phòng)
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
=======
-- Bang rooms: Phong
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price NUMERIC(12, 0) NOT NULL,
    status VARCHAR(20) DEFAULT 'Trong'
);

-- Bang bookings: Dat cho
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    room_id INTEGER REFERENCES rooms(id),
>>>>>>> 279528a2dd30a2df8df9bd0b24fdf5bb0e4ba5d2
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Da dat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
<<<<<<< HEAD
    CHECK (check_out > check_in) -- Ràng buộc: ngày trả > ngày nhận
);

-- 5. Thêm dữ liệu mẫu cho Phòng (6 phòng)
=======
    CHECK (check_out > check_in)
);

-- Du lieu mau
>>>>>>> 279528a2dd30a2df8df9bd0b24fdf5bb0e4ba5d2
INSERT INTO rooms (name, type, price, status) VALUES
('Phong 101', 'Standard', 500000, 'Trong'),
('Phong 102', 'Standard', 500000, 'Trong'),
('Phong 201', 'Deluxe', 800000, 'Trong'),
('Phong 202', 'Deluxe', 800000, 'Trong'),
('Phong 301', 'Suite', 1500000, 'Trong'),
('Phong 302', 'Suite', 1500000, 'Trong');

<<<<<<< HEAD
-- 6. Thêm dữ liệu mẫu cho Khách hàng (3 khách)
INSERT INTO customers (full_name, email, phone) VALUES
('Nguyen Van A', 'a@gmail.com', '0912345678'),
('Tran Thi B', 'b@gmail.com', '0987654321'),
('Le Van C', 'c@gmail.com', '0911222333');

-- 7. Thêm dữ liệu mẫu cho Đặt phòng (2 booking)
INSERT INTO bookings (customer_id, room_id, check_in, check_out, status) VALUES
(1, 1, '2026-10-20', '2026-10-22', 'Da dat'),
(2, 3, '2026-10-21', '2026-10-25', 'Da dat');

-- 8. Cập nhật trạng thái phòng đã đặt
UPDATE rooms SET status = 'Da dat' WHERE id IN (1, 3);
=======
INSERT INTO customers (full_name, email, phone) VALUES
('Nguyen Van A', 'a@gmail.com', '0912345678'),
('Tran Thi B', 'b@gmail.com', '0987654321');
>>>>>>> 279528a2dd30a2df8df9bd0b24fdf5bb0e4ba5d2
