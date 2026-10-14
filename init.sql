-- Bang customers: Khach hang
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Da dat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (check_out > check_in)
);

-- Du lieu mau
INSERT INTO rooms (name, type, price, status) VALUES
('Phong 101', 'Standard', 500000, 'Trong'),
('Phong 102', 'Standard', 500000, 'Trong'),
('Phong 201', 'Deluxe', 800000, 'Trong'),
('Phong 202', 'Deluxe', 800000, 'Trong'),
('Phong 301', 'Suite', 1500000, 'Trong'),
('Phong 302', 'Suite', 1500000, 'Trong');

INSERT INTO customers (full_name, email, phone) VALUES
('Nguyen Van A', 'a@gmail.com', '0912345678'),
('Tran Thi B', 'b@gmail.com', '0987654321');
