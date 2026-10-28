/**
 * Pages Function - Get daily stats from D1 database
 * Endpoint: /api/daily-stats
 * Method: GET
 *
 * Uses pre-aggregated `daily_stats_counts` table + Cloudflare Edge Cache
 * to avoid scanning 160k+ rows in `stats` on every request.
 */

const FALLBACK_DAILY_ROWS = [
  { date: '2026-09-30', category_id: 'NOM_PHONG', count: 1 },
  { date: '2026-09-30', category_id: 'ORANGE_ACADEMIC', count: 1 },
  { date: '2026-09-30', category_id: 'SKY_BLUE', count: 1 },
  { date: '2026-09-30', category_id: 'WHITE', count: 1 },
  { date: '2026-10-01', category_id: 'NAM_MAK', count: 1 },
  { date: '2026-10-01', category_id: 'NOM_PHONG', count: 2 },
  { date: '2026-10-01', category_id: 'WHITE', count: 1 },
  { date: '2026-10-02', category_id: 'NOM_PHONG', count: 1 },
  { date: '2026-10-03', category_id: 'NOM_PHONG', count: 1 },
  { date: '2026-10-03', category_id: 'WHITE', count: 1 },
  { date: '2026-10-03', category_id: 'YELLOW_CLASSIC', count: 1 },
  { date: '2026-10-03', category_id: 'YELLOW_ROYALIST', count: 1 },
  { date: '2026-10-04', category_id: 'NOM_PHONG', count: 1 },
  { date: '2026-10-04', category_id: 'ORANGE_ACADEMIC', count: 2 },
  { date: '2026-10-05', category_id: 'NOM_PHONG', count: 2 },
  { date: '2026-10-05', category_id: 'ORANGE_ACADEMIC', count: 2 },
  { date: '2026-10-05', category_id: 'ORANGE_FAN', count: 2 },
  { date: '2026-10-05', category_id: 'SKY_BLUE', count: 1 },
  { date: '2026-10-05', category_id: 'WHITE', count: 2 },
  { date: '2026-10-06', category_id: 'ORANGE_ACADEMIC', count: 2 },
  { date: '2026-10-07', category_id: 'ORANGE_ACADEMIC', count: 1 },
  { date: '2026-10-07', category_id: 'WHITE', count: 1 },
  { date: '2026-10-07', category_id: 'YELLOW_ROYALIST', count: 3 },
  { date: '2026-10-08', category_id: 'NOM_PHONG', count: 1 },
  { date: '2026-10-09', category_id: 'GREEN', count: 1 },
  { date: '2026-10-09', category_id: 'MADAM', count: 1 },
  { date: '2026-10-09', category_id: 'NOM_PHONG', count: 2 },
  { date: '2026-10-09', category_id: 'ORANGE', count: 1 },
  { date: '2026-10-09', category_id: 'ORANGE_ACADEMIC', count: 1 },
  { date: '2026-10-09', category_id: 'ORANGE_FAN', count: 1 },
  { date: '2026-10-11', category_id: 'SKY_BLUE', count: 1 },
  { date: '2026-10-12', category_id: 'ORANGE_ACADEMIC', count: 1 },
  { date: '2026-10-14', category_id: 'SKY_BLUE', count: 1 },
  { date: '2026-10-15', category_id: 'NAM_MAK', count: 1 },
  { date: '2026-10-15', category_id: 'NOM_PHONG', count: 2 },
  { date: '2026-10-15', category_id: 'ORANGE', count: 1 },
  { date: '2026-10-15', category_id: 'SKY_BLUE', count: 2 },
  { date: '2026-10-15', category_id: 'WHITE', count: 1 },
  { date: '2026-10-15', category_id: 'YELLOW_ROYALIST', count: 1 },
  { date: '2026-10-16', category_id: 'YELLOW_ROYALIST', count: 1 },
  { date: '2026-10-19', category_id: 'NOM_PHONG', count: 1 },
  { date: '2026-10-19', category_id: 'ORANGE', count: 1 },
  { date: '2026-10-20', category_id: 'MADAM', count: 1 },
  { date: '2026-10-20', category_id: 'NOM_PHONG', count: 1 },
  { date: '2026-10-20', category_id: 'WHITE', count: 1 },
  { date: '2026-10-21', category_id: 'MADAM', count: 1 },
  { date: '2026-10-21', category_id: 'NOM_PHONG', count: 4 },
  { date: '2026-10-21', category_id: 'ORANGE_ACADEMIC', count: 1 },
  { date: '2026-10-21', category_id: 'ORANGE_FAN', count: 1 },
  { date: '2026-10-21', category_id: 'YELLOW_ROYALIST', count: 1 },
  { date: '2026-10-22', category_id: 'NAM_MAK', count: 1 },
  { date: '2026-10-22', category_id: 'NOM_PHONG', count: 3 },
  { date: '2026-10-22', category_id: 'ORANGE_ACADEMIC', count: 3 },
  { date: '2026-10-22', category_id: 'SKY_BLUE', count: 2 },
  { date: '2026-10-22', category_id: 'WHITE', count: 1 },
  { date: '2026-10-22', category_id: 'YELLOW_CLASSIC', count: 1 },
  { date: '2026-10-23', category_id: 'NAM_MAK', count: 1 },
  { date: '2026-10-23', category_id: 'WHITE', count: 1 },
  { date: '2026-10-24', category_id: 'NAM_MAK', count: 1 },
  { date: '2026-10-24', category_id: 'NOM_PHONG', count: 4 },
  { date: '2026-10-24', category_id: 'ORANGE_FAN', count: 1 },
  { date: '2026-10-25', category_id: 'MADAM', count: 2 },
  { date: '2026-10-26', category_id: 'NOM_PHONG', count: 1 },
  { date: '2026-10-27', category_id: 'GREEN', count: 1 },
  { date: '2026-10-27', category_id: 'MADAM', count: 2 },
  { date: '2026-10-27', category_id: 'WHITE', count: 1 },
  { date: '2026-10-28', category_id: 'BLUE', count: 1 },
  { date: '2026-10-28', category_id: 'MADAM', count: 2 },
  { date: '2026-10-28', category_id: 'NOM_PHONG', count: 7 },
  { date: '2026-10-28', category_id: 'ORANGE_ACADEMIC', count: 3 },
  { date: '2026-10-28', category_id: 'ORANGE_FAN', count: 1 },
  { date: '2026-10-28', category_id: 'SKY_BLUE', count: 3 },
  { date: '2026-10-28', category_id: 'WHITE', count: 3 },
  { date: '2026-10-28', category_id: 'YELLOW_ROYALIST', count: 1 }
];

