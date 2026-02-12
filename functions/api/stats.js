/**
 * Pages Function - Get global stats from D1 database
 * Endpoint: /api/stats
 * Method: GET
 */

export async function onRequest(context) {
  const { env } = context;

  // Only allow GET requests
  if (context.request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Get all stats from database
    const { results } = await env.DB.prepare(
      'SELECT category_id, COUNT(*) as count FROM stats GROUP BY category_id'
    ).all();

    // Convert to simple object { CATEGORY_ID: count }
    const stats = {};
    for (const row of results) {
      stats[row.category_id] = row.count;
    }

    // Add CORS headers
    return new Response(JSON.stringify(stats), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=10' // Cache for 10 seconds for near real-time stats
      }
    });

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
