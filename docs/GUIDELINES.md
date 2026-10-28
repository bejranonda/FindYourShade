# Engineering & Database Guidelines (`docs/GUIDELINES.md`)

Follow these guidelines whenever modifying **FindYourShade** to prevent quota exhaustion, stale caches, or broken deployments.

---

## 1. Cloudflare D1 Database Guidelines

1. **NEVER run `COUNT(*)`, `SUM()`, or `GROUP BY` on unbounded raw tables (`stats`, `answers`) in user-facing `GET` endpoints.**
   - Raw event tables grow indefinitely (`160,000+` rows in `stats`, `1,100,000+` rows in `answers`).
   - Always read from pre-aggregated summary tables (`stats_counts`, `daily_stats_counts`, `answer_counts`) where row counts are strictly bounded (`13` to `390` rows).
2. **Maintain counters atomically on writes (`POST`).**
   - Use `env.DB.batch([...])` and SQLite `UPSERT` syntax:
     ```sql
     INSERT INTO stats_counts (category_id, count)
     VALUES (?, 1)
     ON CONFLICT(category_id) DO UPDATE SET count = count + 1;
     ```
   - Place summary table upserts **before** raw log inserts inside `env.DB.batch([...])` so that if a summary table does not exist yet, the batch fails on statement #1 before inserting a duplicate row into `stats`.
3. **Always provide a graceful fallback in `GET` endpoints.**
   - Never let a D1 quota error (`D1_ERROR`) bubble up as an unhandled HTTP `500` on read endpoints. Catch database errors and return a cached/baseline response with `X-Stats-Source: static-fallback`.

---

## 2. Caching Guidelines

1. **NEVER use `?t=${Date.now()}` on public API `GET` requests.**
   - Appending timestamps defeats both browser caching and Cloudflare CDN edge caching, multiplying D1 `rows_read` by total traffic.
   - Instead, use in-memory client caching (`cachedGlobalStats` in `js/app.js`) and update the client's in-memory count optimistically when the user submits a result.
2. **Always normalize cache keys in Pages Functions.**
   - Strip unknown query parameters (such as legacy `?t=...`) before calling `caches.default.match(cacheKey)` and `caches.default.put(cacheKey, response.clone())`.
3. **Use `s-maxage` and `stale-while-revalidate`.**
   - Standard read header: `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600`.

---

## 3. Quiz Question & Scoring Modification Guidelines

1. **Maintain Score Balance (`~19` max points per shade):**
   - If you add or edit questions/choices in `js/app.js`, check the maximum achievable score for all 13 shades (`calculateMaxPossibleScores()`).
   - Every shade must remain achievable and balanced through the normalization formula.
2. **Preserve `originalIndex` for Shuffled Choices:**
   - Choices are shuffled via Fisher-Yates in `js/app.js`. Always pass `originalIndex` (not the shuffled display index) to `saveAnswerToDatabase()`.
3. **Clear Stale Answer Analytics After Question Changes:**
   - If question meanings or choice indices change, clear `answer_counts` and `answers` using `scripts/clear-answers.sql` or `POST /api/clear-answers`.

---

## 4. Release & Testing Checklist

Before committing and pushing a release:
1. **Build CSS (if HTML/CSS classes changed):**
   ```bash
   npm run build:css
   ```
2. **Bump Version Strings Together (`X.Y.Z`):**
   - `index.html`: `<title>`, `css/tailwind.css?v=X.Y.Z`, `css/style.css?v=X.Y.Z`, `js/app.js?v=X.Y.Z`, and footer release label.
   - `js/app.js`: `footerRelease` in both `translations.th` and `translations.en`.
   - `package.json`: `"version": "X.Y.Z"`.
   - `README.md`: Version badge and Changelog section.
3. **Validate Syntax & Endpoints:**
   ```bash
   node --check js/app.js
   node --check functions/api/stats.js
   node --check functions/api/daily-stats.js
   node --check functions/api/save.js
   node --check functions/api/answer.js
   node --check functions/api/answers.js
   node --check functions/api/clear-answers.js
   ```
