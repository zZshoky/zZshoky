-- Corpora PR — Phase 0 Initial Schema
-- Enable pgvector (no-op now; ready for Phase 1 embeddings)
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Waitlist ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS waitlist (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    name        VARCHAR(255),
    org_type    VARCHAR(100),
    -- contractor | law_firm | journalist | compliance | federal | municipal | other
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_hash     VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_org_type   ON waitlist(org_type);

-- ── Raw scraper output ────────────────────────────────────────────────────────
-- Stores unprocessed JSON from all scraper agents.
-- Phase 1 will add a normalized `contracts` table and move data there.
CREATE TABLE IF NOT EXISTS contracts_raw (
    id          SERIAL PRIMARY KEY,
    source      VARCHAR(50) NOT NULL,      -- ocpr | asg | usaspending
    external_id VARCHAR(255),
    raw_json    JSONB NOT NULL,
    scraped_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_raw_source     ON contracts_raw(source);
CREATE INDEX IF NOT EXISTS idx_contracts_raw_scraped_at ON contracts_raw(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_contracts_raw_json       ON contracts_raw USING GIN(raw_json);
