const CART_KEY = 'umiya_cart';

const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  },

  save(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    Cart.updateBadge();
  },

  add(product) {
    const cart = Cart.get();
    const existing = cart.find(i => i._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    Cart.save(cart);
    Cart.showToast('✅ ' + product.name + ' added to cart!');
  },

  remove(productId) {
    Cart.save(Cart.get().filter(i => i._id !== productId));
  },

  updateQty(productId, qty) {
    if (qty <= 0) { Cart.remove(productId); return; }
    const cart = Cart.get();
    const item = cart.find(i => i._id === productId);
    if (item) item.quantity = qty;
    Cart.save(cart);
  },

  clear() {
    localStorage.removeItem(CART_KEY);
    Cart.updateBadge();
  },

  count() {
    return Cart.get().reduce((sum, i) => sum + i.quantity, 0);
  },

  total() {
    return Cart.get().reduce((sum, i) => sum + (i.price * i.quantity), 0);
  },

  updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = Cart.count();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  showToast(msg) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.style.cssText = [
        'position:fixed', 'bottom:80px', 'right:20px',
        'background:#1b5e20', 'color:white', 'padding:12px 20px',
        'border-radius:10px', 'font-weight:600', 'z-index:99999',
        'transition:opacity 0.4s', 'box-shadow:0 4px 15px rgba(0,0,0,0.3)',
        'font-size:0.95rem', 'max-width:280px'
      ].join(';');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2800);
  }
};

// Auto-update badge on load
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
