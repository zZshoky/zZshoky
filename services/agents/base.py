"""
Shared helpers for all Corpora PR scraper agents.
"""
import asyncpg
import json
import os
from datetime import datetime, timezone

DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://corpora:corpora_dev@localhost:5432/corpora",
)


async def get_conn() -> asyncpg.Connection:
    return await asyncpg.connect(DB_URL)


async def upsert_raw(
    conn: asyncpg.Connection,
    source: str,
    external_id: str | None,
    record: dict,
) -> int:
    """
    Insert a scraped record into contracts_raw.
    Returns the new row id, or -1 if nothing was inserted.
    """
    row = await conn.fetchrow(
        """
        INSERT INTO contracts_raw (source, external_id, raw_json, scraped_at)
        VALUES ($1, $2, $3::jsonb, $4)
        RETURNING id
        """,
        source,
        external_id,
        json.dumps(record, ensure_ascii=False, default=str),
        datetime.now(timezone.utc),
    )
    return row["id"] if row else -1
