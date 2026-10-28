/**
 * Pages Function - Save individual answer to D1 database
 * Endpoint: /api/answer
 * Method: POST
 * Body: { questionId: number, choiceIndex: number, sessionId: string }
 *
 * Increments pre-aggregated `answer_counts` table (max 80 rows total)
 * instead of appending unbounded rows to `answers`.
 */

export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { questionId, choiceIndex, sessionId } = await request.json();

    // Validate required fields
    if (questionId === undefined || choiceIndex === undefined || !sessionId) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Validate questionId (0-7 for up to 8 questions)
    if (!Number.isInteger(questionId) || questionId < 0 || questionId > 7) {
      return new Response('Invalid questionId', { status: 400 });
    }

    // Validate choiceIndex (0-9 for up to 10 choices)
    if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex > 9) {
      return new Response('Invalid choiceIndex', { status: 400 });
    }

    const upsertSql = `
      INSERT INTO answer_counts (question_id, choice_index, count)
      VALUES (?, ?, 1)
      ON CONFLICT(question_id, choice_index) DO UPDATE SET count = count + 1
    `;

    try {
      await env.DB.prepare(upsertSql).bind(questionId, choiceIndex).run();
    } catch (tableErr) {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS answer_counts (
          question_id INTEGER NOT NULL,
          choice_index INTEGER NOT NULL,
          count INTEGER NOT NULL DEFAULT 0,
          PRIMARY KEY (question_id, choice_index)
        )
      `).run();
      await env.DB.prepare(upsertSql).bind(questionId, choiceIndex).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
