# Engineering Handoff (`HANDOFF.md`)

**Project:** FindYourShade (คุณคือเฉดสีการเมืองไหน? | Thai Political Shade Quiz)
**Current Version:** `v4.0.2`
**Live URL:** [https://findyourshade.autobahn.bot/](https://findyourshade.autobahn.bot/)
**Repository:** [https://github.com/bejranonda/FindYourShade](https://github.com/bejranonda/FindYourShade)
**Last Updated:** 2026-10-28

---

## 1. Executive Summary & Current Status

FindYourShade is a bilingual (Thai/English) interactive political quiz built with Vanilla JavaScript, Tailwind CSS v3, Chart.js, and Cloudflare Pages Functions backed by Cloudflare D1 (serverless SQLite).

- **Total Quiz Completions:** `160,240+` recorded results across 13 political shades.
- **Recent Engineering Milestone (`v4.0.2`):** Resolved the Cloudflare D1 Free Tier `rows_read` daily cap warning (5,000,000 rows/day) by migrating read endpoints (`GET /api/stats`, `GET /api/daily-stats`, `GET /api/answers`) from full-table `COUNT(*) GROUP BY` scans (`160,240+` to `1,100,000+` rows per call) to **pre-aggregated summary counter tables** (`stats_counts`, `daily_stats_counts`, `answer_counts`) combined with **Cloudflare Edge Cache (`caches.default`)**, client session caching, and **zero-downtime static snapshot fallbacks**.

---

## 2. Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                             Browser Client                                 │
│  index.html + js/app.js (60s in-memory cache + optimistic local updates)   │
└───────────────┬────────────────────────────────────────────┬───────────────┘
                │ GET /api/stats                             │ POST /api/save
                │ GET /api/daily-stats                       │ POST /api/answer
                │ GET /api/answers                           ▼
                ▼                               ┌────────────────────────────┐
┌───────────────────────────────────────┐       │ Cloudflare Pages Functions │
│ Cloudflare Edge Cache (caches.default)│       │  - save.js                 │
│ Normalized cache key (strips ?t=...)  │       │  - answer.js               │
│ TTL: 300s edge / 60-120s browser      │       └────────────┬───────────────┘
└───────────────┬───────────────────────┘                    │
                │ Cache Miss                                 │ Atomic Batch Upsert
                ▼                                            ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                   Cloudflare D1 Database (DB)                              │
│  - stats_counts       (13 rows)      ← Read by GET /api/stats              │
│  - daily_stats_counts (~80-390 rows) ← Read by GET /api/daily-stats        │
│  - answer_counts      (≤80 rows)     ← Read by GET /api/answers            │
│  - stats              (160k+ rows)   ← Append-only audit log               │
│  - answers            (legacy table)                                       │
└───────────────┬────────────────────────────────────────────────────────────┘
                │ On D1 Error / Daily Quota Cap
                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│               Static Snapshot Fallback (HTTP 200 OK)                       │
│  Returns verified baseline snapshot (`X-Stats-Source: static-fallback`)    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Concept, Approach & Method

### 3.1 Quiz Scoring & Normalization Method
1. **Multi-Dimensional Scoring:** Every choice across the 7 questions awards weighted points (`+1` to `+3`) to multiple political shades simultaneously.
2. **Fair Score Normalization:** Because different shades have different maximum possible points (`16` to `21`, average `~19`), raw scores are normalized so every shade can reach 100%:
   $$\text{normalizedScore} = \text{rawScore} \times \frac{\text{avgMaxScore}}{\text{maxPossibleScore}}$$
3. **Fisher-Yates Choice Shuffling:** Answer choices are shuffled on every question render to eliminate position bias while preserving original choice indices (`originalIndex`) for analytics.

### 3.2 Citizen Verification & Anomaly Detection Method
- `GET /api/daily-stats` computes the mean ($\mu$) and standard deviation ($\sigma$) of daily quiz completions over the last 30 days.
- Any day with a Z-score $|Z| = \frac{|x - \mu|}{\sigma} > 2$ is flagged in the `anomalies` array using neutral, transparent phrasing (`สูงกว่าปกติ X%` / `ต่ำกว่าปกติ X%`).

### 3.3 Low-`rows_read` D1 Counter Method
- **Never scan raw event tables on `GET` requests.**
- Writes (`POST /api/save` and `POST /api/answer`) use SQLite `INSERT ... ON CONFLICT(...) DO UPDATE SET count = count + 1` to maintain tiny counter tables (`stats_counts`, `daily_stats_counts`, `answer_counts`).
- Reads query only those summary tables (`13` to `80` rows) and cache the JSON response in Cloudflare's Edge Cache (`caches.default`).

---

## 4. Operations & Deployment Runbook

### 4.1 Automatic Deployment (Recommended)
Pushing to `master` on GitHub automatically triggers a Cloudflare Pages build and deployment:
```bash
git add -A
git commit -m "feat/fix: description"
git push origin master
```

### 4.2 Updating Frontend Assets (Cache-Busting Checklist)
Because `_headers` sets `Cache-Control: public, max-age=31536000, immutable` on `/css/*` and `/js/*`, **any change to `js/app.js` or `css/*` requires bumping the version string** in:
1. `index.html` (`css/tailwind.css?v=X.Y.Z`, `css/style.css?v=X.Y.Z`, `js/app.js?v=X.Y.Z`, `<title>`, and footer release text)
2. `js/app.js` (`footerRelease` in both `th` and `en` translations)
3. `package.json` (`"version": "X.Y.Z"`)
4. `README.md` (Version badge and Changelog)

### 4.3 D1 Database Maintenance Commands
```bash
# Authenticate Wrangler CLI (if running manual D1 commands)
npx wrangler login

# Apply schema or summary-table migration on remote D1
npx wrangler d1 execute DB --remote --file=scripts/migrate-summary-tables.sql

# Clear answer statistics after changing quiz questions
npx wrangler d1 execute DB --remote --file=scripts/clear-answers.sql
```

---

## 5. Related Documentation

- **[Knowledge Base (`docs/KNOWLEDGE.md`)](docs/KNOWLEDGE.md):** Detailed domain model, 13 political shades, database schema reference, and Cloudflare D1 internals.
- **[Known Issues & Postmortems (`docs/KNOWN-ISSUES.md`)](docs/KNOWN-ISSUES.md):** Root-cause analysis of the D1 5M `rows_read` incident, cache-busting pitfalls, and historical bug fixes.
- **[Engineering Guidelines (`docs/GUIDELINES.md`)](docs/GUIDELINES.md):** Mandatory rules for D1 SQL queries, caching headers, frontend asset versioning, and testing.
