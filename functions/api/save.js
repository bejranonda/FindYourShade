/**
 * Pages Function - Save quiz result to D1 database
 * Endpoint: /api/save
 * Method: POST
 * Body: { id: "CATEGORY_ID" }
 *
 * Updates raw `stats` log AND increments pre-aggregated `stats_counts`
 * and `daily_stats_counts` tables in a single D1 batch.
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
    const validCategories = [
      'NAM_MAK', 'NOM_PHONG', 'MADAM', 'DARA', 'ORANGE', 'BLUE',
      'SKY_BLUE', 'ORANGE_ACADEMIC', 'ORANGE_FAN', 'YELLOW_CLASSIC',
      'YELLOW_ROYALIST', 'GREEN', 'WHITE'
    ];
    if (!validCategories.includes(id)) {
      return new Response('Invalid category', { status: 400 });
    }

    try {
      await saveWithSummaryTables(env.DB, id);
    } catch (tableErr) {
      // Ensure summary tables exist and retry
      await ensureSummaryTables(env.DB);
      await saveWithSummaryTables(env.DB, id);
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

async function saveWithSummaryTables(db, id) {
  await db.batch([
    db.prepare('INSERT INTO stats (category_id) VALUES (?)').bind(id),
    db.prepare(`
      INSERT INTO stats_counts (category_id, count)
      VALUES (?, 1)
      ON CONFLICT(category_id) DO UPDATE SET count = count + 1
    `).bind(id),
    db.prepare(`
      INSERT INTO daily_stats_counts (date, category_id, count)
      VALUES (DATE('now'), ?, 1)
      ON CONFLICT(date, category_id) DO UPDATE SET count = count + 1
    `).bind(id)
  ]);
}

async function ensureSummaryTables(db) {
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS stats_counts (
        category_id TEXT PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS daily_stats_counts (
        date TEXT NOT NULL,
        category_id TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (date, category_id)
      )
    `),
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_stats_created_at ON stats(created_at)
    `)
  ]);
}
