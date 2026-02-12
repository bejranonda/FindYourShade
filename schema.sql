-- ============================================
-- FindYourShade - Cloudflare D1 Database Schema
-- ============================================
-- This schema creates the stats table for storing
-- quiz results globally across all users.
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
-- Used by GET /api/stats endpoint
CREATE INDEX IF NOT EXISTS idx_category_id ON stats(category_id);

-- ============================================
-- Valid category_id values:
-- ============================================
-- NAM_MAK       - แดงน้ำหมาก (Traditionalist Red)
-- NOM_PHONG     - แดงนมผง (New Gen Red)
-- MADAM         - แดงมาดาม (Sophisticated Red)
-- DARA          - แดงดารา (Celebrity Red)
-- ORANGE        - ส้ม (Orange - Legacy)
-- ORANGE_ACADEMIC - ส้มวิชาการ (Academic Orange)
-- ORANGE_FAN    - ส้มแบก (Fandom Orange)
-- BLUE          - น้ำเงิน (Blue)
-- SKY_BLUE      - ฟ้า (Sky Blue)
-- YELLOW_CLASSIC - เหลืองคลาสสิก (Classic Yellow)
-- YELLOW_ROYALIST - เหลืองสถาบัน (Royalist)
-- GREEN         - เขียว (Green)
-- WHITE         - ขาว (Silent White)
-- ============================================

-- Optional: Initialize with sample data for testing
-- Uncomment the lines below to seed the database
-- INSERT INTO stats (category_id) VALUES ('WHITE');
-- INSERT INTO stats (category_id) VALUES ('BLUE');
-- INSERT INTO stats (category_id) VALUES ('NAM_MAK');
-- INSERT INTO stats (category_id) VALUES ('ORANGE');
