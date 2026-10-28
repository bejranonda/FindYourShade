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
    await ensureAnswerCountsReady(env.DB);

    if (questionId !== null) {
      const qId = parseInt(questionId, 10);
      if (isNaN(qId) || qId < 0 || qId > 7) {
        return new Response('Invalid questionId', { status: 400 });
      }

      const { results } = await env.DB.prepare(
        'SELECT choice_index, count FROM answer_counts WHERE question_id = ? ORDER BY choice_index'
      ).bind(qId).all();

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
          'Cache-Control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=600'
        }
      });

      if (cache && context.waitUntil) {
        context.waitUntil(cache.put(cacheKey, response.clone()));
      }
      return response;
    } else {
      const { results } = await env.DB.prepare(
        'SELECT question_id, choice_index, count FROM answer_counts ORDER BY question_id, choice_index'
      ).all();

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
          'Cache-Control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=600'
        }
      });

      if (cache && context.waitUntil) {
        context.waitUntil(cache.put(cacheKey, response.clone()));
      }
      return response;
    }

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}

async function ensureAnswerCountsReady(db) {
  try {
    const { results } = await db.prepare('SELECT 1 FROM answer_counts LIMIT 1').all();
    if (results && results.length > 0) return;
  } catch (e) {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS answer_counts (
        question_id INTEGER NOT NULL,
        choice_index INTEGER NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (question_id, choice_index)
      )
    `).run();
  }

  try {
    await db.prepare(`
      INSERT OR REPLACE INTO answer_counts (question_id, choice_index, count)
      SELECT question_id, choice_index, COUNT(*) as count
      FROM answers
      GROUP BY question_id, choice_index
    `).run();
  } catch (e) {
    // Ignore if answers table is empty or D1 cap reached
  }
}
