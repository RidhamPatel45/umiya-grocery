const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'umiya-grocery-secret-key-2025';

// ── Middleware ─────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve all project files from root folder
app.use(express.static(path.join(__dirname, '..')));

// ── MongoDB ────────────────────────────────────────────
mongoose.connect('mongodb://127.0.0.1:27017/umiya-grocery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ── Auth Middleware ────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
    next();
  });
}

// ═══════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, phone, loginId, password } = req.body;
    if (!name || !loginId || !password) return res.status(400).json({ message: 'Name, Login ID and Password are required' });
    const existing = await User.findOne({ loginId });
    if (existing) return res.status(400).json({ message: 'This Login ID is already taken' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, phone: phone || '', loginId, password: hashedPassword, role: 'user' });
    await user.save();
    res.json({ message: 'Account created successfully! Please login.' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { loginId, password } = req.body;
    const user = await User.findOne({ loginId });
    if (!user) return res.status(400).json({ message: 'Login ID not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, role: user.role, name: user.name, phone: user.phone, message: `Welcome back, ${user.name}!` });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// ═══════════════════════════════════════════════════════
// PRODUCT ROUTES
// ═══════════════════════════════════════════════════════

// Get all products (optionally filtered by category)
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isAvailable: true };
    if (category) query.category = category;
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load products', error: err.message });
  }
});

// Get all products for admin (including unavailable)
app.get('/api/admin/products', adminMiddleware, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed', error: err.message });
  }
});

// Add product (admin only)
app.post('/api/products', adminMiddleware, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: '✅ Product added successfully!', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err.message });
  }
});

// Update product (admin only)
app.put('/api/products/:id', adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: '✅ Product updated!', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update', error: err.message });
  }
});

// Delete product (admin only)
app.delete('/api/products/:id', adminMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Product deleted!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete', error: err.message });
  }
});

// ═══════════════════════════════════════════════════════
// ORDER ROUTES
// ═══════════════════════════════════════════════════════

// Save order (when customer sends WhatsApp)
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ message: 'Order saved!', orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save order', error: err.message });
  }
});

// Get all orders (admin only)
app.get('/api/orders', adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load orders', error: err.message });
  }
});

// Update order status (admin only)
app.put('/api/orders/:id/status', adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ message: 'Status updated!', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed', error: err.message });
  }
});

// ═══════════════════════════════════════════════════════
// DASHBOARD STATS (admin only)
// ═══════════════════════════════════════════════════════
app.get('/api/admin/stats', adminMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isAvailable: true });
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json({ totalProducts, totalOrders, totalUsers, pendingOrders, recentOrders });
  } catch (err) {
    res.status(500).json({ message: 'Failed', error: err.message });
  }
});

// ═══════════════════════════════════════════════════════
// CREATE DEFAULT ADMIN ON FIRST RUN
// ═══════════════════════════════════════════════════════
async function createDefaultAdmin() {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await new User({
      name: 'Admin',
      phone: '9825919650',
      loginId: 'admin',
      password: hashed,
      role: 'admin'
    }).save();
    console.log('👤 Default admin created → Login ID: admin | Password: admin123');
  }
}

// ── Start Server ───────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`🚀 Umiya Grocery Server running at http://localhost:${PORT}`);
  console.log(`📦 Admin Panel: http://localhost:${PORT}/admin/`);
  console.log(`🛒 Shop: http://localhost:${PORT}/`);
  await createDefaultAdmin();
});
