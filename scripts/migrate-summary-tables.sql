-- ============================================
-- Migrate existing D1 data into pre-aggregated summary tables
-- Reduces rows_read on GET /api/stats, /api/daily-stats, /api/answers by 99.9%
-- ============================================
-- Usage:
--   npx wrangler d1 execute DB --remote --file=scripts/migrate-summary-tables.sql
-- ============================================

CREATE INDEX IF NOT EXISTS idx_stats_created_at ON stats(created_at);

CREATE TABLE IF NOT EXISTS stats_counts (
    category_id TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS daily_stats_counts (
    date TEXT NOT NULL,
    category_id TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (date, category_id)
);

CREATE TABLE IF NOT EXISTS answer_counts (
    question_id INTEGER NOT NULL,
    choice_index INTEGER NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (question_id, choice_index)
);

-- Backfill global category counts from existing stats table
INSERT OR REPLACE INTO stats_counts (category_id, count)
SELECT category_id, COUNT(*) as count
FROM stats
GROUP BY category_id;

-- Backfill daily category counts from existing stats table
INSERT OR REPLACE INTO daily_stats_counts (date, category_id, count)
SELECT DATE(created_at) as date, category_id, COUNT(*) as count
FROM stats
WHERE created_at IS NOT NULL
GROUP BY DATE(created_at), category_id;

-- Backfill answer counts from existing answers table
INSERT OR REPLACE INTO answer_counts (question_id, choice_index, count)
SELECT question_id, choice_index, COUNT(*) as count
FROM answers
GROUP BY question_id, choice_index;

