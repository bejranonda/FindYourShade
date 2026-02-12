/**
 * Pages Function - Get answer statistics from D1 database
 * Endpoint: /api/answers
 * Method: GET
 * Query params: ?questionId=0 (optional, get stats for specific question)
 *
 * Returns statistics showing which choices were selected for each question
 */

export async function onRequest(context) {
  const { env, request } = context;

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const url = new URL(request.url);
    const questionId = url.searchParams.get('questionId');

    if (questionId !== null) {
      // Get stats for specific question
      const qId = parseInt(questionId, 10);
      if (isNaN(qId) || qId < 0 || qId > 7) {
        return new Response('Invalid questionId', { status: 400 });
      }

      const { results } = await env.DB.prepare(
        'SELECT choice_index, COUNT(*) as count FROM answers WHERE question_id = ? GROUP BY choice_index ORDER BY choice_index'
      ).bind(qId).all();

      // Convert to object { choiceIndex: count }
      const stats = {};
      for (const row of results) {
        stats[row.choice_index] = row.count;
      }

      return new Response(JSON.stringify({
        questionId: qId,
        choices: stats
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60'
        }
      });
    } else {
      // Get stats for all questions
      const { results } = await env.DB.prepare(
        'SELECT question_id, choice_index, COUNT(*) as count FROM answers GROUP BY question_id, choice_index ORDER BY question_id, choice_index'
      ).all();

      // Convert to nested object { questionId: { choiceIndex: count } }
      const stats = {};
      for (const row of results) {
        if (!stats[row.question_id]) {
          stats[row.question_id] = {};
        }
        stats[row.question_id][row.choice_index] = row.count;
      }

      return new Response(JSON.stringify(stats), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60'
        }
      });
    }

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
