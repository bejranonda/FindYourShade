/**
 * Pages Function - Clear old answers data from D1 database
 * Endpoint: /api/clear-answers
 * Method: POST
 *
 * This endpoint clears the answers table to remove stale data
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

    // Count existing records before deletion
    const { results: countBefore } = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM answers'
    ).all();

    const count = countBefore[0]?.count || 0;

    // Delete all records from answers table
    const result = await env.DB.prepare(
      'DELETE FROM answers'
    ).run();

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Answers table cleared successfully',
        deletedRecords: count
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      return new Response('Failed to clear answers', { status: 500 });
    }

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
