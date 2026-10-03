document.addEventListener('DOMContentLoaded', function () {
  if (document.body.dataset.page !== 'checkout') return;

  const cart = ResinArt.getCart();
  const summaryContainer = document.getElementById('checkout-summary');
  const couponForm = document.getElementById('coupon-form');
  const paymentForm = document.getElementById('checkout-form');

  function renderCheckoutSummary() {
    if (!cart.length) {
      summaryContainer.innerHTML = '<div class="empty-state"><h3>Your cart is empty</h3><p>Add products before checkout.</p></div>';
      return;
    }
    let subtotal = 0;
    summaryContainer.innerHTML = cart.map(item => {
      const product = ResinArt.getProductById(item.productId);
      if (!product) return '';
      subtotal += product.price * item.quantity;
      return `
        <div class="cart-item" style="margin-bottom:12px;">
          <img src="${product.images[0]}" alt="${product.name}" />
          <div>
            <h3>${product.name}</h3>
            <small>${product.category}</small>
            <p>Qty: ${item.quantity}</p>
          </div>
          <strong>${ResinArt.formatPrice(product.price * item.quantity)}</strong>
        </div>
      `;
    }).join('');

    const settings = ResinArt.getSettings();
    const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
    const total = subtotal + deliveryFee;
    document.getElementById('summary-subtotal').textContent = ResinArt.formatPrice(subtotal);
    document.getElementById('summary-delivery').textContent = ResinArt.formatPrice(deliveryFee);
    document.getElementById('summary-total').textContent = ResinArt.formatPrice(total);
    document.getElementById('checkout-total-hidden').value = total;
  }

  renderCheckoutSummary();

  if (couponForm) {
    couponForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const code = document.getElementById('coupon-code').value.trim();
      const coupons = JSON.parse(localStorage.getItem(ResinArt.STORAGE_KEYS.coupons) || '[]');
      const match = coupons.find(coupon => coupon.code.toUpperCase() === code.toUpperCase() && coupon.active);
      if (!match) {
        ResinArt.showToast('Coupon not valid', 'error');
        return;
      }
      const subtotal = cart.reduce((total, item) => {
        const product = ResinArt.getProductById(item.productId);
        return total + ((product ? product.price : 0) * item.quantity);
      }, 0);
      if (subtotal < match.minOrder) {
        ResinArt.showToast(`Coupon requires a minimum order of ${ResinArt.formatPrice(match.minOrder)}`, 'error');
        return;
      }
      const discount = match.type === 'percentage' ? (subtotal * match.value) / 100 : match.value;
      const total = subtotal + (subtotal >= ResinArt.getSettings().freeDeliveryThreshold ? 0 : ResinArt.getSettings().deliveryFee) - discount;
      document.getElementById('summary-discount').textContent = `-${ResinArt.formatPrice(discount)}`;
      document.getElementById('summary-total').textContent = ResinArt.formatPrice(total);
      document.getElementById('checkout-total-hidden').value = total;
      ResinArt.showToast('Coupon applied successfully', 'success');
    });
  }

  if (paymentForm) {
    paymentForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const customer = ResinArt.getCurrentCustomer();
      if (!cart.length) {
        ResinArt.showToast('Cart is empty', 'error');
        return;
      }

      const formData = new FormData(paymentForm);
      const orderData = {
        id: `TRC-${Date.now().toString().slice(-6)}`,
        customer: formData.get('fullName'),
        email: formData.get('email'),
        address: `${formData.get('address')}, ${formData.get('city')}, ${formData.get('province')}, ${formData.get('postalCode')}`,
        products: cart.map(item => ({ productId: item.productId, quantity: item.quantity, price: ResinArt.getProductById(item.productId)?.price || 0 })),
        total: Number(formData.get('total') || 0),
        paymentMethod: 'JazzCash',
        transactionId: formData.get('transactionId') || `JC-${Date.now()}`,
        paymentStatus: 'Pending Verification',
        orderStatus: 'Pending',
        date: new Date().toISOString()
      };

      const orders = ResinArt.getOrders();
      orders.push(orderData);
      localStorage.setItem(ResinArt.STORAGE_KEYS.orders, JSON.stringify(orders));

      const customerList = ResinArt.getCustomers();
      if (customer && customer.email === orderData.email) {
        const match = customerList.find(item => item.email.toLowerCase() === customer.email.toLowerCase());
        if (match) {
          match.orders = (match.orders || 0) + 1;
          match.totalSpent = (match.totalSpent || 0) + orderData.total;
        }
        localStorage.setItem(ResinArt.STORAGE_KEYS.customers, JSON.stringify(customerList));
      }

      localStorage.setItem(ResinArt.STORAGE_KEYS.cart, JSON.stringify([]));
      ResinArt.renderHeader();
      paymentForm.innerHTML = `
        <div class="success-box">
          <h3>Payment submitted for verification</h3>
          <p>Your order has been placed successfully. We will verify your JazzCash payment and confirm the order.</p>
          <div style="display:flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
            <a href="orders.html" class="btn btn-primary">Track Order</a>
            <a href="shop.html" class="btn btn-secondary">Continue Shopping</a>
          </div>
        </div>
      `;
      document.getElementById('checkout-summary').innerHTML = '<div class="empty-state"><h3>Thank You for Your Order!</h3><p>Order No: '+orderData.id+'</p><p>Total: '+ResinArt.formatPrice(orderData.total)+'</p></div>';
      ResinArt.showToast('Order placed successfully', 'success');
    });
  }
});
