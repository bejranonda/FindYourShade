-- ============================================
-- FindYourShade - Cloudflare D1 Database Schema
-- ============================================
-- This schema creates the stats and summary tables for storing
-- quiz results globally across all users with minimal rows_read.
--
-- Usage:
--   wrangler d1 execute DB --remote --file=schema.sql
-- ============================================

-- Stats table: stores each quiz result with timestamp
-- Each row represents one user's quiz result
CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id TEXT NOT NULL,  -- References category ID (e.g., 'NAM_MAK', 'BLUE', 'WHITE')
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster aggregation queries
CREATE INDEX IF NOT EXISTS idx_category_id ON stats(category_id);

-- Index for date-range queries (e.g., last 30 days)
CREATE INDEX IF NOT EXISTS idx_stats_created_at ON stats(created_at);

-- ============================================
-- Pre-Aggregated Summary Tables (Low rows_read)
-- ============================================
-- These tables keep running totals so GET endpoints read ~13-80 rows
-- instead of scanning 160,000+ rows in `stats` or 1,000,000+ rows in `answers`.

-- Global category counts (max 13 rows)
-- Used by GET /api/stats
CREATE TABLE IF NOT EXISTS stats_counts (
    category_id TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
);

-- Daily category counts (1 row per date + category)
-- Used by GET /api/daily-stats
CREATE TABLE IF NOT EXISTS daily_stats_counts (
    date TEXT NOT NULL,
    category_id TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (date, category_id)
);

-- Pre-aggregated answer counts per question and choice (max 80 rows)
-- Used by GET /api/answers
CREATE TABLE IF NOT EXISTS answer_counts (
    question_id INTEGER NOT NULL,
    choice_index INTEGER NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (question_id, choice_index)
);

-- ============================================
-- Answers table (Legacy raw log)
-- ============================================
CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,      -- Unique identifier for each quiz session (UUID)
    question_id INTEGER NOT NULL,  -- Question number (0-7)
    choice_index INTEGER NOT NULL, -- Index of selected choice (0-9)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries by session
CREATE INDEX IF NOT EXISTS idx_session_id ON answers(session_id);

-- Index for faster aggregation queries by question and choice
CREATE INDEX IF NOT EXISTS idx_question_choice ON answers(question_id, choice_index);

-- ============================================
-- Valid category_id values:
-- ============================================
-- NAM_MAK         - แดงน้ำหมาก (Traditionalist Red)
-- NOM_PHONG       - แดงนมผง (New Gen Red)
-- MADAM           - แดงมาดาม (Sophisticated Red)
-- DARA            - แดงดารา (Celebrity Red)
-- ORANGE          - ส้ม (Orange - Legacy)
-- ORANGE_ACADEMIC - ส้มวิชาการ (Academic Orange)
-- ORANGE_FAN      - ส้มแบก (Fandom Orange)
-- BLUE            - น้ำเงิน (Blue)
-- SKY_BLUE        - ฟ้า (Sky Blue)
-- YELLOW_CLASSIC  - เหลืองคลาสสิก (Classic Yellow)
-- YELLOW_ROYALIST - เหลืองสถาบัน (Royalist)
-- GREEN           - เขียว (Green)
-- WHITE           - ขาว (Silent White)
-- ============================================
