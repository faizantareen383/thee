document.addEventListener('DOMContentLoaded', function () {
  const page = document.body.dataset.page || 'default';

  if (page === 'home') {
    renderHomeSections();
  }

  if (page === 'shop') {
    renderShopPage();
  }

  if (page === 'product') {
    renderProductPage();
  }
});

function renderHomeSections() {
  const products = ResinArt.getProducts();
  const categories = ResinArt.getCategories();

  const featured = products.filter(product => product.featured).slice(0, 4);
  const bestSellers = products.filter(product => product.bestseller).slice(0, 4);
  const newArrivals = products.filter(product => product.newArrival).slice(0, 4);

  const categoryWrap = document.getElementById('home-categories');
  if (categoryWrap) {
    categoryWrap.innerHTML = categories.map(category => `
      <a class="category-card" href="shop.html?category=${encodeURIComponent(category.id)}">
        <div class="category-thumb">
          <img src="https://images.unsplash.com/${category.id === 'resin-trays' ? 'photo-1517705008128-361805f42e86' : category.id === 'resin-coasters' ? 'photo-1505693416388-ac5ce068fe85' : category.id === 'keychains' ? 'photo-1523170335258-f5ed11844a49' : category.id === 'jewelry' ? 'photo-1515377905703-c4788e51af15' : category.id === 'home-decor' ? 'photo-1524758631624-e2822e304c36' : category.id === 'customized-gifts' ? 'photo-1494526585095-c41746248156' : category.id === 'wall-art' ? 'photo-1460661419201-fd4cecdf8a8b' : category.id === 'resin-clocks' ? 'photo-1505693416388-ac5ce068fe85' : 'photo-1517705008128-361805f42e86'}?auto=format&fit=crop&w=900&q=80" alt="${category.name}">
        </div>
        <h3>${category.name}</h3>
      </a>
    `).join('');
  }

  const featuredWrap = document.getElementById('featured-products');
  if (featuredWrap) {
    featuredWrap.innerHTML = renderProductCards(featured);
  }

  const bestsellerWrap = document.getElementById('best-sellers');
  if (bestsellerWrap) {
    bestsellerWrap.innerHTML = renderProductCards(bestSellers);
  }

  const arrivalsWrap = document.getElementById('new-arrivals');
  if (arrivalsWrap) {
    arrivalsWrap.innerHTML = renderProductCards(newArrivals);
  }

  const reviewsWrap = document.getElementById('customer-reviews');
  if (reviewsWrap) {
    const reviews = ResinArt.getReviews();
    reviewsWrap.innerHTML = reviews.map(review => {
      const product = ResinArt.getProductById(review.productId);
      return `
        <article class="review-card">
          <div class="review-head">
            <img class="avatar" src="https://ui-avatars.com/api/?name=${encodeURIComponent(review.customer)}&background=efd5bc&color=4b3028" alt="${review.customer}" />
            <div class="review-name">
              <strong>${review.customer}</strong>
              <span class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
            </div>
          </div>
          <p>“${review.review}”</p>
          <small>Product: ${product ? product.name : 'Featured item'}</small>
        </article>
      `;
    }).join('');
  }

  attachProductHandlers();
}

