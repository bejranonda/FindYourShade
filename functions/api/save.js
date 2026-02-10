/**
 * Pages Function - Save quiz result to D1 database
 * Endpoint: /api/save
 * Method: POST
 * Body: { id: "CATEGORY_ID" }
 */

export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return new Response('Missing category id', { status: 400 });
    }

    // Validate category exists
    const validCategories = ['NAM_MAK', 'NOM_PHONG', 'MADAM', 'DARA', 'ORANGE', 'BLUE', 'SKY_BLUE', 'ORANGE_ACADEMIC', 'ORANGE_FAN', 'YELLOW_CLASSIC', 'YELLOW_ROYALIST', 'GREEN', 'WHITE'];
    if (!validCategories.includes(id)) {
      return new Response('Invalid category', { status: 400 });
    }

    // Insert into D1 database
    const success = await env.DB.prepare(
      'INSERT INTO stats (category_id) VALUES (?)'
    ).bind(id).run();

    if (success.success) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
        cors: '*'
      });
    } else {
      return new Response('Failed to save', { status: 500 });
    }

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
