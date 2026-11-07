# DEBUG-LOG

Format: symptom → reproduction → tool → root cause → fix → lesson.
Commit links: replace `<commit>` with the hash from `git log --oneline` after pushing.

## 1. Every catalog request appears twice in the Network tab
- **Symptom:** on page load two identical `/products/category/...` requests; the first is "(canceled)".
- **Reproduce:** `npm run dev`, open DevTools → Network, reload `/`.
- **Tool:** Network tab, React DevTools.
- **Root cause:** React `StrictMode` mounts → unmounts → mounts components in development, so the effect runs twice.
- **Fix:** none needed — `useFetch` aborts the first request in the cleanup, so only one response is used. (`<commit>`)
- **Lesson:** an effect that fetches must have a cleanup; StrictMode is there to reveal missing cleanups.

## 2. "Several categories" filter is not supported by the API
- **Symptom:** the catalog should show only perfume and cosmetics, but `GET /products` returns all 194 products.
- **Reproduce:** open `https://dummyjson.com/products?limit=12` — laptops, furniture, groceries appear.
- **Tool:** Network tab (response preview).
- **Root cause:** DummyJSON filters by one category only.
- **Fix:** load `fragrances`, `beauty`, `skin-care` with `Promise.all`, merge, then sort / paginate on the client. (`<commit>`)
- **Lesson:** read the API contract before designing the UI; client-side sorting is a compromise that works for small data only.

## 3. Horizontal scroll on the cart page at 375 px
- **Symptom:** the cart page could be scrolled sideways by ~26 px on a phone.
- **Reproduce:** DevTools device toolbar → 375 px, add "Essence Mascara Lash Princess", open `/cart`.
- **Tool:** Elements panel (computed width of the grid item), `document.documentElement.scrollWidth`.
- **Root cause:** CSS grid items have `min-width: auto`, so the long title forced the column wider than the screen.
- **Fix:** `*:min-w-0` on the page grids (Cart, Checkout, Product, Order details, Profile) + `break-words` on titles. (`<commit>`)
- **Lesson:** `minmax(auto, 1fr)` is the default — text inside grid / flex children needs `min-w-0` to shrink.

## 4. White squares around product photos in dark mode
- **Symptom:** in the dark theme every product photo sat on a bright white tile.
- **Reproduce:** switch to dark theme on `/`.
- **Tool:** visual check in both themes.
- **Root cause:** DummyJSON photos have a white background; `mix-blend-multiply` was turned off in dark mode.
- **Fix:** a `--photo` colour token that stays light cream in both themes; photos always use `mix-blend-multiply`. (`<commit>`)
- **Lesson:** design tokens should describe purpose ("photo backdrop"), not just light / dark values.

## 5. Search box lost characters while typing
- **Symptom (during design):** syncing the input from the URL could reset "dio" back to "di" while the debounce was pending.
- **Tool:** React DevTools (state of `CatalogToolbar`).
- **Root cause:** comparing the URL with the *current* input instead of the *debounced* value.
- **Fix:** only sync when `q` differs from both the debounced value and the input. (`<commit>`)
- **Lesson:** when two sources of truth exist (input and URL), define exactly when each one wins.

## 6. Refreshing `/products/5` on the deployed site returns 404
- **Root cause:** the host looks for a real `products/5` file; an SPA only has `index.html`.
- **Fix:** `vercel.json` rewrite and `public/_redirects` for Netlify. (`<commit>`)
