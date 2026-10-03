document.addEventListener('DOMContentLoaded', function () {
  if (document.body.dataset.page !== 'admin') return;

  const adminSession = ResinArt.getAdminSession();
  const adminShell = document.getElementById('admin-shell');
  const loginBox = document.getElementById('admin-login-box');

  if (!adminSession) {
    adminShell.style.display = 'none';
    loginBox.style.display = 'block';
    const form = document.getElementById('admin-login-form');
    form?.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = document.getElementById('admin-email').value.trim();
      const password = document.getElementById('admin-password').value;
      if (email === 'admin@theresinartclub.com' && password === 'admin123') {
        ResinArt.setAdminSession({ email, role: 'admin' });
        window.location.reload();
      } else {
        ResinArt.showToast('Admin credentials invalid', 'error');
      }
    });
    return;
  }

  loginBox.style.display = 'none';
  adminShell.style.display = 'block';

  const navs = document.querySelectorAll('[data-admin-section]');
  const content = document.getElementById('admin-content');
  const activeValue = document.body.dataset.section || 'dashboard';

  function renderDashboard() {
    const products = ResinArt.getProducts();
    const orders = ResinArt.getOrders();
    const customers = ResinArt.getCustomers();
    const customOrders = JSON.parse(localStorage.getItem(ResinArt.STORAGE_KEYS.customOrders) || '[]');
    const messages = JSON.parse(localStorage.getItem(ResinArt.STORAGE_KEYS.contactMessages) || '[]');
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const pending = orders.filter(order => order.orderStatus === 'Pending').length;
    const processing = orders.filter(order => order.orderStatus === 'Processing').length;
    const delivered = orders.filter(order => order.orderStatus === 'Delivered').length;
    const lowStock = products.filter(product => product.stock > 0 && product.stock <= 5).length;

    content.innerHTML = `
      <div class="stats-grid">
        <div class="stat-box"><small>Total Products</small><strong>${products.length}</strong></div>
        <div class="stat-box"><small>Total Orders</small><strong>${orders.length}</strong></div>
        <div class="stat-box"><small>Total Customers</small><strong>${customers.length}</strong></div>
        <div class="stat-box"><small>Total Revenue</small><strong>${ResinArt.formatPrice(totalRevenue)}</strong></div>
        <div class="stat-box"><small>Pending Orders</small><strong>${pending}</strong></div>
        <div class="stat-box"><small>Processing Orders</small><strong>${processing}</strong></div>
        <div class="stat-box"><small>Delivered Orders</small><strong>${delivered}</strong></div>
        <div class="stat-box"><small>Low Stock</small><strong>${lowStock}</strong></div>
        <div class="stat-box"><small>Custom Requests</small><strong>${customOrders.length}</strong></div>
        <div class="stat-box"><small>Contact Messages</small><strong>${messages.length}</strong></div>
      </div>
      <div class="admin-panel-card">
        <h3>Recent Orders</h3>
        <div class="admin-table-wrap">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              ${orders.slice(0,5).map(order => `<tr><td>${order.id}</td><td>${order.customer}</td><td>${new Date(order.date).toLocaleDateString()}</td><td>${ResinArt.formatPrice(order.total)}</td><td><span class="badge ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderProducts() {
    const products = ResinArt.getProducts();
    content.innerHTML = `
      <div class="admin-panel-card">
        <div class="shop-toolbar">
          <h3>Products</h3>
          <button class="btn btn-primary" onclick="document.getElementById('product-form').scrollIntoView({behavior:'smooth'});">Add Product</button>
        </div>
        <form id="product-form" class="form-grid" style="margin-top:18px;">
          <div class="form-row full"><label>Product Name</label><input class="form-field" id="new-product-name" /></div>
          <div class="form-row"><label>Category</label><input class="form-field" id="new-product-category" /></div>
          <div class="form-row"><label>Price</label><input type="number" class="form-field" id="new-product-price" /></div>
          <div class="form-row"><label>Stock</label><input type="number" class="form-field" id="new-product-stock" /></div>
          <div class="form-row full"><button class="btn btn-primary" type="button" id="save-product-btn">Save Product</button></div>
        </form>
        <div class="admin-table-wrap" style="margin-top:18px;">
          <table>
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              ${products.map(product => `<tr><td>${product.name}</td><td>${product.category}</td><td>${ResinArt.formatPrice(product.price)}</td><td>${product.stock}</td><td><button class="btn btn-ghost" type="button" data-delete-product="${product.id}">Delete</button></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('save-product-btn')?.addEventListener('click', function () {
      const name = document.getElementById('new-product-name').value.trim();
      const category = document.getElementById('new-product-category').value.trim();
      const price = Number(document.getElementById('new-product-price').value || 0);
      const stock = Number(document.getElementById('new-product-stock').value || 0);
      if (!name || !category) return;
      const products = ResinArt.getProducts();
      products.push({ id: `admin-${Date.now()}`, name, category, price, oldPrice: price, discount: 0, rating: 4.5, reviews: 0, stock, featured: false, bestseller: false, newArrival: false, sku: `ADM-${products.length + 1}`, description: 'New designer piece from the admin panel.', tags: [category.toLowerCase()], images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80'], material: 'Resin', dimensions: 'Custom', weight: 'Custom', care: 'Handle carefully', processing: 'Custom', delivery: 'Nationwide', options: { sizes: ['Standard'], colors: ['Natural'], designs: ['Classic'] } });
      localStorage.setItem(ResinArt.STORAGE_KEYS.products, JSON.stringify(products));
      renderProducts();
    });

    document.querySelectorAll('[data-delete-product]').forEach(button => {
      button.addEventListener('click', function () {
        const products = ResinArt.getProducts().filter(item => item.id !== this.dataset.deleteProduct);
        localStorage.setItem(ResinArt.STORAGE_KEYS.products, JSON.stringify(products));
        renderProducts();
      });
    });
  }

  function renderCategories() {
    const categories = ResinArt.getCategories();
    content.innerHTML = `
      <div class="admin-panel-card">
        <h3>Categories</h3>
        <form id="category-form" class="form-grid" style="margin-top:18px;">
          <div class="form-row full"><label>Category Name</label><input class="form-field" id="new-category-name" /></div>
          <div class="form-row full"><button class="btn btn-primary" type="button" id="save-category-btn">Add Category</button></div>
        </form>
        <div class="admin-table-wrap" style="margin-top:18px;">
          <table>
            <thead><tr><th>Name</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${categories.map(category => `<tr><td>${category.name}</td><td>${category.active ? 'Active' : 'Disabled'}</td><td><button class="btn btn-ghost" data-delete-category="${category.id}">Delete</button></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('save-category-btn')?.addEventListener('click', function () {
      const name = document.getElementById('new-category-name').value.trim();
      if (!name) return;
      const categories = ResinArt.getCategories();
      categories.push({ id: `cat-${Date.now()}`, name, active: true });
      localStorage.setItem(ResinArt.STORAGE_KEYS.categories, JSON.stringify(categories));
      renderCategories();
    });

    document.querySelectorAll('[data-delete-category]').forEach(button => {
      button.addEventListener('click', function () {
        const categories = ResinArt.getCategories().filter(item => item.id !== this.dataset.deleteCategory);
        localStorage.setItem(ResinArt.STORAGE_KEYS.categories, JSON.stringify(categories));
        renderCategories();
      });
    });
  }

  function renderOrders() {
    const orders = ResinArt.getOrders();
    content.innerHTML = `
      <div class="admin-panel-card">
        <h3>Orders</h3>
        <div class="admin-table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Customer</th><th>Date</th><th>Amount</th><th>Payment</th><th>Status</th></tr></thead>
            <tbody>
              ${orders.map(order => `<tr><td>${order.id}</td><td>${order.customer}</td><td>${new Date(order.date).toLocaleDateString()}</td><td>${ResinArt.formatPrice(order.total)}</td><td>${order.paymentStatus}</td><td><span class="badge ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderCustomers() {
    const customers = ResinArt.getCustomers();
    content.innerHTML = `
      <div class="admin-panel-card">
        <h3>Customers</h3>
        <div class="admin-table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th></tr></thead>
            <tbody>
              ${customers.map(customer => `<tr><td>${customer.fullName}</td><td>${customer.email}</td><td>${customer.phone}</td><td>${customer.orders || 0}</td><td>${ResinArt.formatPrice(customer.totalSpent || 0)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderReviews() {
    const reviews = ResinArt.getReviews();
    content.innerHTML = `
      <div class="admin-panel-card">
        <h3>Reviews</h3>
        <div class="admin-table-wrap">
          <table>
            <thead><tr><th>Customer</th><th>Rating</th><th>Review</th><th>Action</th></tr></thead>
            <tbody>
              ${reviews.map(review => `<tr><td>${review.customer}</td><td>${review.rating}/5</td><td>${review.review}</td><td><button class="btn btn-ghost" data-delete-review="${review.id}">Delete</button></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.querySelectorAll('[data-delete-review]').forEach(button => {
      button.addEventListener('click', function () {
        const reviews = ResinArt.getReviews().filter(item => item.id !== this.dataset.deleteReview);
        localStorage.setItem(ResinArt.STORAGE_KEYS.reviews, JSON.stringify(reviews));
        renderReviews();
      });
    });
  }

  function renderCoupons() {
    const coupons = JSON.parse(localStorage.getItem(ResinArt.STORAGE_KEYS.coupons) || '[]');
    content.innerHTML = `
      <div class="admin-panel-card">
        <h3>Coupons</h3>
        <form id="coupon-form-admin" class="form-grid">
          <div class="form-row"><label>Code</label><input class="form-field" id="coupon-code-admin" /></div>
          <div class="form-row"><label>Value</label><input type="number" class="form-field" id="coupon-value-admin" /></div>
          <div class="form-row"><label>Type</label><select class="form-field" id="coupon-type-admin"><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select></div>
          <div class="form-row"><label>Min Order</label><input type="number" class="form-field" id="coupon-min-order-admin" /></div>
          <div class="form-row full"><button type="button" class="btn btn-primary" id="save-coupon-btn">Add Coupon</button></div>
        </form>
        <div class="admin-table-wrap" style="margin-top:18px;">
          <table>
            <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min</th><th>Active</th></tr></thead>
            <tbody>
              ${coupons.map(coupon => `<tr><td>${coupon.code}</td><td>${coupon.type}</td><td>${coupon.value}</td><td>${ResinArt.formatPrice(coupon.minOrder || 0)}</td><td>${coupon.active ? 'Yes' : 'No'}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('save-coupon-btn')?.addEventListener('click', function () {
      const code = document.getElementById('coupon-code-admin').value.trim();
      const value = Number(document.getElementById('coupon-value-admin').value || 0);
      const type = document.getElementById('coupon-type-admin').value;
      const minOrder = Number(document.getElementById('coupon-min-order-admin').value || 0);
      if (!code) return;
      const coupons = JSON.parse(localStorage.getItem(ResinArt.STORAGE_KEYS.coupons) || '[]');
      coupons.push({ id: `coupon-${Date.now()}`, code, value, type, minOrder, expiry: '2027-12-31', usageLimit: 20, active: true });
      localStorage.setItem(ResinArt.STORAGE_KEYS.coupons, JSON.stringify(coupons));
      renderCoupons();
    });
  }

  function renderMessages() {
    const messages = JSON.parse(localStorage.getItem(ResinArt.STORAGE_KEYS.contactMessages) || '[]');
    content.innerHTML = `
      <div class="admin-panel-card">
        <h3>Messages</h3>
        <div class="admin-table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th></tr></thead>
            <tbody>
              ${messages.length ? messages.map(message => `<tr><td>${message.name}</td><td>${message.email}</td><td>${message.phone}</td><td>${message.message}</td></tr>`).join('') : '<tr><td colspan="4">No messages yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderSettings() {
    const settings = ResinArt.getSettings();
    content.innerHTML = `
      <div class="admin-panel-card">
        <h3>Store Settings</h3>
        <form id="settings-form" class="form-grid">
          <div class="form-row"><label>Store Name</label><input class="form-field" id="setting-store-name" value="${settings.storeName}" /></div>
          <div class="form-row"><label>Phone</label><input class="form-field" id="setting-phone" value="${settings.phone}" /></div>
          <div class="form-row"><label>Email</label><input class="form-field" id="setting-email" value="${settings.email}" /></div>
          <div class="form-row"><label>Address</label><input class="form-field" id="setting-address" value="${settings.address}" /></div>
          <div class="form-row"><label>Delivery Fee</label><input type="number" class="form-field" id="setting-delivery-fee" value="${settings.deliveryFee}" /></div>
          <div class="form-row"><label>Free Delivery Threshold</label><input type="number" class="form-field" id="setting-threshold" value="${settings.freeDeliveryThreshold}" /></div>
          <div class="form-row full"><button type="button" class="btn btn-primary" id="save-settings-btn">Save Settings</button></div>
        </form>
      </div>
    `;
    document.getElementById('save-settings-btn')?.addEventListener('click', function () {
      const payload = {
        storeName: document.getElementById('setting-store-name').value,
        phone: document.getElementById('setting-phone').value,
        email: document.getElementById('setting-email').value,
        address: document.getElementById('setting-address').value,
        deliveryFee: Number(document.getElementById('setting-delivery-fee').value || 0),
        freeDeliveryThreshold: Number(document.getElementById('setting-threshold').value || 0)
      };
      ResinArt.saveSettings({ ...ResinArt.getSettings(), ...payload });
      ResinArt.showToast('Settings saved', 'success');
      ResinArt.renderHeader();
    });
  }

  function renderInventory() {
    const products = ResinArt.getProducts();
    const inStock = products.filter(item => item.stock > 5).length;
    const lowStock = products.filter(item => item.stock > 0 && item.stock <= 5).length;
    const outOfStock = products.filter(item => item.stock === 0).length;
    content.innerHTML = `
      <div class="admin-panel-card">
        <h3>Inventory</h3>
        <div class="stats-grid">
          <div class="stat-box"><small>In Stock</small><strong>${inStock}</strong></div>
          <div class="stat-box"><small>Low Stock</small><strong>${lowStock}</strong></div>
          <div class="stat-box"><small>Out of Stock</small><strong>${outOfStock}</strong></div>
        </div>
        <div class="admin-table-wrap" style="margin-top:18px;">
          <table>
            <thead><tr><th>Product</th><th>Stock</th><th>Status</th></tr></thead>
            <tbody>
              ${products.map(product => `<tr><td>${product.name}</td><td>${product.stock}</td><td>${product.stock === 0 ? '<span class="badge cancelled">Out of Stock</span>' : product.stock <= 5 ? '<span class="badge pending">Low Stock</span>' : '<span class="badge delivered">In Stock</span>'}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderCustomOrders() {
    const items = JSON.parse(localStorage.getItem(ResinArt.STORAGE_KEYS.customOrders) || '[]');
    content.innerHTML = `
      <div class="admin-panel-card">
        <h3>Custom Order Requests</h3>
        <div class="admin-table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Customer</th><th>Product</th><th>Status</th></tr></thead>
            <tbody>
              ${items.length ? items.map(item => `<tr><td>${item.id}</td><td>${item.fullName}</td><td>${item.productType}</td><td><span class="badge ${item.status.toLowerCase().replace(/\s+/g,'-')}">${item.status}</span></td></tr>`).join('') : '<tr><td colspan="4">No custom requests yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderNewsletter() {
    const items = JSON.parse(localStorage.getItem(ResinArt.STORAGE_KEYS.newsletter) || '[]');
    content.innerHTML = `
      <div class="admin-panel-card">
        <h3>Newsletter Subscribers</h3>
        <div class="admin-table-wrap">
          <table>
            <thead><tr><th>Email</th><th>Subscription Date</th></tr></thead>
            <tbody>
              ${items.length ? items.map(item => `<tr><td>${item.email}</td><td>${new Date(item.date).toLocaleDateString()}</td></tr>`).join('') : '<tr><td colspan="2">No subscribers yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderSection(section) {
    switch (section) {
      case 'dashboard': renderDashboard(); break;
      case 'products': renderProducts(); break;
      case 'categories': renderCategories(); break;
      case 'orders': renderOrders(); break;
      case 'customers': renderCustomers(); break;
      case 'reviews': renderReviews(); break;
      case 'coupons': renderCoupons(); break;
      case 'inventory': renderInventory(); break;
      case 'custom-orders': renderCustomOrders(); break;
      case 'messages': renderMessages(); break;
      case 'newsletter': renderNewsletter(); break;
      case 'settings': renderSettings(); break;
      default: renderDashboard();
    }
  }

  navs.forEach(link => {
    link.addEventListener('click', function () {
      navs.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      renderSection(this.dataset.adminSection);
    });
  });

  renderSection(activeValue);

  document.getElementById('logout-admin')?.addEventListener('click', function () {
    ResinArt.setAdminSession(null);
    window.location.reload();
  });
});
