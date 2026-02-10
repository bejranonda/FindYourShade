-- Create stats table for quiz results
CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_category_id ON stats(category_id);

-- Initialize with some sample data (optional)
-- INSERT INTO stats (category_id) VALUES ('WHITE'), ('BLUE'), ('RED'), ('ORANGE');