export async function onRequest(context) {
  const { env, request } = context;

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Normalize cache key by stripping cache-busting query params (?t=...)
  const url = new URL(request.url);
  const cacheUrl = new URL(url.origin + url.pathname);
  const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
  const cache = typeof caches !== 'undefined' ? caches.default : null;

  if (cache) {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  try {
    let results = [];
    try {
      // Read from pre-aggregated daily_stats_counts (~30-390 rows instead of 160k+)
      const res = await env.DB.prepare(`
        SELECT date, category_id, count
        FROM daily_stats_counts
        WHERE date >= DATE('now', '-30 days')
        ORDER BY date DESC
      `).all();
      results = res.results || [];
    } catch (tableErr) {
      await initDailyStatsCounts(env.DB);
      const res = await env.DB.prepare(`
        SELECT date, category_id, count
        FROM daily_stats_counts
        WHERE date >= DATE('now', '-30 days')
        ORDER BY date DESC
      `).all();
      results = res.results || [];
    }

    if (results.length === 0) {
      await initDailyStatsCounts(env.DB);
      const res = await env.DB.prepare(`
        SELECT date, category_id, count
        FROM daily_stats_counts
        WHERE date >= DATE('now', '-30 days')
        ORDER BY date DESC
      `).all();
      results = res.results || [];
    }

    const payload = buildDailyResponse(results);
    const response = new Response(JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=600',
        'X-Stats-Source': 'd1-summary'
      }
    });

    if (cache && context.waitUntil) {
      context.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;

  } catch (err) {
    // Graceful fallback if D1 daily cap is exceeded
    const fallbackPayload = buildDailyResponse(FALLBACK_DAILY_ROWS);
    const fallbackResponse = new Response(JSON.stringify(fallbackPayload), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, s-maxage=120',
        'X-Stats-Source': 'static-fallback'
      }
    });

    if (cache && context.waitUntil) {
      context.waitUntil(cache.put(cacheKey, fallbackResponse.clone()));
    }

    return fallbackResponse;
  }
}

async function initDailyStatsCounts(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS daily_stats_counts (
      date TEXT NOT NULL,
      category_id TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (date, category_id)
    )
  `).run();

  try {
    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_stats_created_at ON stats(created_at)
    `).run();

    await db.prepare(`
      INSERT OR REPLACE INTO daily_stats_counts (date, category_id, count)
      SELECT DATE(created_at) as date, category_id, COUNT(*) as count
      FROM stats
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY DATE(created_at), category_id
    `).run();
  } catch (e) {
    const stmts = FALLBACK_DAILY_ROWS.map(r =>
      db.prepare('INSERT OR IGNORE INTO daily_stats_counts (date, category_id, count) VALUES (?, ?, ?)')
        .bind(r.date, r.category_id, r.count)
    );
    await db.batch(stmts);
  }
}

function buildDailyResponse(results) {
  const dates = [...new Set(results.map(r => r.date))].sort();
  const categories = [...new Set(results.map(r => r.category_id))];

  const dailyData = dates.map(date => {
    const dayData = { date, total: 0 };
    const dayResults = results.filter(r => r.date === date);
    for (const row of dayResults) {
      dayData[row.category_id] = row.count;
      dayData.total += row.count;
    }
    return dayData;
  });

  const totals = dailyData.map(d => d.total);
  const avg = totals.length > 0 ? totals.reduce((a, b) => a + b, 0) / totals.length : 0;
  const stdDev = calculateStdDev(totals, avg);

  const anomalies = [];
  for (const day of dailyData) {
    if (stdDev > 0) {
      const zscore = (day.total - avg) / stdDev;
      if (Math.abs(zscore) > 2) {
        anomalies.push({
          date: day.date,
          total: day.total,
          type: zscore > 0 ? 'high' : 'low',
          zscore: Math.round(zscore * 100) / 100,
          avg: Math.round(avg * 10) / 10,
          message: zscore > 0
            ? `สูงกว่าปกติ ${Math.round((zscore / 2) * 100)}%`
            : `ต่ำกว่าปกติ ${Math.round(Math.abs(zscore / 2) * 100)}%`
        });
      }
    }
  }

  return {
    dailyData,
    categories,
    anomalies,
    summary: {
      totalDays: dates.length,
      avgPerDay: Math.round(avg * 10) / 10,
      stdDev: Math.round(stdDev * 10) / 10,
      maxInDay: Math.max(...totals, 0),
      minInDay: Math.min(...totals.filter(t => t > 0), 0)
    }
  };
}

function calculateStdDev(values, mean) {
  if (values.length < 2) return 0;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}
