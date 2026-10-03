document.addEventListener('DOMContentLoaded', function () {
  if (document.body.dataset.page !== 'wishlist') return;

  const wrapper = document.getElementById('wishlist-items');

  function renderWishlist() {
    const wishlistIds = ResinArt.getWishlist();
    const products = ResinArt.getProducts();
    const items = products.filter(product => wishlistIds.includes(product.id));

    if (!items.length) {
      wrapper.innerHTML = `
        <div class="empty-state">
          <h2>Your wishlist is empty</h2>
          <p>Save your favorite resin pieces to come back later.</p>
          <a href="shop.html" class="btn btn-primary">Explore collection</a>
        </div>
      `;
      return;
    }

    wrapper.innerHTML = items.map(product => `
      <article class="product-card">
        <div class="product-media">
          <img src="${product.images[0]}" alt="${product.name}">
          <div class="product-actions">
            <button class="icon-btn is-active" type="button" data-remove-wishlist="${product.id}" aria-label="Remove from wishlist">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>
        <div class="product-body">
          <div class="product-meta"><span>${product.category}</span><span class="rating">★ ${product.rating}</span></div>
          <h3>${product.name}</h3>
          <div class="price-row">
            <span class="price">${ResinArt.formatPrice(product.price)}</span>
            <span class="price old">${product.oldPrice ? ResinArt.formatPrice(product.oldPrice) : ''}</span>
          </div>
          <div class="product-footer">
            <button class="btn btn-primary" type="button" data-add-to-cart="${product.id}">Move to Cart</button>
            <a href="product.html?id=${product.id}" class="btn btn-ghost">View</a>
          </div>
        </div>
      </article>
    `).join('');

    document.querySelectorAll('[data-remove-wishlist]').forEach(button => {
      button.addEventListener('click', function () {
        ResinArt.removeFromWishlist(this.dataset.removeWishlist);
        renderWishlist();
      });
    });

    document.querySelectorAll('[data-add-to-cart]').forEach(button => {
      button.addEventListener('click', function () {
        ResinArt.addToCart(this.dataset.addToCart, { size: 'Standard', color: 'Natural', design: 'Classic' }, 1);
      });
    });
  }

  renderWishlist();
});
