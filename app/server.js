const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'StrongPass123!',
  database: process.env.DB_NAME || 'hotel_db',
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============ LAYOUT CHUNG ============
function layout(title, content, activePage = '') {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Hotel Booking</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f0f2f5; color: #333; }
        .header { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header-top { max-width: 1200px; margin: 0 auto; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 22px; font-weight: bold; }
        .logo span { color: #ffd700; }
        .user-info { font-size: 13px; opacity: 0.9; }
        .nav { background: rgba(0,0,0,0.15); }
        .nav-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; gap: 5px; }
        .nav a { color: white; text-decoration: none; padding: 12px 20px; display: block; font-size: 14px; font-weight: 500; transition: background 0.2s; border-bottom: 3px solid transparent; }
        .nav a:hover { background: rgba(255,255,255,0.1); }
        .nav a.active { background: rgba(255,255,255,0.15); border-bottom-color: #ffd700; }
        .container { max-width: 1200px; margin: 30px auto; padding: 0 20px; }
        .page-title { color: #1e3c72; font-size: 26px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .card { background: white; border-radius: 10px; padding: 25px; margin-bottom: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .card-title { color: #1e3c72; font-size: 18px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #f0f2f5; }
        .alert { padding: 14px 20px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; display: flex; align-items: center; gap: 10px; }
        .alert-success { background: #d4edda; color: #155724; border-left: 4px solid #28a745; }
        .alert-error { background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545; }
        .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 5px; }
        .form-group input, .form-group select { padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; transition: border-color 0.2s; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #2a5298; box-shadow: 0 0 0 3px rgba(42,82,152,0.1); }
        .btn { padding: 10px 20px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; }
        .btn-primary { background: #2a5298; color: white; }
        .btn-primary:hover { background: #1e3c72; }
        .btn-success { background: #28a745; color: white; }
        .btn-success:hover { background: #218838; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-danger:hover { background: #c82333; }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; font-size: 14px; }
        th { background: #f8f9fa; color: #1e3c72; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        tr:hover { background: #f9f9f9; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-success { background: #d4edda; color: #155724; }
        .badge-danger { background: #f8d7da; color: #721c24; }
        .badge-warning { background: #fff3cd; color: #856404; }
        .footer { background: #1e3c72; color: white; text-align: center; padding: 20px; margin-top: 40px; font-size: 13px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #2a5298; }
        .stat-value { font-size: 32px; font-weight: bold; color: #1e3c72; }
        .stat-label { font-size: 13px; color: #666; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-top">
          <div class="logo">🏨 Hotel<span>Booking</span></div>
          <div class="user-info">Nguyen Thi Huong - dtc245200106</div>
        </div>
        <div class="nav">
          <div class="nav-content">
            <a href="/" class="${activePage === 'home' ? 'active' : ''}">🏠 Trang chu</a>
            <a href="/rooms" class="${activePage === 'rooms' ? 'active' : ''}">🛏️ Quan ly phong</a>
            <a href="/customers" class="${activePage === 'customers' ? 'active' : ''}">👥 Khach hang</a>
            <a href="/bookings" class="${activePage === 'bookings' ? 'active' : ''}">📅 Dat phong</a>
          </div>
        </div>
      </div>
      <div class="container">
        ${content}
      </div>
      <div class="footer">
        <p>© 2026 Hotel Booking System - Nguyen Thi Huong (dtc245200106) - ICTU</p>
      </div>
    </body>
    </html>
  `;
}

// ============ TRANG CHU ============
app.get('/', async (req, res) => {
  try {
    const roomsCount = await pool.query('SELECT COUNT(*) FROM rooms');
    const customersCount = await pool.query('SELECT COUNT(*) FROM customers');
    const bookingsCount = await pool.query('SELECT COUNT(*) FROM bookings');
    const availableRooms = await pool.query("SELECT COUNT(*) FROM rooms WHERE status = 'Trong'");

    const content = `
      <h1 class="page-title">📊 Dashboard</h1>
      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">${roomsCount.rows[0].count}</div>
          <div class="stat-label">Tong so phong</div>
        </div>
        <div class="stat-card" style="border-left-color: #28a745;">
          <div class="stat-value">${availableRooms.rows[0].count}</div>
          <div class="stat-label">Phong con trong</div>
        </div>
        <div class="stat-card" style="border-left-color: #ffc107;">
          <div class="stat-value">${customersCount.rows[0].count}</div>
          <div class="stat-label">Khach hang</div>
        </div>
        <div class="stat-card" style="border-left-color: #dc3545;">
          <div class="stat-value">${bookingsCount.rows[0].count}</div>
          <div class="stat-label">Luot dat phong</div>
        </div>
      </div>
      <div class="card">
        <h2 class="card-title">Chao mung den voi He thong Dat phong Khach san</h2>
        <p style="color: #666; line-height: 1.6;">Su dung menu phia tren de quan ly phong, khach hang va dat phong. He thong ho tro day du cac chuc nang: them phong, them khach hang, dat phong voi ngay check-in/check-out, va kiem tra tinh trang phong trong.</p>
      </div>
    `;
    res.send(layout('Trang chu', content, 'home'));
  } catch (err) {
    res.status(500).send('Loi: ' + err.message);
  }
});

// ============ QUAN LY PHONG ============
app.get('/rooms', async (req, res) => {
  try {
    const rooms = await pool.query('SELECT * FROM rooms ORDER BY id');
    const content = `
      <h1 class="page-title">🛏️ Quan ly Phong</h1>
      ${req.query.success ? '<div class="alert alert-success">✅ ' + req.query.success + '</div>' : ''}
      ${req.query.error ? '<div class="alert alert-error">❌ ' + req.query.error + '</div>' : ''}

      <div class="card">
        <h2 class="card-title">➕ Them phong moi</h2>
        <form action="/rooms/add" method="POST">
          <div class="form-row">
            <div class="form-group">
              <label>Ten phong *</label>
              <input type="text" name="name" placeholder="VD: Phong 401" required>
            </div>
            <div class="form-group">
              <label>Loai phong *</label>
              <select name="type" required>
                <option value="">-- Chon loai --</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div class="form-group">
              <label>Gia (VND/dem) *</label>
              <input type="number" name="price" min="0" step="1000" placeholder="500000" required>
            </div>
          </div>
          <button type="submit" class="btn btn-success">Them phong</button>
        </form>
      </div>

      <div class="card">
        <h2 class="card-title">📋 Danh sach phong (${rooms.rowCount})</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Ten phong</th><th>Loai</th><th>Gia (VND)</th><th>Trang thai</th><th>Hanh dong</th>
            </tr>
          </thead>
          <tbody>
            ${rooms.rows.map(room => `
              <tr>
                <td>${room.id}</td>
                <td><strong>${room.name}</strong></td>
                <td>${room.type}</td>
                <td>${Number(room.price).toLocaleString()}</td>
                <td>
                  <span class="badge ${room.status === 'Trong' ? 'badge-success' : 'badge-danger'}">
                    ${room.status === 'Trong' ? '✓ Con trong' : '✗ Da dat'}
                  </span>
                </td>
                <td>
                  <form action="/rooms/delete/${room.id}" method="POST" style="display:inline;" onsubmit="return confirm('Ban chac chan xoa phong nay?');">
                    <button type="submit" class="btn btn-danger btn-sm">Xoa</button>
                  </form>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    res.send(layout('Quan ly phong', content, 'rooms'));
  } catch (err) {
    res.status(500).send('Loi: ' + err.message);
  }
});

// Them phong
app.post('/rooms/add', async (req, res) => {
  const { name, type, price } = req.body;
  try {
    // Rang buoc: kiem tra ten phong da ton tai chua
    const check = await pool.query('SELECT id FROM rooms WHERE name = $1', [name]);
    if (check.rowCount > 0) {
      return res.redirect('/rooms?error=' + encodeURIComponent('Ten phong da ton tai!'));
    }
    // Rang buoc: gia phai > 0
    if (Number(price) <= 0) {
      return res.redirect('/rooms?error=' + encodeURIComponent('Gia phong phai lon hon 0!'));
    }
    await pool.query(
      'INSERT INTO rooms (name, type, price, status) VALUES ($1, $2, $3, $4)',
      [name, type, price, 'Trong']
    );
    res.redirect('/rooms?success=' + encodeURIComponent('Them phong thanh cong!'));
  } catch (err) {
    res.redirect('/rooms?error=' + encodeURIComponent(err.message));
  }
});

// Xoa phong
app.post('/rooms/delete/:id', async (req, res) => {
  try {
    // Rang buoc: khong xoa phong dang co booking
    const check = await pool.query("SELECT id FROM bookings WHERE room_id = $1 AND status = 'Da dat'", [req.params.id]);
    if (check.rowCount > 0) {
      return res.redirect('/rooms?error=' + encodeURIComponent('Khong the xoa phong dang co dat cho!'));
    }
    await pool.query('DELETE FROM rooms WHERE id = $1', [req.params.id]);
    res.redirect('/rooms?success=' + encodeURIComponent('Xoa phong thanh cong!'));
  } catch (err) {
    res.redirect('/rooms?error=' + encodeURIComponent(err.message));
  }
});

// ============ QUAN LY KHACH HANG ============
app.get('/customers', async (req, res) => {
  try {
    const customers = await pool.query('SELECT * FROM customers ORDER BY id');
    const content = `
      <h1 class="page-title">👥 Quan ly Khach hang</h1>
      ${req.query.success ? '<div class="alert alert-success">✅ ' + req.query.success + '</div>' : ''}
      ${req.query.error ? '<div class="alert alert-error">❌ ' + req.query.error + '</div>' : ''}

      <div class="card">
        <h2 class="card-title">➕ Them khach hang moi</h2>
        <form action="/customers/add" method="POST">
          <div class="form-row">
            <div class="form-group">
              <label>Ho ten *</label>
              <input type="text" name="full_name" placeholder="Nguyen Van C" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="c@gmail.com">
            </div>
            <div class="form-group">
              <label>So dien thoai</label>
              <input type="text" name="phone" placeholder="0912345678" pattern="[0-9]{10,11}">
            </div>
          </div>
          <button type="submit" class="btn btn-success">Them khach hang</button>
        </form>
      </div>

      <div class="card">
        <h2 class="card-title">📋 Danh sach khach hang (${customers.rowCount})</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Ho ten</th><th>Email</th><th>So dien thoai</th><th>Ngay tao</th></tr>
          </thead>
          <tbody>
            ${customers.rows.map(c => `
              <tr>
                <td>${c.id}</td>
                <td><strong>${c.full_name}</strong></td>
                <td>${c.email || '-'}</td>
                <td>${c.phone || '-'}</td>
                <td>${new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    res.send(layout('Quan ly khach hang', content, 'customers'));
  } catch (err) {
    res.status(500).send('Loi: ' + err.message);
  }
});

// Them khach hang
app.post('/customers/add', async (req, res) => {
  const { full_name, email, phone } = req.body;
  try {
    // Rang buoc: ho ten khong duoc de trong
    if (!full_name || full_name.trim() === '') {
      return res.redirect('/customers?error=' + encodeURIComponent('Ho ten khong duoc de trong!'));
    }
    // Rang buoc: so dien thoai hop le (neu co)
    if (phone && !/^[0-9]{10,11}$/.test(phone)) {
      return res.redirect('/customers?error=' + encodeURIComponent('So dien thoai phai co 10-11 chu so!'));
    }
    await pool.query(
      'INSERT INTO customers (full_name, email, phone) VALUES ($1, $2, $3)',
      [full_name.trim(), email || null, phone || null]
    );
    res.redirect('/customers?success=' + encodeURIComponent('Them khach hang thanh cong!'));
  } catch (err) {
    res.redirect('/customers?error=' + encodeURIComponent(err.message));
  }
});

// ============ QUAN LY DAT PHONG ============
app.get('/bookings', async (req, res) => {
  try {
    const bookings = await pool.query(`
      SELECT b.id, c.full_name, c.phone, r.name AS room_name, r.type AS room_type,
             b.check_in, b.check_out, b.status, b.created_at
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.id DESC
    `);
    const customers = await pool.query('SELECT * FROM customers ORDER BY full_name');
    const availableRooms = await pool.query("SELECT * FROM rooms WHERE status = 'Trong' ORDER BY name");

    const content = `
      <h1 class="page-title">📅 Quan ly Dat phong</h1>
      ${req.query.success ? '<div class="alert alert-success">✅ ' + req.query.success + '</div>' : ''}
      ${req.query.error ? '<div class="alert alert-error">❌ ' + req.query.error + '</div>' : ''}

      <div class="card">
        <h2 class="card-title">➕ Dat phong moi</h2>
        <form action="/bookings/add" method="POST">
          <div class="form-row">
            <div class="form-group">
              <label>Khach hang *</label>
              <select name="customer_id" required>
                <option value="">-- Chon khach hang --</option>
                ${customers.rows.map(c => `<option value="${c.id}">${c.full_name} ${c.phone ? '(' + c.phone + ')' : ''}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Phong *</label>
              <select name="room_id" required>
                <option value="">-- Chon phong --</option>
                ${availableRooms.rows.map(r => `<option value="${r.id}">${r.name} - ${r.type} (${Number(r.price).toLocaleString()} VND)</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Ngay check-in *</label>
              <input type="date" name="check_in" required min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
              <label>Ngay check-out *</label>
              <input type="date" name="check_out" required min="${new Date().toISOString().split('T')[0]}">
            </div>
          </div>
          <button type="submit" class="btn btn-success">Dat phong</button>
        </form>
      </div>

      <div class="card">
        <h2 class="card-title">📋 Danh sach dat phong (${bookings.rowCount})</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Khach hang</th><th>Phong</th><th>Check-in</th><th>Check-out</th><th>Trang thai</th><th>Hanh dong</th></tr>
          </thead>
          <tbody>
            ${bookings.rows.map(b => `
              <tr>
                <td>${b.id}</td>
                <td><strong>${b.full_name}</strong><br><small style="color:#999;">${b.phone || ''}</small></td>
                <td>${b.room_name}<br><small style="color:#999;">${b.room_type}</small></td>
                <td>${new Date(b.check_in).toLocaleDateString('vi-VN')}</td>
                <td>${new Date(b.check_out).toLocaleDateString('vi-VN')}</td>
                <td><span class="badge badge-warning">${b.status}</span></td>
                <td>
                  <form action="/bookings/cancel/${b.id}" method="POST" style="display:inline;" onsubmit="return confirm('Ban chac chan huy dat phong nay?');">
                    <button type="submit" class="btn btn-danger btn-sm">Huy</button>
                  </form>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    res.send(layout('Quan ly dat phong', content, 'bookings'));
  } catch (err) {
    res.status(500).send('Loi: ' + err.message);
  }
});

// Dat phong voi rang buoc
app.post('/bookings/add', async (req, res) => {
  const { customer_id, room_id, check_in, check_out } = req.body;
  try {
    // Rang buoc 1: Ngay check-out phai sau check-in
    if (new Date(check_out) <= new Date(check_in)) {
      return res.redirect('/bookings?error=' + encodeURIComponent('Ngay check-out phai sau ngay check-in!'));
    }
    // Rang buoc 2: Khong dat ngay trong qua khu
    const today = new Date().toISOString().split('T')[0];
    if (check_in < today) {
      return res.redirect('/bookings?error=' + encodeURIComponent('Khong the dat phong cho ngay trong qua khu!'));
    }
    // Rang buoc 3: Kiem tra trung lich
    const conflict = await pool.query(`
      SELECT id FROM bookings
      WHERE room_id = $1
        AND status = 'Da dat'
        AND (check_in < $3 AND check_out > $2)
    `, [room_id, check_in, check_out]);
    if (conflict.rowCount > 0) {
      return res.redirect('/bookings?error=' + encodeURIComponent('Phong da duoc dat trong khoang thoi gian nay!'));
    }
    // Tao booking
    await pool.query(
      'INSERT INTO bookings (customer_id, room_id, check_in, check_out, status) VALUES ($1, $2, $3, $4, $5)',
      [customer_id, room_id, check_in, check_out, 'Da dat']
    );
    // Cap nhat trang thai phong
    await pool.query("UPDATE rooms SET status = 'Da dat' WHERE id = $1", [room_id]);
    res.redirect('/bookings?success=' + encodeURIComponent('Dat phong thanh cong!'));
  } catch (err) {
    res.redirect('/bookings?error=' + encodeURIComponent(err.message));
  }
});

// Huy dat phong
app.post('/bookings/cancel/:id', async (req, res) => {
  try {
    const booking = await pool.query('SELECT room_id FROM bookings WHERE id = $1', [req.params.id]);
    if (booking.rowCount === 0) {
      return res.redirect('/bookings?error=' + encodeURIComponent('Khong tim thay dat phong!'));
    }
    const room_id = booking.rows[0].room_id;
    await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
    // Kiem tra xem phong con booking nao khac khong
    const remaining = await pool.query("SELECT id FROM bookings WHERE room_id = $1 AND status = 'Da dat'", [room_id]);
    if (remaining.rowCount === 0) {
      await pool.query("UPDATE rooms SET status = 'Trong' WHERE id = $1", [room_id]);
    }
    res.redirect('/bookings?success=' + encodeURIComponent('Huy dat phong thanh cong!'));
  } catch (err) {
    res.redirect('/bookings?error=' + encodeURIComponent(err.message));
  }
});

// API kiem tra suc khoe
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Server dang chay tai http://0.0.0.0:${port}`);
});
