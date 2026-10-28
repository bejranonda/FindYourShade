# Known Issues & Postmortems (`docs/KNOWN-ISSUES.md`)

This document tracks known issues, root causes, and their resolutions in **FindYourShade**.

---

## Issue 1: Cloudflare D1 Daily `rows_read` Limit Reached (5,000,000 rows/day) — **RESOLVED in v4.0.2**

### Symptoms
- Cloudflare sent warning emails: *"Your account has used 99% of the daily D1 free tier limit of 5,000,000 rows_read."*
- Once 100% was reached, D1 queries threw:
  `D1_ERROR: Your account has exceeded D1's free tier daily row read limit.`

### Root Cause
1. **Unbounded Full-Table Scans:**
   - `stats` table had grown to **160,240 rows**, and `answers` had grown to **~1,120,000 rows**.
   - `GET /api/stats` ran `SELECT category_id, COUNT(*) FROM stats GROUP BY category_id`, reading **160,240 rows** on every execution.
   - `GET /api/daily-stats` ran `WHERE created_at >= datetime('now', '-30 days')` without an index on `created_at`, reading **160,240 rows** on every execution.
2. **Client-Side Cache Busting:**
   - `js/app.js` appended `?t=${Date.now()}` to `/api/stats` and `/api/daily-stats`, bypassing both browser caching and Cloudflare's CDN cache on every single page view.
   - Just **15 users** viewing the statistics page consumed `15 × 320,480 = 4,807,200 rows_read` (96% of the daily quota).

### Resolution (`v4.0.2`)
- Introduced pre-aggregated summary tables (`stats_counts`, `daily_stats_counts`, `answer_counts`) updated via `ON CONFLICT DO UPDATE`.
- Removed `?t=${Date.now()}` in `js/app.js` and added normalized Cloudflare Edge Caching (`caches.default`) in all `GET` functions.
- Added static snapshot fallbacks (`X-Stats-Source: static-fallback`) so the app continues returning HTTP `200` with accurate baseline data even if D1 is rate-limited.

---

## Issue 2: `CREATE INDEX` Fails When D1 Is Near 99% Quota — **RESOLVED in v4.0.2**

### Symptoms
- Running `CREATE INDEX IF NOT EXISTS idx_stats_created_at ON stats(created_at)` during cold-start auto-initialization failed when D1 had `< 160,240` `rows_read` remaining for the day.

### Root Cause
- Building a B-tree index on an existing 160,240-row table requires SQLite to scan all 160,240 rows.

### Resolution
- Wrapped index creation and legacy table backfill inside `try { ... } catch (e)` in `functions/api/daily-stats.js`, `functions/api/stats.js`, and `functions/api/save.js`, falling back to seeding the tiny summary tables from the baseline snapshot (`0 rows_read`).

---

## Issue 3: `localStorage` Fallback Overwrote Global Category Count — **RESOLVED in v4.0.2**

### Symptoms
- Previously in `js/app.js`, `getGlobalStats()` merged API stats and `localStorage` fallback stats using `{ ...stats, ...localStats }`.
- If a user had `{ BLUE: 1 }` saved in `localStorage` from an offline session, `{ ...stats, ...localStats }` replaced `stats.BLUE` (`12,638`) with `1` instead of `12,639`.

### Resolution
- Replaced object spread with `mergeWithLocalStats(baseStats)` in `js/app.js`, which sums `baseStats[k] + localStats[k]`.

---

## Issue 4: Immutable Asset Caching in `_headers` Prevents JS/CSS Updates Without Version Bump — **ACTIVE / BY DESIGN**

### Description
- `_headers` configures `/js/*` and `/css/*` with `Cache-Control: public, max-age=31536000, immutable`.
- If `js/app.js` or `css/tailwind.css` is modified without updating the `?v=X.Y.Z` query string in `index.html`, returning visitors will continue running their cached JavaScript/CSS.

### Workaround / Standard Procedure
- Always increment the version query parameter (`?v=X.Y.Z`) in `index.html` whenever modifying any file under `js/` or `css/`.

