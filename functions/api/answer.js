/**
 * Pages Function - Save individual answer to D1 database
 * Endpoint: /api/answer
 * Method: POST
 * Body: { questionId: number, choiceIndex: number, sessionId: string }
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

    // Validate questionId (0-7 for 8 questions)
    if (!Number.isInteger(questionId) || questionId < 0 || questionId > 7) {
      return new Response('Invalid questionId', { status: 400 });
    }

    // Validate choiceIndex (0-9 for up to 10 choices)
    if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex > 9) {
      return new Response('Invalid choiceIndex', { status: 400 });
    }

    // Insert into answers table
    const success = await env.DB.prepare(
      'INSERT INTO answers (session_id, question_id, choice_index) VALUES (?, ?, ?)'
    ).bind(sessionId, questionId, choiceIndex).run();

    if (success.success) {
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      return new Response('Failed to save answer', { status: 500 });
    }

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
