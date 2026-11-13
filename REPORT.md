# REPORT — 10X Shop

## Planned vs delivered

| Module | CORE | FULL |
| --- | --- | --- |
| React | ✅ all CORE items | ✅ reducer, custom hooks (`useFetch`, `useDebounce`, `useNow`), Formik + Yup, Orders, Profile, reviews, related, promo |
| TypeScript | ✅ strict, typed props / state / API | ✅ generics, ApiClient / ApiError, Cart / OrderModel / StorageService, type guards, discriminated unions, `Pick` / `Omit` / `Partial` |
| Tailwind CSS | ✅ v4, utilities, grid / flex, responsive, hover / focus / disabled | ✅ `@theme` + `@theme inline` tokens, `@custom-variant dark`, `@utility` (container-page, eyebrow, focus-ring) |
| Optimisation | ✅ responsive, Error Boundary, DEBUG-LOG | ✅ lazy routes, `loading="lazy"` + width/height on images, `React.memo(ProductCard)`, AbortController + debounce |
| Process | ✅ PLAN, README, REPORT, Git history, deploy config | ⬜ weekly progress notes, PR flow — not done |

**Not done / limitations**
- The catalog contains only 13 products (the size of the three DummyJSON beauty categories), so pagination has 2 pages (8 per page).
- Login is a simulation — any username works and the password is never checked or stored.
- Sorting / pagination for the catalog happen on the client (see README → Architecture).

## Metrics

Measured on the live site (https://10x-shop-ia-gigolashvili.vercel.app/), Lighthouse, Mobile preset, incognito window, 12 Nov 2026.

| Metric | Result |
| --- | --- |
| Performance | 86 (scores vary between runs: 73–95) |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 92 |

Screenshot: `docs/lighthouse/lighthouse-mobile.png`.

Commits: 62 (as of 12 Nov 2026)

## Three hardest problems

1. **Search input vs. URL state.** The input must react instantly, the URL only after 400 ms, and the Back button must
   still update the input. Solved by comparing the URL `q` with the *debounced* value before syncing (`CatalogToolbar`).
2. **Stale responses.** Typing quickly or switching products could let an older response overwrite a newer one.
   `useFetch` creates an `AbortController` per request and aborts it in the effect cleanup.
3. **Mobile overflow in the cart.** Long product names pushed the page wider than 375 px because grid items default to
   `min-width: auto`. Fixed with `*:min-w-0` on the page grids (DEBUG-LOG #3).

## What I would do differently

- Write unit tests (Vitest) for `Cart`, `cartReducer` and `OrderModel` from the start.
- Use GitHub Issues / PRs for every feature to make the process easier to follow.

## Use of AI

- Delegated: initial scaffolding, the Tailwind colour palette, first drafts of the docs, a review of edge cases.
- Rejected: storing the password in `localStorage` (not needed and unsafe); a global `any`-typed fetch helper.
- Every file was read and run by me; I can explain each decision at the defence.
