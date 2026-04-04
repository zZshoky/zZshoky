"""
OCPR Scraper (A1) — subastas.ocpr.gov.pr
Scrapes Puerto Rico's Office of Contract and Procurement Reform portal.

IMPORTANT — before running in production:
  1. Load https://subastas.ocpr.gov.pr in a browser
  2. Inspect the procurement table's CSS classes and column order
  3. Update TABLE_SELECTOR and parse_row() column indices below
  4. If the site uses ASP.NET __VIEWSTATE pagination (POST-based), see
     the _get_viewstate() helper and switch scrape_page() to POST mode.

Usage:
    python ocpr_scraper.py
    DATABASE_URL=postgresql://... python ocpr_scraper.py
"""
import asyncio
import re
import sys
import httpx
from bs4 import BeautifulSoup, Tag
from base import get_conn, upsert_raw

BASE_URL   = "https://subastas.ocpr.gov.pr"
LIST_PATH  = "/Subastas/ListadoSubastas.aspx"

# Update this selector after inspecting the live site
TABLE_SELECTOR = re.compile(r"grid|table|grdSolicitudes", re.I)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; CorporaPR-scraper/0.1; +https://corpora.pr)"
    ),
    "Accept-Language": "es-PR,es;q=0.9,en;q=0.8",
}


def _link_url(cell: Tag) -> str:
    a = cell.find("a")
    if a and a.get("href"):
        href = str(a["href"])
        return href if href.startswith("http") else BASE_URL + "/" + href.lstrip("/")
    return ""


def parse_row(cols: list[Tag]) -> dict | None:
    """
    Parse a table <tr> into a structured record.
    Column order is inferred from common OCPR table patterns —
    verify against the live site and adjust indices if needed.
    """
    texts = [c.get_text(strip=True) for c in cols]
    if len(texts) < 4:
        return None
    return {
        "contract_number": texts[0] if len(texts) > 0 else None,
        "title":           texts[1] if len(texts) > 1 else None,
        "agency":          texts[2] if len(texts) > 2 else None,
        "status":          texts[3] if len(texts) > 3 else None,
        "date":            texts[4] if len(texts) > 4 else None,
        "amount":          texts[5] if len(texts) > 5 else None,
        "detail_url":      _link_url(cols[1]) if len(cols) > 1 else None,
    }


async def _get_viewstate(client: httpx.AsyncClient) -> dict[str, str]:
    """
    Fetch the initial page and extract ASP.NET hidden form fields.
    Required if the site uses POST-based pagination.
    """
    resp = await client.get(BASE_URL + LIST_PATH, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml")
    fields = {}
    for name in ["__VIEWSTATE", "__VIEWSTATEGENERATOR", "__EVENTVALIDATION"]:
        tag = soup.find("input", {"name": name})
        if tag and tag.get("value"):
            fields[name] = str(tag["value"])
    return fields


async def scrape_page(
    client: httpx.AsyncClient,
    page: int,
    viewstate: dict[str, str] | None = None,
) -> list[dict]:
    """
    Fetch one page of results.
    Tries GET first; falls back to POST with __VIEWSTATE if needed.
    """
    if viewstate:
        # POST-based (ASP.NET WebForms) pagination
        form_data = {
            **viewstate,
            "__EVENTTARGET":   "GridView1",
            "__EVENTARGUMENT": f"Page${page}",
        }
        resp = await client.post(
            BASE_URL + LIST_PATH,
            data=form_data,
            headers={**HEADERS, "Content-Type": "application/x-www-form-urlencoded"},
            timeout=30,
        )
    else:
        resp = await client.get(
            BASE_URL + LIST_PATH,
            params={"page": page},
            headers=HEADERS,
            timeout=30,
        )

    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml")
    table = soup.find("table", {"id": TABLE_SELECTOR}) or soup.find(
        "table", class_=TABLE_SELECTOR
    )
    if not table:
        return []

    rows = table.find_all("tr")[1:]  # skip header row
    records = []
    for row in rows:
        cols = row.find_all("td")
        rec = parse_row(cols)
        if rec:
            records.append(rec)
    return records


async def run(max_pages: int = 5) -> int:
    conn = await get_conn()
    total = 0
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            # Try GET pagination first
            viewstate: dict[str, str] | None = None
            records = await scrape_page(client, 1)

            if not records:
                # Site may require POST-based pagination — fetch viewstate
                print("[OCPR] GET returned no records; trying POST/viewstate mode.")
                viewstate = await _get_viewstate(client)
                records = await scrape_page(client, 1, viewstate)

            if not records:
                print("[OCPR] No records found. Verify TABLE_SELECTOR against live site.")
                return 0

            for rec in records:
                await upsert_raw(conn, "ocpr", rec.get("contract_number"), rec)
                total += 1
            print(f"[OCPR] Page 1: {len(records)} records (running total: {total})")

            for page in range(2, max_pages + 1):
                records = await scrape_page(client, page, viewstate)
                if not records:
                    print(f"[OCPR] Page {page}: no records, stopping.")
                    break
                for rec in records:
                    await upsert_raw(conn, "ocpr", rec.get("contract_number"), rec)
                    total += 1
                print(f"[OCPR] Page {page}: {len(records)} records (running total: {total})")
    finally:
        await conn.close()

    print(f"[OCPR] Done. Inserted {total} records.")
    return total


if __name__ == "__main__":
    pages = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    asyncio.run(run(max_pages=pages))