function renderShopPage() {
  const products = ResinArt.getProducts();
  const params = new URLSearchParams(window.location.search);
  const searchQuery = (params.get('search') || '').trim().toLowerCase();
  const categoryFilter = (params.get('category') || '').trim();

  const categoryButtons = document.querySelectorAll('[data-category-filter]');
  const sortSelect = document.getElementById('sort-products');
  const status = document.getElementById('product-status');
  const maxPrice = document.getElementById('max-price');

  function applyFilters() {
    let filtered = [...products];

    const categoryValue = categoryFilter || document.getElementById('category-filter')?.value || 'all';
    const minRating = Number(document.getElementById('rating-filter')?.value || 0);
    const maxPriceValue = Number(maxPrice?.value || 99999);
    const statusValue = status?.value || 'all';

    if (categoryValue !== 'all') {
      filtered = filtered.filter(product => ResinArt.slugify(product.category) === categoryValue || product.category.toLowerCase() === categoryValue.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(product => [product.name, product.category, product.description, ...(product.tags || [])].join(' ').toLowerCase().includes(searchQuery));
    }

    if (statusValue === 'sale') filtered = filtered.filter(product => product.oldPrice && product.oldPrice > product.price);
    if (statusValue === 'bestseller') filtered = filtered.filter(product => product.bestseller);
    if (statusValue === 'featured') filtered = filtered.filter(product => product.featured);

    filtered = filtered.filter(product => product.rating >= minRating);
    filtered = filtered.filter(product => product.price <= maxPriceValue);

    const sortType = sortSelect?.value || 'newest';
    if (sortType === 'low-high') filtered.sort((a, b) => a.price - b.price);
    if (sortType === 'high-low') filtered.sort((a, b) => b.price - a.price);
    if (sortType === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    const productGrid = document.getElementById('shop-product-grid');
    if (!productGrid) return;

    if (!filtered.length) {
      productGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3>No products found</h3>
          <p>Try a different search or filter to discover more handcrafted resin pieces.</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = renderProductCards(filtered);
    attachProductHandlers();
  }

  const categoryFilterField = document.getElementById('category-filter');
  if (categoryFilterField) {
    categoryFilterField.value = categoryFilter || 'all';
    categoryFilterField.addEventListener('change', applyFilters);
  }

  if (maxPrice) {
    maxPrice.addEventListener('input', applyFilters);
  }

  if (sortSelect) sortSelect.addEventListener('change', applyFilters);
  if (status) status.addEventListener('change', applyFilters);
  document.getElementById('rating-filter')?.addEventListener('change', applyFilters);

  document.querySelectorAll('[data-category-filter]').forEach(button => {
    button.addEventListener('click', function () {
      const value = this.dataset.categoryFilter;
      const catSelect = document.getElementById('category-filter');
      if (catSelect) catSelect.value = value;
      if (maxPrice) maxPrice.value = 99999;
      applyFilters();
    });
  });

  productGrid = document.getElementById('shop-product-grid');
  if (productGrid) {
    productGrid.innerHTML = renderProductCards(products);
    attachProductHandlers();
  }
}

function renderProductPage() {
  const productId = new URLSearchParams(window.location.search).get('id');
  const product = ResinArt.getProductById(productId);

  if (!product) {
    document.body.innerHTML = '<div class="container section"><div class="empty-state"><h2>Product not found</h2><p>The item you requested is not available.</p><a href="shop.html" class="btn btn-primary">Back to shop</a></div></div>';
    return;
  }

  const detailTarget = document.getElementById('product-detail-content');
  if (!detailTarget) return;

  detailTarget.innerHTML = `
    <div class="product-detail">
      <div>
        <div class="gallery-main">
          <img id="gallery-main-image" src="${product.images[0]}" alt="${product.name}" />
        </div>
        <div class="gallery-thumbs">
          ${product.images.map((image, index) => `
            <button type="button" data-gallery-image="${image}">
              <img src="${image}" alt="${product.name} ${index + 1}" />
            </button>
          `).join('')}
        </div>
      </div>
      <div class="detail-info">
        <div class="breadcrumbs"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <span>${product.name}</span></div>
        <div class="eyebrow">${product.category}</div>
        <h1>${product.name}</h1>
        <div class="price-row">
          <span class="price">${ResinArt.formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="price old">${ResinArt.formatPrice(product.oldPrice)}</span>` : ''}
          ${product.oldPrice ? `<span class="discount">-${product.discount}%</span>` : ''}
        </div>
        <div class="rating">★ ${product.rating} <span style="color: var(--muted);">(${product.reviews} reviews)</span></div>
        <p>${product.description}</p>
        <div class="detail-actions">
          <div class="qty-box">
            <button type="button" data-qty-change="decrease">-</button>
            <span id="detail-quantity">1</span>
            <button type="button" data-qty-change="increase">+</button>
          </div>
          <button class="btn btn-primary" data-add-to-cart="${product.id}">Add to Cart</button>
          <button class="btn btn-secondary" data-buy-now="${product.id}">Buy Now</button>
          <button class="btn btn-ghost" data-toggle-wishlist="${product.id}">${ResinArt.isWishlisted(product.id) ? 'Wishlisted' : 'Add to Wishlist'}</button>
        </div>
        <div class="option-row">
          <strong>Size</strong>
          <div class="options">
            ${(product.options?.sizes || ['Standard']).map(option => `<button type="button" class="option-chip is-selected">${option}</button>`).join('')}
          </div>
        </div>
        <div class="option-row">
          <strong>Color</strong>
          <div class="options">
            ${(product.options?.colors || ['Natural']).map(option => `<button type="button" class="option-chip">${option}</button>`).join('')}
          </div>
        </div>
        <div class="option-row">
          <strong>Design</strong>
          <div class="options">
            ${(product.options?.designs || ['Classic']).map(option => `<button type="button" class="option-chip">${option}</button>`).join('')}
          </div>
        </div>
        <div class="specs">
          <div class="spec-item"><strong>Material</strong><br>${product.material}</div>
          <div class="spec-item"><strong>Dimensions</strong><br>${product.dimensions}</div>
          <div class="spec-item"><strong>Weight</strong><br>${product.weight}</div>
          <div class="spec-item"><strong>Processing</strong><br>${product.processing}</div>
          <div class="spec-item"><strong>Delivery</strong><br>${product.delivery}</div>
          <div class="spec-item"><strong>Care</strong><br>${product.care}</div>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('[data-gallery-image]').forEach(button => {
    button.addEventListener('click', () => {
      const img = document.getElementById('gallery-main-image');
      if (img) img.src = button.dataset.galleryImage;
    });
  });

  document.querySelectorAll('[data-qty-change]').forEach(button => {
    button.addEventListener('click', function () {
      const qtyEl = document.getElementById('detail-quantity');
      let qty = Number(qtyEl.textContent || 1);
      qty += this.dataset.qtyChange === 'increase' ? 1 : -1;
      qty = Math.max(1, qty);
      qtyEl.textContent = qty;
    });
  });

  document.querySelectorAll('[data-add-to-cart]').forEach(button => {
    button.addEventListener('click', function () {
      const quantity = Number(document.getElementById('detail-quantity')?.textContent || 1);
      ResinArt.addToCart(product.id, { size: 'Standard', color: 'Natural', design: 'Classic' }, quantity);
    });
  });

  document.querySelectorAll('[data-buy-now]').forEach(button => {
    button.addEventListener('click', function () {
      const quantity = Number(document.getElementById('detail-quantity')?.textContent || 1);
      ResinArt.addToCart(product.id, { size: 'Standard', color: 'Natural', design: 'Classic' }, quantity);
      window.location.href = 'checkout.html';
    });
  });

  document.querySelectorAll('[data-toggle-wishlist]').forEach(button => {
    button.addEventListener('click', function () {
      if (ResinArt.isWishlisted(product.id)) {
        ResinArt.removeFromWishlist(product.id);
        button.textContent = 'Add to Wishlist';
      } else {
        ResinArt.addToWishlist(product.id);
        button.textContent = 'Wishlisted';
      }
    });
  });

  const relatedWrap = document.getElementById('related-products');
  if (relatedWrap) {
    const related = ResinArt.getProducts().filter(item => item.category === product.category && item.id !== product.id).slice(0, 4);
    relatedWrap.innerHTML = renderProductCards(related);
    attachProductHandlers();
  }
}

function renderProductCards(products) {
  return products.map(product => {
    const wishlisted = ResinArt.isWishlisted(product.id);
    const stockState = product.stock <= 5 ? 'low' : product.stock === 0 ? 'out' : 'in';
    const stockLabel = product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? 'Low stock' : 'In stock';
    return `
      <article class="product-card">
        <div class="product-media">
          <img src="${product.images[0]}" alt="${product.name}" />
          ${product.oldPrice ? `<span class="product-badge">-${product.discount}%</span>` : `<span class="product-badge">New</span>`}
          <div class="product-actions">
            <button type="button" class="icon-btn ${wishlisted ? 'is-active' : ''}" data-toggle-wishlist="${product.id}" aria-label="Add to wishlist">
              <i class="${wishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
            </button>
            <a href="product.html?id=${product.id}" class="icon-btn" aria-label="Quick view">
              <i class="fa-regular fa-eye"></i>
            </a>
          </div>
        </div>
        <div class="product-body">
          <div class="product-meta">
            <span>${product.category}</span>
            <span class="rating">★ ${product.rating}</span>
          </div>
          <h3>${product.name}</h3>
          <div class="price-row">
            <span class="price">${ResinArt.formatPrice(product.price)}</span>
            ${product.oldPrice ? `<span class="price old">${ResinArt.formatPrice(product.oldPrice)}</span>` : ''}
          </div>
          <div class="product-footer">
            <span class="stock ${stockState === 'low' ? 'low' : stockState === 'out' ? 'out' : ''}">${stockLabel}</span>
            <button class="btn btn-primary" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function attachProductHandlers() {
  document.querySelectorAll('[data-add-to-cart]').forEach(button => {
    button.addEventListener('click', function () {
      const id = this.dataset.addToCart;
      const product = ResinArt.getProductById(id);
      if (!product || product.stock <= 0) {
        ResinArt.showToast('This product is out of stock', 'error');
        return;
      }
      ResinArt.addToCart(id, { size: 'Standard', color: 'Natural', design: 'Classic' }, 1);
    });
  });

  document.querySelectorAll('[data-toggle-wishlist]').forEach(button => {
    button.addEventListener('click', function () {
      const id = this.dataset.toggleWishlist;
      if (ResinArt.isWishlisted(id)) {
        ResinArt.removeFromWishlist(id);
        this.classList.remove('is-active');
        this.innerHTML = '<i class="fa-regular fa-heart"></i>';
      } else {
        ResinArt.addToWishlist(id);
        this.classList.add('is-active');
        this.innerHTML = '<i class="fa-solid fa-heart"></i>';
      }
      if (window.location.pathname.endsWith('product.html')) {
        const btn = document.querySelector('[data-toggle-wishlist]');
        if (btn) btn.textContent = ResinArt.isWishlisted(id) ? 'Wishlisted' : 'Add to Wishlist';
      }
    });
  });
}
