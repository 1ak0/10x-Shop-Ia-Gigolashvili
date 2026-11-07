# PLAN — 10X Shop (Perfume & Beauty)

## Goal and scope

An online store for perfume and cosmetics (DummyJSON categories `fragrances`, `beauty`, `skin-care`) with
**free delivery on orders over $100**. CORE first, then FULL.

| Module | CORE | FULL |
| --- | --- | --- |
| React | Components / props / children, useState / useEffect, Router, Context (Auth, Cart), controlled Login & Checkout | custom hooks, reducer, Formik + Yup login, Orders, Profile |
| TypeScript | strict, typed props / state / API, `typecheck` = 0 errors | generics, ApiClient / ApiError, OOP classes, type guards, unions |
| Tailwind CSS | v4 via `@tailwindcss/vite`, utilities, grid / flex, responsive, hover / focus / disabled | `@theme` tokens, dark mode, `@utility` |
| Optimisation | responsive, Error Boundary, DEBUG-LOG | lazy routes, lazy images, memo, Lighthouse |
| Process | PLAN, README, REPORT, Git history, deploy | progress notes, PRs |

## Work breakdown (epics → tasks)

| Epic | Tasks | Est. (h) | Week |
| --- | --- | --- | --- |
| Setup | Vite + React + TS strict, Tailwind v4, ESLint, scripts, folder structure | 3 | 1 |
| Types & API | domain types, ApiClient / ApiError, products API | 3 | 1 |
| Auth | AuthContext, Login form, ProtectedRoute | 3 | 1 |
| Catalog | ProductCard / Grid, loading / error / empty, search, filter, sort, pagination, URL state | 8 | 1 |
| Product | details page, gallery, stepper, stock rules, reviews, related | 6 | 2 |
| Cart | reducer, CartContext, Cart class, cart page, promo, free-delivery bar | 6 | 2 |
| Checkout | controlled form, validation, order creation, confirmation | 4 | 2 |
| Orders / Profile | orders list, details, status timeline, reorder, profile form, theme | 5 | 2–3 |
| Quality | responsive pass (375 px), a11y labels, Error Boundary, lazy routes | 4 | 3 |
| Docs & deploy | README, REPORT, DEBUG-LOG, COMPATIBILITY, Vercel deploy | 4 | 3 |

## Risks

1. **DummyJSON is unavailable or slow** → clear error state with Retry; requests can be cancelled; the cart works offline from `localStorage`.
2. **The API cannot filter several categories at once** → load the three shop categories in parallel and sort / paginate on the client (small data set).
3. **`localStorage` data is corrupted or from an older version** → every read goes through `StorageService<T>` with a type guard; invalid data is ignored.
4. **Mobile layout breaks (horizontal scroll)** → test every page at 375 px; use `min-w-0` on grid / flex children.

## Definition of Done (per task)

- Works in the browser with no console errors
- `npm run typecheck` and `npm run lint` pass
- Looks correct at 375 px and on desktop, in both themes
- Committed with a meaningful message
