# Knowledge Base (`docs/KNOWLEDGE.md`)

This document captures core domain knowledge, technical internals, and database mechanics for **FindYourShade**.

---

## 1. Domain Model: The 13 Political Shades

| Category ID | Icon | Thai Name | English Name | Max Possible Score |
| :--- | :---: | :--- | :--- | :---: |
| `NAM_MAK` | 🥊 | แดงน้ำหมาก | Traditionalist Red | 21 |
| `NOM_PHONG` | 🍼 | แดงนมผง | New Gen Red | 18 |
| `MADAM` | 🍷 | แดงมาดาม | Sophisticated Red | 20 |
| `DARA` | ✨ | แดงดารา | Celebrity Red | 20 |
| `ORANGE_ACADEMIC` | 🍊👓 | ส้มวิชาการ | Academic Orange | 19 |
| `ORANGE_FAN` | 🧡🔥 | ส้มแบก | Fandom Orange | 19 |
| `ORANGE` | 🎭 | ส้มแอบเนียน | Closeted Orange | 16 |
| `YELLOW_CLASSIC` | 🎗️ | เหลืองคลาสสิก | Classic Yellow | 19 |
| `YELLOW_ROYALIST` | 👑 | เหลืองสถาบัน | Royalist | 21 |
| `BLUE` | 🔵 | น้ำเงิน | Blue | 20 |
| `SKY_BLUE` | 🌩️ | ฟ้า | Sky Blue | 19 |
| `GREEN` | 🪖 | เขียว | Green | 20 |
| `WHITE` | 🏳️ | ขาว | Silent White | 18 |

---

## 2. Cloudflare D1 Mechanics & Quota Accounting

### How D1 Counts `rows_read` and `rows_written`
- **Free Tier Limits:**
  - `rows_read`: **5,000,000 rows / day** (resets at `00:00:00 UTC`).
  - `rows_written`: **100,000 rows / day**.
- **Critical SQLite / D1 Behavior:**
  - `SELECT COUNT(*) FROM table` or `SELECT category_id, COUNT(*) FROM stats GROUP BY category_id` **does not read 1 or 13 rows**—SQLite must scan every entry in the table or index to count them. When `stats` has `160,240` rows, a single `GROUP BY` query bills **160,240 `rows_read`**.
  - `CREATE INDEX ON table(col)` scans every row in `table` (`160,240` `rows_read`).
  - When the daily `rows_read` limit is reached, D1 rejects **all** queries until `00:00:00 UTC` with:
    `D1_ERROR: Your account has exceeded D1's free tier daily row read limit.`

### Summary Table Design (`v4.0.2+`)
To keep `rows_read` bounded regardless of how many millions of players take the quiz:
1. **`stats_counts (category_id TEXT PRIMARY KEY, count INTEGER)`**:
   - Contains exactly **13 rows** (one per political shade).
   - `GET /api/stats` reads `SELECT category_id, count FROM stats_counts` → **13 `rows_read`**.
2. **`daily_stats_counts (date TEXT, category_id TEXT, count INTEGER, PRIMARY KEY (date, category_id))`**:
   - Contains 1 row per active `(date, category_id)` pair.
   - `GET /api/daily-stats` queries `WHERE date >= DATE('now', '-30 days')` using the primary key prefix `date` → **~80–390 `rows_read`**.
3. **`answer_counts (question_id INTEGER, choice_index INTEGER, count INTEGER, PRIMARY KEY (question_id, choice_index))`**:
   - Contains at most **80 rows** (8 questions × up to 10 choices).
   - `GET /api/answers` reads at most **80 `rows_read`**.

---

## 3. Caching & Fallback Architecture

### 3.1 Edge Cache Key Normalization
- Older browser clients or external links might request `/api/stats?t=1730000000` with a cache-busting query parameter.
- In `functions/api/stats.js` and `functions/api/daily-stats.js`, the Worker constructs a canonical `cacheKey` from `url.origin + url.pathname` (stripping `?t=`) before querying `caches.default`. This ensures **100% of requests share the same Cloudflare Edge Cache entry** per PoP.

### 3.2 Diagnostic Response Header (`X-Stats-Source`)
All stats `GET` endpoints return an `X-Stats-Source` HTTP header for observability:
- `X-Stats-Source: d1-summary`: Data was served from the D1 pre-aggregated summary tables.
- `X-Stats-Source: static-fallback`: D1 was unreachable or at its daily quota limit, and the endpoint gracefully served the verified baseline snapshot with HTTP `200`.

### 3.3 Client-Side Session Cache & Optimistic Updates
- `js/app.js` caches `getGlobalStats()` and `getDailyStats()` in memory for `60,000 ms` (`STATS_CACHE_TTL_MS`).
- When a user finishes the quiz, `saveResultToDatabase(category)` immediately increments `cachedGlobalStats[category.id]` in memory so the user sees their result included in the global count without triggering an uncached D1 query.
