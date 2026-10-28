/**
 * Pages Function - Get global stats from D1 database
 * Endpoint: /api/stats
 * Method: GET
 *
 * Uses pre-aggregated `stats_counts` table (13 rows instead of 160k+ rows)
 * + Cloudflare Edge Cache (`caches.default`) to reduce D1 rows_read by 99.9%.
 */

const FALLBACK_STATS = {
  BLUE: 12638,
  DARA: 424,
  GREEN: 328,
  MADAM: 6904,
  NAM_MAK: 7043,
  NOM_PHONG: 28578,
  ORANGE: 1975,
  ORANGE_ACADEMIC: 13965,
  ORANGE_FAN: 2773,
  SKY_BLUE: 22265,
  WHITE: 7078,
  YELLOW_CLASSIC: 31446,
  YELLOW_ROYALIST: 24823
};

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
      // Read from pre-aggregated summary table (~13 rows read instead of 160k+)
      const res = await env.DB.prepare(
        'SELECT category_id, count FROM stats_counts'
      ).all();
      results = res.results || [];
    } catch (tableErr) {
      // Table does not exist yet — create and backfill once
      await initStatsCounts(env.DB);
      const res = await env.DB.prepare(
        'SELECT category_id, count FROM stats_counts'
      ).all();
      results = res.results || [];
    }

    // If table existed but was empty, backfill once
    if (results.length === 0) {
      await initStatsCounts(env.DB);
      const res = await env.DB.prepare(
        'SELECT category_id, count FROM stats_counts'
      ).all();
      results = res.results || [];
    }

    // Convert to simple object { CATEGORY_ID: count }
    const stats = {};
    for (const row of results) {
      stats[row.category_id] = row.count;
    }

    const response = new Response(JSON.stringify(stats), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        'X-Stats-Source': 'd1-summary'
      }
    });

    if (cache && context.waitUntil) {
      context.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;

  } catch (err) {
    // Graceful fallback if D1 daily cap is exceeded
    return new Response(JSON.stringify(FALLBACK_STATS), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, s-maxage=120',
        'X-Stats-Source': 'static-fallback'
      }
    });
  }
}

async function initStatsCounts(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS stats_counts (
      category_id TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  try {
    await db.prepare(`
      INSERT OR REPLACE INTO stats_counts (category_id, count)
      SELECT category_id, COUNT(*) as count
      FROM stats
      GROUP BY category_id
    `).run();
  } catch (e) {
    // If `stats` scan exceeds remaining daily cap during init, seed from baseline snapshot
    const stmts = Object.entries(FALLBACK_STATS).map(([cat, count]) =>
      db.prepare('INSERT OR IGNORE INTO stats_counts (category_id, count) VALUES (?, ?)').bind(cat, count)
    );
    await db.batch(stmts);
  }
}
