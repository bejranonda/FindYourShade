/**
 * Pages Function - Get answer statistics from D1 database
 * Endpoint: /api/answers
 * Method: GET
 * Query params: ?questionId=0 (optional, get stats for specific question)
 *
 * Uses pre-aggregated `answer_counts` table (<= 80 rows instead of 1M+ rows)
 * + Cloudflare Edge Cache.
 */

export async function onRequest(context) {
  const { env, request } = context;

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const questionId = url.searchParams.get('questionId');

  if (questionId !== null) {
    const qId = parseInt(questionId, 10);
    if (isNaN(qId) || qId < 0 || qId > 7) {
      return new Response('Invalid questionId', { status: 400 });
    }
  }

  // Normalize cache key (only keep questionId if present)
  const cacheUrl = new URL(url.origin + url.pathname);
  if (questionId !== null) {
    cacheUrl.searchParams.set('questionId', questionId);
  }
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
    if (questionId !== null) {
      const qId = parseInt(questionId, 10);
      try {
        const res = await env.DB.prepare(
          'SELECT choice_index, count FROM answer_counts WHERE question_id = ? ORDER BY choice_index'
        ).bind(qId).all();
        results = res.results || [];
      } catch (tableErr) {
        await initAnswerCounts(env.DB);
        const res = await env.DB.prepare(
          'SELECT choice_index, count FROM answer_counts WHERE question_id = ? ORDER BY choice_index'
        ).bind(qId).all();
        results = res.results || [];
      }

      const stats = {};
      for (const row of results) {
        stats[row.choice_index] = row.count;
      }

      const response = new Response(JSON.stringify({
        questionId: qId,
        choices: stats
      }), {
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
    } else {
      try {
        const res = await env.DB.prepare(
          'SELECT question_id, choice_index, count FROM answer_counts ORDER BY question_id, choice_index'
        ).all();
        results = res.results || [];
      } catch (tableErr) {
        await initAnswerCounts(env.DB);
        const res = await env.DB.prepare(
          'SELECT question_id, choice_index, count FROM answer_counts ORDER BY question_id, choice_index'
        ).all();
        results = res.results || [];
      }

      if (results.length === 0) {
        await initAnswerCounts(env.DB);
        const res = await env.DB.prepare(
          'SELECT question_id, choice_index, count FROM answer_counts ORDER BY question_id, choice_index'
        ).all();
        results = res.results || [];
      }

      const stats = {};
      for (const row of results) {
        if (!stats[row.question_id]) {
          stats[row.question_id] = {};
        }
        stats[row.question_id][row.choice_index] = row.count;
      }

      const response = new Response(JSON.stringify(stats), {
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
    }

  } catch (err) {
    // Graceful fallback if D1 daily cap is exceeded
    const fallbackBody = questionId !== null
      ? { questionId: parseInt(questionId, 10), choices: {} }
      : {};
    const fallbackResponse = new Response(JSON.stringify(fallbackBody), {
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

async function initAnswerCounts(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS answer_counts (
      question_id INTEGER NOT NULL,
      choice_index INTEGER NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (question_id, choice_index)
    )
  `).run();

  await db.prepare(`
    INSERT OR REPLACE INTO answer_counts (question_id, choice_index, count)
    SELECT question_id, choice_index, COUNT(*) as count
    FROM answers
    GROUP BY question_id, choice_index
  `).run();
}
