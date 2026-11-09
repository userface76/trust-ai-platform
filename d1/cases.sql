-- Apply after existing d1/schema.sql
CREATE TABLE IF NOT EXISTS cases (
 id TEXT PRIMARY KEY,
 access_hash TEXT NOT NULL,
 title TEXT NOT NULL,
 category TEXT NOT NULL DEFAULT 'other',
 redacted_text TEXT NOT NULL,
 level TEXT NOT NULL CHECK(level IN ('high','caution','unknown')),
 reasons_json TEXT NOT NULL,
 rule_version TEXT NOT NULL,
 verification_status TEXT NOT NULL DEFAULT 'pending' CHECK(verification_status IN ('pending','verified','disputed')),
 visibility TEXT NOT NULL DEFAULT 'private' CHECK(visibility IN ('private','pending_public','public')),
 author_comment TEXT NOT NULL DEFAULT '',
 checks_json TEXT NOT NULL DEFAULT '{}',
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS cases_public_search_idx ON cases(visibility,created_at);
CREATE INDEX IF NOT EXISTS cases_category_idx ON cases(category,level);
