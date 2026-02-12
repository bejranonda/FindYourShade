-- ============================================
-- Clear answers table after quiz question changes
-- Run this when question structure changes to avoid data conflicts
-- ============================================
--
-- Usage:
--   wrangler d1 execute DB --remote --command="DELETE FROM answers;"
--
-- Note: This does NOT affect the stats table (quiz results)
-- ============================================

-- Count records before deletion
SELECT COUNT(*) as answer_count FROM answers;

-- Delete all records from answers table
DELETE FROM answers;

-- Verify deletion
SELECT COUNT(*) as answer_count_after FROM answers;
