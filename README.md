# The Resin Art Club

A premium handcrafted resin art storefront built with HTML, CSS, and vanilla JavaScript. The project uses localStorage as a front-end demo persistence layer and includes a functional admin dashboard for managing products, orders, customers, coupons, custom requests, and settings.

## Features
- Premium storefront with product catalog, cart, wishlist, checkout, and order tracking
- Demo customer auth and admin auth using localStorage (frontend/demo only, not production secure)
- 20+ realistic demo products with PKR pricing
- Shop filters, sorting, search, and product detail pages
- Checkout with a JazzCash demo payment interface
- Responsive design for desktop, tablet, and mobile
- Admin dashboard with dashboard cards and management modules

## Run locally
1. Open the project in a browser directly, or
2. Start a simple local server from the project root:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000

## Notes
- Authentication and payment verification are intentionally frontend-only demo flows.
- Real backend, authentication, and payment integration can be added later.
- Product and order data are stored in `localStorage` under project-specific keys.
