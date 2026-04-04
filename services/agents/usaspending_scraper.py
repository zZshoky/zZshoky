"""
USASpending Scraper (A4) — api.usaspending.gov
Fetches federal contract awards where place of performance is Puerto Rico.

This is the most reliable Phase 0 scraper because USASpending provides
a stable, documented public REST API with no auth required.

Usage:
    python usaspending_scraper.py
    DATABASE_URL=postgresql://... python usaspending_scraper.py
"""
import asyncio
import httpx
import sys
from base import get_conn, upsert_raw

API_URL = "https://api.usaspending.gov/api/v2/search/spending_by_award/"

PAYLOAD_TEMPLATE: dict = {
    "filters": {
        # A/B/C/D = procurement contracts (not grants/loans)
        "award_type_codes": ["A", "B", "C", "D"],
        "place_of_performance_locations": [
            {"country": "USA", "state": "PR"}
        ],
        "time_period": [
            {"start_date": "2022-01-01", "end_date": "2025-12-31"}
        ],
    },
    "fields": [
        "Award ID",
        "Recipient Name",
        "Awarding Agency",
        "Awarding Sub Agency",
        "Award Amount",
        "Start Date",
        "End Date",
        "Award Type",
        "Description",
        "Place of Performance City Name",
        "Place of Performance State Code",
        "NAICS Code",
        "NAICS Description",
    ],
    "sort":  "Award Amount",
    "order": "desc",
    "limit": 100,
    "page":  1,
}


def normalize(raw: dict) -> dict:
    return {
        "award_id":        raw.get("Award ID"),
        "recipient_name":  raw.get("Recipient Name"),
        "awarding_agency": raw.get("Awarding Agency"),
        "awarding_sub":    raw.get("Awarding Sub Agency"),
        "amount":          raw.get("Award Amount"),
        "start_date":      raw.get("Start Date"),
        "end_date":        raw.get("End Date"),
        "award_type":      raw.get("Award Type"),
        "description":     raw.get("Description"),
        "city":            raw.get("Place of Performance City Name"),
        "state_code":      raw.get("Place of Performance State Code"),
        "naics_code":      raw.get("NAICS Code"),
        "naics_desc":      raw.get("NAICS Description"),
    }


async def run(max_pages: int = 10) -> int:
    conn = await get_conn()
    total = 0
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            for page in range(1, max_pages + 1):
                payload = {**PAYLOAD_TEMPLATE, "page": page}
                resp = await client.post(API_URL, json=payload)
                resp.raise_for_status()
                data = resp.json()

                results = data.get("results", [])
                if not results:
                    print(f"[USASpending] Page {page}: no results, stopping.")
                    break

                for raw in results:
                    rec = normalize(raw)
                    await upsert_raw(conn, "usaspending", rec["award_id"], rec)
                    total += 1

                print(f"[USASpending] Page {page}: {len(results)} records (running total: {total})")

                has_next = data.get("page_metadata", {}).get("hasNext", False)
                if not has_next:
                    print("[USASpending] No more pages.")
                    break
    finally:
        await conn.close()

    print(f"[USASpending] Done. Inserted {total} records.")
    return total


if __name__ == "__main__":
    pages = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    asyncio.run(run(max_pages=pages))
