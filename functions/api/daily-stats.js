/**
 * Pages Function - Get daily stats from D1 database
 * Endpoint: /api/daily-stats
 * Method: GET
 *
 * Returns daily counts for each shade + anomaly detection
 */

export async function onRequest(context) {
  const { env } = context;

  // Only allow GET requests
  if (context.request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Get daily counts for last 30 days
    const { results } = await env.DB.prepare(`
      SELECT
        DATE(created_at) as date,
        category_id,
        COUNT(*) as count
      FROM stats
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY DATE(created_at), category_id
      ORDER BY date DESC
    `).all();

    // Get all unique dates and categories
    const dates = [...new Set(results.map(r => r.date))].sort();
    const categories = [...new Set(results.map(r => r.category_id))];

    // Build daily data structure
    const dailyData = dates.map(date => {
      const dayData = { date, total: 0 };
      const dayResults = results.filter(r => r.date === date);
      for (const row of dayResults) {
        dayData[row.category_id] = row.count;
        dayData.total += row.count;
      }
      return dayData;
    });

    // Calculate statistics for anomaly detection
    const totals = dailyData.map(d => d.total);
    const avg = totals.length > 0 ? totals.reduce((a, b) => a + b, 0) / totals.length : 0;
    const stdDev = calculateStdDev(totals, avg);

    // Detect anomalies (Z-score > 2)
    const anomalies = [];
    for (const day of dailyData) {
      if (stdDev > 0) {
        const zscore = (day.total - avg) / stdDev;
        if (Math.abs(zscore) > 2) {
          anomalies.push({
            date: day.date,
            total: day.total,
            type: zscore > 0 ? 'high' : 'low',
            zscore: Math.round(zscore * 100) / 100,
            avg: Math.round(avg * 10) / 10,
            message: zscore > 0
              ? `สูงกว่าปกติ ${Math.round((zscore / 2) * 100)}%`
              : `ต่ำกว่าปกติ ${Math.round(Math.abs(zscore / 2) * 100)}%`
          });
        }
      }
    }

    // Build response
    const response = {
      dailyData,
      categories,
      anomalies,
      summary: {
        totalDays: dates.length,
        avgPerDay: Math.round(avg * 10) / 10,
        stdDev: Math.round(stdDev * 10) / 10,
        maxInDay: Math.max(...totals, 0),
        minInDay: Math.min(...totals.filter(t => t > 0), 0)
      }
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute
      }
    });

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}

// Helper: Calculate standard deviation
function calculateStdDev(values, mean) {
  if (values.length < 2) return 0;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}
