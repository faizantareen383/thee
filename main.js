(function () {
  const STORAGE_KEYS = {
    products: 'trac_products',
    categories: 'trac_categories',
    cart: 'trac_cart',
    wishlist: 'trac_wishlist',
    customers: 'trac_customers',
    currentCustomer: 'trac_current_customer',
    orders: 'trac_orders',
    customOrders: 'trac_custom_orders',
    reviews: 'trac_reviews',
    coupons: 'trac_coupons',
    contactMessages: 'trac_contact_messages',
    newsletter: 'trac_newsletter',
    settings: 'trac_settings',
    adminSession: 'trac_admin_session'
  };

  const DEMO_PRODUCTS = [
    { id: 'ocean-blue-tray', name: 'Ocean Blue Resin Tray', category: 'Resin Trays', price: 2500, oldPrice: 3200, discount: 22, rating: 4.9, reviews: 128, stock: 14, featured: true, bestseller: true, newArrival: true, sku: 'RT-001', description: 'A luminous ocean-inspired tray crafted with layered resin and gold detailing for elevated hosting moments.', tags: ['ocean', 'tray', 'resin', 'home'], images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], material: 'Epoxy resin', dimensions: '34 x 24 cm', weight: '1.2 kg', care: 'Wipe with a soft cloth. Avoid harsh cleaners.', processing: '5-7 business days', delivery: 'Nationwide delivery in 2-5 days', options: { sizes: ['Standard','Large'], colors: ['Ocean Blue','Ivory'], designs: ['Wave Pattern','Glass Burst'] } },
    { id: 'marble-coaster-set', name: 'Marble Resin Coaster Set', category: 'Resin Coasters', price: 1850, oldPrice: 2400, discount: 23, rating: 4.8, reviews: 96, stock: 18, featured: true, bestseller: false, newArrival: true, sku: 'RC-002', description: 'Modern marble-inspired coaster set offering a smooth luxury finish for any coffee table or dining setting.', tags: ['coaster', 'marble', 'home'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'], material: 'Resin + stone mix', dimensions: '10 x 10 cm each', weight: '0.6 kg', care: 'Use coaster stand and avoid heat exposure.', processing: '3-5 business days', delivery: '2-4 days delivery', options: { sizes: ['4 Pack','6 Pack'], colors: ['Ivory','Moss','Charcoal'], designs: ['Marble','Floral'] } },
    { id: 'golden-epoxy-tray', name: 'Golden Epoxy Tray', category: 'Resin Trays', price: 2900, oldPrice: 3500, discount: 17, rating: 5, reviews: 84, stock: 9, featured: false, bestseller: true, newArrival: true, sku: 'RT-003', description: 'Golden resin artistry with a subtle mirrored effect that adds sophistication to your coffee table or vanity.', tags: ['gold', 'tray', 'luxury'], images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'], material: 'Crystal epoxy', dimensions: '28 x 18 cm', weight: '0.9 kg', care: 'Keep away from direct sunlight.', processing: '5 days', delivery: 'Nationwide', options: { sizes: ['Medium','Large'], colors: ['Champagne','Rose Gold'], designs: ['Mirror Dust','Soft Vein'] } },
    { id: 'floral-keychain', name: 'Floral Resin Keychain', category: 'Keychains', price: 950, oldPrice: 1200, discount: 21, rating: 4.7, reviews: 210, stock: 36, featured: true, bestseller: false, newArrival: true, sku: 'KC-004', description: 'A tiny floral keepsake that captures pressed petals and vibrant color in a durable resin finish.', tags: ['keychain','floral','gift'], images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], material: 'Resin + metal clasp', dimensions: '8 x 6 cm', weight: '0.1 kg', care: 'Keep dry and use gently.', processing: '2-3 days', delivery: 'In-city delivery', options: { sizes: ['Mini','Classic'], colors: ['Pink','Sunset','Vintage'], designs: ['Floral','Monogram'] } },
    { id: 'name-plate', name: 'Personalized Resin Name Plate', category: 'Customized Gifts', price: 3200, oldPrice: 4100, discount: 22, rating: 4.9, reviews: 71, stock: 12, featured: true, bestseller: true, newArrival: false, sku: 'CG-005', description: 'A personalized name plate with resin glaze, ideal for homes, desks, gifting, or boutique branding.', tags: ['name plate','personalized','home'], images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80'], material: 'Resin + acrylic backing', dimensions: '25 x 10 cm', weight: '0.7 kg', care: 'Dust gently with dry cloth.', processing: '7-10 days', delivery: 'Nationwide', options: { sizes: ['Small','Medium','Large'], colors: ['Soft White','Breeze Blue','Rose Gold'], designs: ['Script Name','Minimal Block'] } },
    { id: 'resin-clock', name: 'Resin Clock', category: 'Resin Clocks', price: 2800, oldPrice: 3400, discount: 18, rating: 4.6, reviews: 67, stock: 10, featured: false, bestseller: true, newArrival: true, sku: 'RC-006', description: 'A statement wall clock with resin textures, perfect for elegant interiors and workspaces.', tags: ['clock','wall art','decor'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'], material: 'Resin + metal casing', dimensions: '30 cm diameter', weight: '1.1 kg', care: 'Avoid moisture and direct sun.', processing: '4-6 days', delivery: '3-5 days', options: { sizes: ['Small','Medium','Large'], colors: ['Warm Beige','Slate','Blush'], designs: ['Abstract','Floral'] } },
    { id: 'ocean-wall-art', name: 'Ocean Wave Wall Art', category: 'Wall Art', price: 4300, oldPrice: 5400, discount: 20, rating: 4.9, reviews: 62, stock: 8, featured: true, bestseller: true, newArrival: false, sku: 'WA-007', description: 'Layered ocean-inspired wall piece that turns any blank wall into an art feature.', tags: ['wall art','ocean','gallery'], images: ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'], material: 'Premium resin and wood frame', dimensions: '50 x 35 cm', weight: '2.1 kg', care: 'Use soft cloth to dust.', processing: '6-8 days', delivery: 'Nationwide', options: { sizes: ['Medium','Large'], colors: ['Seafoam','Coral','Ivory'], designs: ['Wave','Minimal'] } },
    { id: 'jewelry-box', name: 'Resin Jewelry Box', category: 'Jewelry', price: 3600, oldPrice: 4500, discount: 20, rating: 4.8, reviews: 49, stock: 5, featured: false, bestseller: true, newArrival: false, sku: 'JB-008', description: 'A delicate jewelry organizer perfect for gifting, personal use, and special keepsakes.', tags: ['jewelry','box','gift'], images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], material: 'Resin + velvet lining', dimensions: '20 x 15 cm', weight: '0.8 kg', care: 'Avoid water and direct heat.', processing: '5-7 days', delivery: '2-6 days', options: { sizes: ['Classic','Large'], colors: ['Rose','Cream','Smoky'], designs: ['Floral','Bespoke'] } },
    { id: 'custom-letter-keychain', name: 'Custom Letter Keychain', category: 'Keychains', price: 1100, oldPrice: 1500, discount: 27, rating: 4.7, reviews: 184, stock: 20, featured: true, bestseller: false, newArrival: true, sku: 'KC-009', description: 'A personalized letter charm finished in crystal clear resin, ideal for names, initials, and meaningful gifts.', tags: ['custom','initial','gift'], images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], material: 'Clear resin + metal ring', dimensions: '9 x 5 cm', weight: '0.1 kg', care: 'Do not pull on ring.', processing: '2 days', delivery: 'In-city and metros', options: { sizes: ['Initial','Name'], colors: ['Clear','Rose','Mint'], designs: ['Letter','Monogram'] } },
    { id: 'serving-tray', name: 'Resin Serving Tray', category: 'Home Decor', price: 3300, oldPrice: 4100, discount: 20, rating: 4.8, reviews: 111, stock: 7, featured: false, bestseller: true, newArrival: false, sku: 'HD-010', description: 'An elegant serving tray with soft color flow and handcrafted texture that fits every modern home.', tags: ['serving','tray','home'], images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'], material: 'Resin + wooden base', dimensions: '40 x 26 cm', weight: '1.5 kg', care: 'Keep away from sharp objects.', processing: '5-7 days', delivery: 'Nationwide', options: { sizes: ['Medium','Large'], colors: ['Natural','Blush','Teal'], designs: ['Organic','Modern'] } },
    { id: 'mini-abstract-painting', name: 'Mini Abstract Resin Painting', category: 'Wall Art', price: 2200, oldPrice: 2800, discount: 21, rating: 4.6, reviews: 78, stock: 11, featured: false, bestseller: false, newArrival: true, sku: 'WA-011', description: 'A gallery-inspired mini abstract piece in translucent resin layers for quirky, creative spaces.', tags: ['art','abstract','minimal'], images: ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'], material: 'Resin on wood panel', dimensions: '24 x 18 cm', weight: '0.9 kg', care: 'Dust with soft cloth.', processing: '4-5 days', delivery: 'Metro cities', options: { sizes: ['Mini','Standard'], colors: ['Rose','Lavender','Sand'], designs: ['Abstract','Flow'] } },
    { id: 'pearl-jewelry-tray', name: 'Pearl Jewelry Tray', category: 'Jewelry', price: 2100, oldPrice: 2650, discount: 21, rating: 4.9, reviews: 59, stock: 13, featured: false, bestseller: false, newArrival: true, sku: 'JB-012', description: 'Soft pearl tones and glossy resin finish designed for storing rings, chains, and precious pieces.', tags: ['jewelry','tray','pearl'], images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], material: 'Clear resin + pearl accent', dimensions: '18 x 12 cm', weight: '0.5 kg', care: 'Keep out of direct sunlight.', processing: '3-4 days', delivery: 'Nationwide', options: { sizes: ['Small','Medium'], colors: ['Pearl','Blush','Cream'], designs: ['Pearl','Gloss'] } },
    { id: 'corporate-engraved-tray', name: 'Corporate Gift Resin Tray', category: 'Corporate Gifts', price: 4800, oldPrice: 6200, discount: 23, rating: 4.7, reviews: 39, stock: 6, featured: true, bestseller: true, newArrival: false, sku: 'CG-013', description: 'An elegant corporate gifting tray for branded items, premium events, and institutional gifting.', tags: ['corporate','gift','tray'], images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'], material: 'Resin + brass detail', dimensions: '42 x 28 cm', weight: '1.8 kg', care: 'Store flat and avoid impact.', processing: '10-12 days', delivery: 'Nationwide corporate delivery', options: { sizes: ['Business','Executive'], colors: ['Slate','Champagne','Black'], designs: ['Minimal','Branded'] } },
    { id: 'sunset-bowl', name: 'Sunset Resin Bowl', category: 'Home Decor', price: 2400, oldPrice: 3000, discount: 20, rating: 4.8, reviews: 88, stock: 15, featured: true, bestseller: false, newArrival: true, sku: 'HD-014', description: 'An artistic bowl with layered sunset tones and glossy detail for a decor-forward lifestyle.', tags: ['bowl','sunset','home'], images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'], material: 'Crystal resin', dimensions: '18 cm diameter', weight: '0.7 kg', care: 'Avoid abrasives and heat.', processing: '4 days', delivery: '2-5 days', options: { sizes: ['Small','Medium'], colors: ['Sunset','Blush','Teal'], designs: ['Gradient','Swirl'] } },
    { id: 'minimal-letter-plate', name: 'Minimal Letter Plate', category: 'Customized Gifts', price: 2650, oldPrice: 3300, discount: 20, rating: 4.9, reviews: 73, stock: 9, featured: false, bestseller: false, newArrival: true, sku: 'CG-015', description: 'A sleek initial plate preserving a minimalist modern style for gifting or home styling.', tags: ['plate','letter','gift'], images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80'], material: 'Resin + brushed metal', dimensions: '26 x 14 cm', weight: '0.8 kg', care: 'Use gentle cleaning methods.', processing: '6 days', delivery: 'Nationwide', options: { sizes: ['Initial','Name'], colors: ['Stone','Cream','Terracotta'], designs: ['Minimal','Script'] } },
    { id: 'teal-coaster-set', name: 'Teal Accent Coaster Set', category: 'Resin Coasters', price: 1700, oldPrice: 2100, discount: 19, rating: 4.5, reviews: 71, stock: 25, featured: false, bestseller: false, newArrival: true, sku: 'RC-016', description: 'A cheerful set featuring teal hues and organic patterns for everyday modern living.', tags: ['coaster','teal','home'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], material: 'Resin composite', dimensions: '12 x 12 cm each', weight: '0.4 kg', care: 'Avoid hot surfaces.', processing: '3 days', delivery: '2-4 days', options: { sizes: ['4 Pack','6 Pack'], colors: ['Teal','Cobalt','Ivory'], designs: ['Organic','Wave'] } },
    { id: 'rose-stand', name: 'Rose Resin Stand', category: 'Home Decor', price: 2000, oldPrice: 2500, discount: 20, rating: 4.7, reviews: 65, stock: 16, featured: false, bestseller: false, newArrival: true, sku: 'HD-017', description: 'A small statement stand with rose-toned layers and an elegant modern silhouette.', tags: ['stand','decor','rose'], images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], material: 'Resin and metal base', dimensions: '14 x 18 cm', weight: '0.6 kg', care: 'Do not place in direct sunlight.', processing: '4 days', delivery: 'In-city', options: { sizes: ['Small','Large'], colors: ['Rose','Sand','Blush'], designs: ['Wave','Flow'] } },
    { id: 'floating-wave-pendant', name: 'Floating Wave Pendant', category: 'Jewelry', price: 2600, oldPrice: 3200, discount: 19, rating: 4.8, reviews: 103, stock: 14, featured: true, bestseller: true, newArrival: false, sku: 'JB-018', description: 'A wearable resin pendant with layered wave textures and a refined handcrafted feel.', tags: ['pendant','jewelry','gift'], images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80'], material: 'Resin + silver bail', dimensions: '12 x 8 cm', weight: '0.2 kg', care: 'Store in soft pouch.', processing: '4-5 days', delivery: 'Nationwide', options: { sizes: ['Standard','Long Chain'], colors: ['Ocean','Rose','Pearl'], designs: ['Wave','Bloom'] } },
    { id: 'signature-name-keyring', name: 'Signature Name Keyring', category: 'Keychains', price: 1200, oldPrice: 1600, discount: 25, rating: 4.7, reviews: 61, stock: 19, featured: false, bestseller: false, newArrival: true, sku: 'KC-019', description: 'A signature resin keyring made for gifting and daily use with personalized name accents.', tags: ['keyring','name','gift'], images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], material: 'Resin + keyring metal', dimensions: '7 x 6 cm', weight: '0.1 kg', care: 'Avoid bending ring.', processing: '2-3 days', delivery: 'Metro cities', options: { sizes: ['Single','Set of 2'], colors: ['Clear','Blush','Oak'], designs: ['Name','Initial'] } },
    { id: 'personality-clock', name: 'Personality Resin Clock', category: 'Resin Clocks', price: 3100, oldPrice: 3900, discount: 21, rating: 4.9, reviews: 44, stock: 6, featured: true, bestseller: true, newArrival: false, sku: 'RC-020', description: 'A luxe resin clock with textured storytelling layers that adds character to every room.', tags: ['clock','decor','statement'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'], material: 'Resin + brass finish', dimensions: '32 cm diameter', weight: '1.3 kg', care: 'Keep away from moisture.', processing: '5-6 days', delivery: '2-5 days', options: { sizes: ['Medium','Large'], colors: ['Coffee','Sand','Silver'], designs: ['Dusting','Organic'] } }
  ];

  const DEMO_REVIEWS = [
    { id: 'rev-1', customer: 'Ayesha K.', productId: 'ocean-blue-tray', rating: 5, review: 'Beautiful finish and premium packaging. My guests noticed it instantly.', verified: true },
    { id: 'rev-2', customer: 'M. Hamza', productId: 'floral-keychain', rating: 5, review: 'Perfect gift for my sister. Great quality and bright colors.', verified: true },
    { id: 'rev-3', customer: 'Nadia', productId: 'ocean-wall-art', rating: 4, review: 'Looks exactly like the photos and arrived safely packed.', verified: true },
    { id: 'rev-4', customer: 'Usman A.', productId: 'jewelry-box', rating: 5, review: 'The craftsmanship is excellent and it feels like luxury.', verified: true }
  ];

  const DEMO_CUSTOMERS = [
    { id: 'cust-1', fullName: 'Ayesha Karim', email: 'ayesha@example.com', phone: '+92 300 0000000', password: '123456', createdAt: new Date().toISOString(), orders: 2, totalSpent: 5900 },
    { id: 'cust-2', fullName: 'Hamza Ali', email: 'hamza@example.com', phone: '+92 321 1111111', password: '123456', createdAt: new Date().toISOString(), orders: 1, totalSpent: 1800 }
  ];

  const DEMO_ORDERS = [
    { id: 'TRC-1001', customer: 'Ayesha Karim', email: 'ayesha@example.com', products: [{ productId: 'ocean-blue-tray', quantity: 1, price: 2500 }], address: 'Lahore, Pakistan', total: 2700, paymentMethod: 'JazzCash', transactionId: 'JCX-1001', paymentStatus: 'Paid', orderStatus: 'Confirmed', date: '2025-09-02' },
    { id: 'TRC-1002', customer: 'Hamza Ali', email: 'hamza@example.com', products: [{ productId: 'floral-keychain', quantity: 2, price: 950 }], address: 'Karachi, Pakistan', total: 2140, paymentMethod: 'JazzCash', transactionId: 'JCX-1002', paymentStatus: 'Paid', orderStatus: 'Processing', date: '2025-09-05' }
  ];

  const DEMO_COUPONS = [
    { id: 'WELCOME10', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 1500, expiry: '2026-12-31', usageLimit: 20, active: true },
    { id: 'FREESHIP', code: 'FREESHIP', type: 'fixed', value: 250, minOrder: 3000, expiry: '2026-12-31', usageLimit: 10, active: true }
  ];

  const DEFAULT_SETTINGS = {
    storeName: 'The Resin Art Club',
    logoText: 'The Resin Art Club',
    phone: '+92 300 1234567',
    email: 'hello@theresinartclub.com',
    address: 'Lahore, Pakistan',
    deliveryFee: 250,
    freeDeliveryThreshold: 5000,
    currency: 'PKR',
    whatsapp: '+92 300 1234567',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: 'https://tiktok.com',
    storeStatus: 'Open'
  };

  function storageGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      console.error('Storage read failed:', error);
      return fallback;
    }
  }

  function storageSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function slugify(value) {
    return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function formatPrice(value) {
    const num = Number(value || 0);
    return 'PKR ' + num.toLocaleString('en-PK');
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2600);
  }

  function getProducts() {
    return storageGet(STORAGE_KEYS.products, DEMO_PRODUCTS);
  }

  function getCategories() {
    return storageGet(STORAGE_KEYS.categories, [
      { id: 'resin-trays', name: 'Resin Trays', active: true },
      { id: 'resin-coasters', name: 'Resin Coasters', active: true },
      { id: 'keychains', name: 'Keychains', active: true },
      { id: 'jewelry', name: 'Jewelry', active: true },
      { id: 'home-decor', name: 'Home Decor', active: true },
      { id: 'customized-gifts', name: 'Customized Gifts', active: true },
      { id: 'wall-art', name: 'Wall Art', active: true },
      { id: 'resin-clocks', name: 'Resin Clocks', active: true },
      { id: 'corporate-gifts', name: 'Corporate Gifts', active: true }
    ]);
  }

  function getCart() {
    return storageGet(STORAGE_KEYS.cart, []);
  }

  function saveCart(cart) {
    storageSet(STORAGE_KEYS.cart, cart);
  }

  function getWishlist() {
    return storageGet(STORAGE_KEYS.wishlist, []);
  }

  function saveWishlist(list) {
    storageSet(STORAGE_KEYS.wishlist, list);
  }

  function getCurrentCustomer() {
    return storageGet(STORAGE_KEYS.currentCustomer, null);
  }

  function saveCurrentCustomer(customer) {
    storageSet(STORAGE_KEYS.currentCustomer, customer);
  }

  function getCustomers() {
    return storageGet(STORAGE_KEYS.customers, DEMO_CUSTOMERS);
  }

  function getSettings() {
    return { ...DEFAULT_SETTINGS, ...(storageGet(STORAGE_KEYS.settings, {})) };
  }

  function saveSettings(settings) {
    storageSet(STORAGE_KEYS.settings, settings);
  }

  function getAdminSession() {
    return storageGet(STORAGE_KEYS.adminSession, null);
  }

  function setAdminSession(value) {
    storageSet(STORAGE_KEYS.adminSession, value);
  }

  function ensureDemoData() {
    if (!localStorage.getItem(STORAGE_KEYS.products)) {
      storageSet(STORAGE_KEYS.products, DEMO_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.categories)) {
      storageSet(STORAGE_KEYS.categories, [
        { id: 'resin-trays', name: 'Resin Trays', active: true },
        { id: 'resin-coasters', name: 'Resin Coasters', active: true },
        { id: 'keychains', name: 'Keychains', active: true },
        { id: 'jewelry', name: 'Jewelry', active: true },
        { id: 'home-decor', name: 'Home Decor', active: true },
        { id: 'customized-gifts', name: 'Customized Gifts', active: true },
        { id: 'wall-art', name: 'Wall Art', active: true },
        { id: 'resin-clocks', name: 'Resin Clocks', active: true },
        { id: 'corporate-gifts', name: 'Corporate Gifts', active: true }
      ]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.customers)) {
      storageSet(STORAGE_KEYS.customers, DEMO_CUSTOMERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.orders)) {
      storageSet(STORAGE_KEYS.orders, DEMO_ORDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.reviews)) {
      storageSet(STORAGE_KEYS.reviews, DEMO_REVIEWS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.coupons)) {
      storageSet(STORAGE_KEYS.coupons, DEMO_COUPONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.settings)) {
      storageSet(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.currentCustomer)) {
      storageSet(STORAGE_KEYS.currentCustomer, null);
    }
    if (!localStorage.getItem(STORAGE_KEYS.adminSession)) {
      storageSet(STORAGE_KEYS.adminSession, null);
    }
    if (!localStorage.getItem(STORAGE_KEYS.cart)) {
      storageSet(STORAGE_KEYS.cart, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.wishlist)) {
      storageSet(STORAGE_KEYS.wishlist, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.contactMessages)) {
      storageSet(STORAGE_KEYS.contactMessages, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.customOrders)) {
      storageSet(STORAGE_KEYS.customOrders, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.newsletter)) {
      storageSet(STORAGE_KEYS.newsletter, []);
    }
  }

  function renderHeader() {
    const headerTarget = document.getElementById('header');
    if (!headerTarget) return;

    const settings = getSettings();
    const currentCustomer = getCurrentCustomer();
    const cartCount = getCart().reduce((total, item) => total + item.quantity, 0);
    const wishlistCount = getWishlist().length;
    const page = document.body.dataset.page || 'home';

    headerTarget.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a href="index.html" class="logo" aria-label="The Resin Art Club home">
            <span class="logo-mark"><i class="fa-solid fa-gem"></i></span>
            <span class="logo-text">${settings.storeName}<span>Handcrafted Art</span></span>
          </a>
          <nav class="main-nav" aria-label="Main navigation">
            <a href="index.html" class="${page === 'home' ? 'active' : ''}">Home</a>
            <a href="shop.html" class="${page === 'shop' ? 'active' : ''}">Shop</a>
            <a href="shop.html?category=resin-trays" class="${page === 'category' ? 'active' : ''}">Categories</a>
            <a href="custom-order.html" class="${page === 'custom-order' ? 'active' : ''}">Custom Orders</a>
            <a href="about.html" class="${page === 'about' ? 'active' : ''}">About</a>
            <a href="contact.html" class="${page === 'contact' ? 'active' : ''}">Contact</a>
          </nav>
          <div class="header-actions">
            <label class="search-bar" aria-label="Search products">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input id="header-search" type="search" placeholder="Search products" />
            </label>
            <a href="wishlist.html" class="icon-pill" aria-label="Wishlist">
              <i class="fa-regular fa-heart"></i>
              <span class="count-badge">${wishlistCount}</span>
            </a>
            <a href="cart.html" class="icon-pill" aria-label="Cart">
              <i class="fa-solid fa-bag-shopping"></i>
              <span class="count-badge">${cartCount}</span>
            </a>
            ${currentCustomer ? `<a href="account.html" class="account-chip"><i class="fa-regular fa-user"></i> ${currentCustomer.fullName.split(' ')[0]}</a>` : `<a href="login.html" class="account-chip"><i class="fa-regular fa-user"></i> Account</a>`}
          </div>
        </div>
      </header>
    `;

    const searchInput = document.getElementById('header-search');
    if (searchInput) {
      searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          const value = this.value.trim();
          if (value) {
            window.location.href = `shop.html?search=${encodeURIComponent(value)}`;
          }
        }
      });
    }
  }

  function renderFooter() {
    const footerTarget = document.getElementById('footer');
    if (!footerTarget) return;

    const settings = getSettings();
    footerTarget.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="logo" style="color: #fff; margin-bottom: 18px;">
                <span class="logo-mark"><i class="fa-solid fa-gem"></i></span>
                <span class="logo-text">${settings.storeName}<span>Handcrafted Art</span></span>
              </div>
              <p>Handcrafted resin art made with creativity and care.</p>
              <div class="header-actions" style="justify-content:flex-start; margin-top: 18px;">
                <a href="${settings.instagram}" class="icon-pill" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="${settings.facebook}" class="icon-pill" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="${settings.tiktok}" class="icon-pill" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
                <a href="https://wa.me/${settings.whatsapp.replace(/\D/g, '')}" class="icon-pill" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
              </div>
            </div>
            <div>
              <h3>Quick Links</h3>
              <ul class="footer-list">
                <li><a href="shop.html">Shop</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="faq.html">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3>Support</h3>
              <ul class="footer-list">
                <li><a href="shop.html">Shipping</a></li>
                <li><a href="shop.html">Returns</a></li>
                <li><a href="login.html">Privacy</a></li>
                <li><a href="faq.html">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3>Newsletter</h3>
              <p>Receive updates on new drops and custom designs.</p>
              <form id="newsletter-form" class="newsletter-form" style="display:grid; gap: 12px; margin-top: 14px;">
                <input class="form-field" type="email" id="newsletter-email" placeholder="Your email address" required />
                <button class="btn btn-primary" type="submit">Join</button>
              </form>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© 2025 ${settings.storeName}. All rights reserved.</span>
            <span>PKR • Nationwide delivery</span>
          </div>
        </div>
      </footer>
    `;

    document.getElementById('newsletter-form')?.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = document.getElementById('newsletter-email')?.value.trim();
      if (!email) return;
      const subscribers = storageGet(STORAGE_KEYS.newsletter, []);
      if (!subscribers.some(item => item.email === email)) {
        subscribers.push({ email, date: new Date().toISOString() });
        storageSet(STORAGE_KEYS.newsletter, subscribers);
      }
      showToast('Subscribed to newsletter', 'success');
      event.target.reset();
    });
  }

  function getProductById(id) {
    return getProducts().find(product => product.id === id);
  }

  function addToCart(productId, options = {}, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.productId === productId && JSON.stringify(item.options || {}) === JSON.stringify(options || {}));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity, options, addedAt: new Date().toISOString() });
    }
    saveCart(cart);
    showToast('Product added to cart', 'success');
    renderHeader();
    return cart;
  }

  function removeFromCart(productId) {
    const cart = getCart().filter(item => item.productId !== productId);
    saveCart(cart);
    renderHeader();
    showToast('Removed from cart', 'info');
    return cart;
  }

  function addToWishlist(productId) {
    const wishlist = getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      saveWishlist(wishlist);
      renderHeader();
      showToast('Added to wishlist', 'success');
    }
  }

  function removeFromWishlist(productId) {
    const wishlist = getWishlist().filter(item => item !== productId);
    saveWishlist(wishlist);
    renderHeader();
    showToast('Removed from wishlist', 'info');
    return wishlist;
  }

  function isWishlisted(productId) {
    return getWishlist().includes(productId);
  }

  function hasCustomerSession() {
    return !!getCurrentCustomer();
  }

  window.ResinArt = {
    STORAGE_KEYS,
    ensureDemoData,
    getProducts,
    getCategories,
    getCart,
    saveCart,
    getWishlist,
    saveWishlist,
    getCustomers,
    getCurrentCustomer,
    saveCurrentCustomer,
    getSettings,
    saveSettings,
    getAdminSession,
    setAdminSession,
    showToast,
    formatPrice,
    slugify,
    getProductById,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    renderHeader,
    renderFooter,
    getOrders: () => storageGet(STORAGE_KEYS.orders, []),
    saveOrders: (orders) => storageSet(STORAGE_KEYS.orders, orders),
    getReviews: () => storageGet(STORAGE_KEYS.reviews, [])
  };

  document.addEventListener('DOMContentLoaded', function () {
    ensureDemoData();
    renderHeader();
    renderFooter();
  });
})();
