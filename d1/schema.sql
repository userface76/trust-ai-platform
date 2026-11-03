CREATE TABLE IF NOT EXISTS scan_results (id TEXT PRIMARY KEY, level TEXT NOT NULL CHECK(level IN ('high','caution','unknown')), reason_codes TEXT NOT NULL DEFAULT '[]', rule_version TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX IF NOT EXISTS scan_results_created_at_idx ON scan_results(created_at);
