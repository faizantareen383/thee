document.addEventListener('DOMContentLoaded', function () {
  if (document.body.dataset.page !== 'cart') return;

  const cartItems = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');

  function renderCart() {
    const cart = ResinArt.getCart();
    const products = ResinArt.getProducts();

    if (!cart.length) {
      cartItems.innerHTML = `
        <div class="empty-state">
          <h2>Your cart is empty</h2>
          <p>Start browsing our handcrafted resin pieces and add some to your bag.</p>
          <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
      cartSummary.innerHTML = `
        <div class="summary-card">
          <h3>Order Summary</h3>
          <div class="summary-row"><span>Subtotal</span><span>${ResinArt.formatPrice(0)}</span></div>
          <div class="summary-row"><span>Delivery fee</span><span>${ResinArt.formatPrice(0)}</span></div>
          <div class="summary-row"><span>Discount</span><span>${ResinArt.formatPrice(0)}</span></div>
          <div class="summary-total"><span>Total</span><span>${ResinArt.formatPrice(0)}</span></div>
        </div>
      `;
      return;
    }

    let subtotal = 0;
    cartItems.innerHTML = cart.map(item => {
      const product = products.find(productItem => productItem.id === item.productId);
      if (!product) return '';
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      return `
        <div class="cart-item">
          <img src="${product.images[0]}" alt="${product.name}" />
          <div>
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <p>Options: ${Object.values(item.options || {}).join(' / ') || 'Default'}</p>
            <div class="qty-box">
              <button type="button" data-cart-adjust="decrease" data-cart-id="${product.id}">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-cart-adjust="increase" data-cart-id="${product.id}">+</button>
            </div>
          </div>
          <div style="text-align: right;">
            <strong>${ResinArt.formatPrice(itemTotal)}</strong>
            <div style="margin-top: 10px;"><button class="btn btn-ghost" type="button" data-remove-from-cart="${product.id}">Remove</button></div>
          </div>
        </div>
      `;
    }).join('');

    const settings = ResinArt.getSettings();
    const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
    const discount = 0;
    const total = subtotal + deliveryFee - discount;

    cartSummary.innerHTML = `
      <div class="summary-card">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>${ResinArt.formatPrice(subtotal)}</span></div>
        <div class="summary-row"><span>Delivery fee</span><span>${ResinArt.formatPrice(deliveryFee)}</span></div>
        <div class="summary-row"><span>Discount</span><span>${ResinArt.formatPrice(discount)}</span></div>
        <div class="summary-total"><span>Total</span><span>${ResinArt.formatPrice(total)}</span></div>
        <div style="display:grid; gap:12px; margin-top:18px;">
          <a href="shop.html" class="btn btn-ghost">Continue Shopping</a>
          <a href="checkout.html" class="btn btn-primary">Proceed to Checkout</a>
        </div>
      </div>
    `;

    document.querySelectorAll('[data-remove-from-cart]').forEach(button => button.addEventListener('click', function () {
      ResinArt.removeFromCart(this.dataset.removeFromCart);
      renderCart();
    }));

    document.querySelectorAll('[data-cart-adjust]').forEach(button => {
      button.addEventListener('click', function () {
        const productId = this.dataset.cartId;
        const cart = ResinArt.getCart();
        const item = cart.find(entry => entry.productId === productId);
        if (!item) return;
        const change = this.dataset.cartAdjust === 'increase' ? 1 : -1;
        item.quantity = Math.max(1, item.quantity + change);
        ResinArt.saveCart(cart);
        ResinArt.renderHeader();
        renderCart();
      });
    });
  }

  renderCart();
});
