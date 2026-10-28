/**
 * Pages Function - Clear old answers data from D1 database
 * Endpoint: /api/clear-answers
 * Method: POST
 *
 * This endpoint clears the answer_counts and answers tables to remove stale data
 * after quiz question changes. It does NOT affect the stats table.
 *
 * Usage:
 *   POST /api/clear-answers
 *   Body: { confirm: "CLEAR_ANSWERS" }
 */

export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { confirm } = await request.json();

    // Require confirmation to prevent accidental deletion
    if (confirm !== 'CLEAR_ANSWERS') {
      return new Response(JSON.stringify({
        error: 'Confirmation required',
        hint: 'Send { "confirm": "CLEAR_ANSWERS" } to confirm deletion'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete records from both summary and raw answers tables without full-table COUNT(*)
    await env.DB.prepare('DELETE FROM answers').run();
    try {
      await env.DB.prepare('DELETE FROM answer_counts').run();
    } catch (e) {
      // Ignore if answer_counts does not exist yet
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Answers tables cleared successfully'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
