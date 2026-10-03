document.addEventListener('DOMContentLoaded', function () {
  if (document.body.dataset.page === 'login') {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const customers = ResinArt.getCustomers();
        const match = customers.find(customer => customer.email.toLowerCase() === email.toLowerCase() && customer.password === password);
        if (!match) {
          ResinArt.showToast('Invalid email or password', 'error');
          return;
        }

        ResinArt.saveCurrentCustomer(match);
        ResinArt.showToast('Login successful', 'success');
        setTimeout(() => { window.location.href = 'account.html'; }, 600);
      });
    }
  }

  if (document.body.dataset.page === 'register') {
    const form = document.getElementById('register-form');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const fullName = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const phone = document.getElementById('register-phone').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        if (!fullName || !email || !phone || !password || !confirmPassword) {
          ResinArt.showToast('Please complete all fields', 'error');
          return;
        }
        if (password !== confirmPassword) {
          ResinArt.showToast('Passwords do not match', 'error');
          return;
        }

        const customers = ResinArt.getCustomers();
        if (customers.some(customer => customer.email.toLowerCase() === email.toLowerCase())) {
          ResinArt.showToast('This email is already registered', 'error');
          return;
        }

        const newCustomer = {
          id: `cust-${Date.now()}`,
          fullName,
          email,
          phone,
          password,
          createdAt: new Date().toISOString(),
          orders: 0,
          totalSpent: 0
        };

        customers.push(newCustomer);
        localStorage.setItem(ResinArt.STORAGE_KEYS.customers, JSON.stringify(customers));
        ResinArt.saveCurrentCustomer(newCustomer);
        ResinArt.showToast('Registration successful', 'success');
        setTimeout(() => { window.location.href = 'account.html'; }, 600);
      });
    }
  }

  if (document.body.dataset.page === 'account') {
    const currentCustomer = ResinArt.getCurrentCustomer();
    if (!currentCustomer) {
      window.location.href = 'login.html';
      return;
    }

    const customerName = document.getElementById('customer-name');
    const customerEmail = document.getElementById('customer-email');
    const customerOrders = document.getElementById('customer-orders');
    const accountSummary = document.getElementById('account-summary');
    if (customerName) customerName.textContent = currentCustomer.fullName;
    if (customerEmail) customerEmail.textContent = currentCustomer.email;

    const orders = ResinArt.getOrders().filter(order => order.email === currentCustomer.email);
    customerOrders.innerHTML = orders.length ? orders.map(order => `
      <div class="tab-card">
        <strong>#${order.id}</strong>
        <p>${order.products.length} items</p>
        <p>${ResinArt.formatPrice(order.total)}</p>
        <span class="badge ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span>
      </div>
    `).join('') : '<p>You have no orders yet.</p>';

    accountSummary.innerHTML = `
      <div class="tabs-grid">
        <div class="tab-card"><strong>${orders.length}</strong><small>Orders</small></div>
        <div class="tab-card"><strong>${ResinArt.getWishlist().length}</strong><small>Saved</small></div>
        <div class="tab-card"><strong>${currentCustomer.phone}</strong><small>Phone</small></div>
        <div class="tab-card"><strong>${new Date(currentCustomer.createdAt).toLocaleDateString()}</strong><small>Joined</small></div>
      </div>
    `;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        ResinArt.saveCurrentCustomer(null);
        window.location.href = 'login.html';
      });
    }
  }

  if (document.body.dataset.page === 'orders') {
    const currentCustomer = ResinArt.getCurrentCustomer();
    if (!currentCustomer) {
      window.location.href = 'login.html';
      return;
    }

    const orders = ResinArt.getOrders().filter(order => order.email === currentCustomer.email);
    const wrapper = document.getElementById('order-list');
    if (!wrapper) return;
    wrapper.innerHTML = orders.length ? orders.map(order => `
      <div class="profile-panel" style="margin-bottom:12px;">
        <h3>Order ${order.id}</h3>
        <p>Placed: ${new Date(order.date).toLocaleDateString()}</p>
        <p>Total: ${ResinArt.formatPrice(order.total)}</p>
        <p>Payment: ${order.paymentStatus}</p>
        <div class="order-timeline">
          ${['Order Placed','Confirmed','Processing','Shipped','Delivered'].map((step, index) => {
            const active = ['Pending','Confirmed','Processing','Shipped','Delivered'].indexOf(order.orderStatus) >= index || (order.orderStatus === 'Pending' && index === 0);
            return `
              <div class="timeline-item ${active ? 'active' : ''}">
                <span class="timeline-dot"></span>
                <span class="timeline-label">${step}</span>
                ${index < 4 ? '<span class="timeline-line"></span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('') : '<div class="empty-state"><h3>No orders yet</h3><p>Your order history will appear here.</p></div>';
  }
});
