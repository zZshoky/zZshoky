"""
ASG Scraper (A2) — asg.pr.gov
Scrapes the Administration Services General contracts portal.

The scraper tries CSV export first (Content-Type detection), then falls
back to HTML table parsing. If neither yields records, the ASG portal
may have restructured — inspect the live URL and update ASG_URL below.

Usage:
    python asg_scraper.py
    DATABASE_URL=postgresql://... python asg_scraper.py
"""
import asyncio
import csv
import io
import sys
import httpx
from bs4 import BeautifulSoup
from base import get_conn, upsert_raw

# Primary URL to inspect — may need adjustment after live site review
ASG_URL = "https://www.asg.pr.gov/Paginas/Contratos.aspx"

# Fallback: some agencies expose direct CSV downloads
ASG_CSV_FALLBACK = "https://www.asg.pr.gov/Documents/Contratos.csv"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; CorporaPR-scraper/0.1; +https://corpora.pr)"
    ),
    "Accept": "text/html,application/xhtml+xml,text/csv,application/csv,*/*",
    "Accept-Language": "es-PR,es;q=0.9,en;q=0.8",
}


def _normalize_key(raw: str) -> str:
    return (
        raw.lower()
        .strip()
        .replace(" ", "_")
        .replace("ú", "u").replace("ó", "o")
        .replace("á", "a").replace("é", "e").replace("í", "i")
        .replace("ñ", "n")
    )


def parse_csv(text: str) -> list[dict]:
    reader = csv.DictReader(io.StringIO(text))
    return [
        {_normalize_key(k): v for k, v in row.items()}
        for row in reader
        if any(v.strip() for v in row.values())
    ]


def parse_html_table(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "lxml")
    table = soup.find("table")
    if not table:
        return []

    header_row = table.find("tr")
    if not header_row:
        return []

    col_names = [
        _normalize_key(th.get_text(strip=True))
        for th in header_row.find_all(["th", "td"])
    ]

    records = []
    for row in table.find_all("tr")[1:]:
        cols = [td.get_text(strip=True) for td in row.find_all("td")]
        if len(cols) == len(col_names) and any(c.strip() for c in cols):
            records.append(dict(zip(col_names, cols)))
    return records


def extract_id(record: dict) -> str | None:
    for key in ("numero_contrato", "contract_number", "num_contrato", "id", "numero"):
        if record.get(key):
            return str(record[key])
    return None


async def fetch_and_parse(client: httpx.AsyncClient, url: str) -> list[dict]:
    resp = await client.get(url, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    content_type = resp.headers.get("content-type", "").lower()

    if "csv" in content_type or url.endswith(".csv"):
        return parse_csv(resp.text)
    else:
        return parse_html_table(resp.text)


async def run() -> int:
    conn = await get_conn()
    total = 0
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            records: list[dict] = []

            # Try primary URL
            try:
                records = await fetch_and_parse(client, ASG_URL)
                print(f"[ASG] Primary URL: {len(records)} records parsed.")
            except Exception as e:
                print(f"[ASG] Primary URL failed ({e}), trying CSV fallback.")

            # Try CSV fallback if primary returned nothing
            if not records:
                try:
                    records = await fetch_and_parse(client, ASG_CSV_FALLBACK)
                    print(f"[ASG] CSV fallback: {len(records)} records parsed.")
                except Exception as e:
                    print(f"[ASG] CSV fallback also failed ({e}). "
                          "Verify ASG_URL against the live site.")

            for rec in records:
                ext_id = extract_id(rec)
                await upsert_raw(conn, "asg", ext_id, rec)
                total += 1
    finally:
        await conn.close()

    print(f"[ASG] Done. Inserted {total} records.")
    return total


if __name__ == "__main__":
    asyncio.run(run())
