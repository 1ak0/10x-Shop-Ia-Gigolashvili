# 10X Shop — Perfume & Beauty

**Live demo:** https://10x-shop-ia-gigolashvili.vercel.app/

## About

10X Shop is a single-page online store for perfume, make-up and skin care, built as the 10X Front-end graduation project.
Customers can browse a curated catalog, read and write reviews, collect products in a cart (with a promo code and
**free delivery on orders over $100**), check out, and follow their orders. Product data comes from the public
[DummyJSON](https://dummyjson.com) API; login and checkout are local simulations — no real accounts or payments.

## Features

### CORE
- Catalog loaded from `GET /products/category/{slug}` with loading, error and empty states
- Product details (`/products/:id`) — gallery, discounted price, stock status, quantity stepper, Add to cart
- Cart — change quantity, remove, clear, subtotal / delivery / total (persisted in `localStorage`)
- Free delivery from **$100** with a progress bar; otherwise $9.99 delivery
- Login — controlled form with validation, kept in `AuthContext`
- Checkout guard — guests go to `/login` and come back to `/checkout` afterwards
- Checkout — controlled form (full name, email, address, city), validation, "Thank you!" confirmation, cart cleared
- Shared Layout (Header + Footer), active `NavLink`, cart badge, 404 page, scroll-to-top
- Responsive from 375 px to desktop, no horizontal scroll; Error Boundary

### FULL
- Search (400 ms debounce), category filter, 5 sort options, pagination — all stored in the URL
- `AbortController` cancels outdated requests; Retry on errors; skeleton cards
- Reviews (validated form, saved per product) and related products (same `ProductCard`)
- Promo code **10X10** (−10%), saved with the cart
- Orders list + order details with a status timeline (Processing → Shipped → Delivered, updates every 30 s) and Reorder
- Profile — edit name / email / phone, theme switch, clear local data, log out
- Login with **Formik + Yup**
- Dark / light theme (Tailwind `@custom-variant dark`, saved in `localStorage`)
- Toast notifications, lazy-loaded routes (`React.lazy` + `Suspense`)
- TypeScript: generics (`ApiClient.get<T>`, `useFetch<T>`, `StorageService<T>`, `paginate<T>`), discriminated unions
  (`AsyncState<T>`, `CartAction` with an exhaustive `never` check), type guards, utility types (`Pick`, `Omit`, `Partial`)
- OOP: `ApiClient`, `ApiError extends Error`, `Cart implements ICart`, `OrderModel` (static factory), `StorageService<T>`

## Tech Stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · React Router · Formik + Yup · ESLint · DummyJSON API · Vercel / Netlify

## Architecture

```
src/
├── api/          ApiClient (typed fetch), ApiError, products.api.ts
├── types/        product, cart, user, order, api (AsyncState), catalog
├── models/       Cart, OrderModel, StorageService<T>, storage instances
├── context/      AuthContext, CartContext + cart.reducer, ThemeContext, ToastContext
├── hooks/        useFetch, useDebounce, useNow
├── components/   ui/ (Button, TextField, Price, …), layout/, product/, cart/, catalog/,
│                 ErrorBoundary, NotFound, OrderStatusBadge
├── pages/        Catalog, Product, Cart, Login, Checkout, Orders, OrderDetails, Profile, NotFound
├── routes/       AppRoutes (lazy routes), ProtectedRoute
└── utils/        format, catalog (sort / paginate / URL params), validation, guards, stock, storageKeys
```

**Data flow.** A user action calls an event handler → the handler calls a Context function or `setState` → the
reducer / setter returns a **new immutable** state → React re-renders. Requests run in `useFetch` (inside `useEffect`)
and are cancelled with `AbortController` when their inputs change. The catalog's filters live in the URL
(`useSearchParams`), so refresh, Back/Forward and shared links keep them. The cart is persisted to `shop_cart`
by an effect in `CartProvider`; the reducer itself stays pure.

**Why the catalog loads three categories.** DummyJSON cannot filter by several categories at once, and the store sells only
`fragrances`, `beauty` and `skin-care` (13 products). These are loaded in parallel and then sorted and paginated
on the client (8 per page). Search uses `/products/search` and keeps only these categories.

## How to Run

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | ESLint (no `any`, React hooks rules) |

## Deploy

- **Vercel:** import the repo; framework preset *Vite*. `vercel.json` rewrites every path to `index.html`, so `/products/5` survives a refresh.
- **Netlify:** build command `npm run build`, publish directory `dist`. `public/_redirects` does the same SPA rewrite.

## Test Account

Login is simulated: any username plus a password of 6+ characters works, e.g. **emilys / emilyspass**.
Promo code: **10X10**. In dev mode, `/debug/crash` throws an error to show the Error Boundary.

## Credits

- Product data: [DummyJSON](https://dummyjson.com)
- Fonts: Cormorant Garamond & Inter (Google Fonts)
- AI assistance (Claude) was used for scaffolding, code review and documentation drafts — see REPORT.md.
