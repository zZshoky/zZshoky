"""Resiliencia Boricua — FastAPI backend."""
import os, asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import polars as pl

from db import get_conn
from fetchers import (
    fetch_iepr_indicators,
    fetch_census_municipios,
    fetch_census_tract,
    fetch_nrel_solar,
    fetch_nrel_wave,
    fetch_wave_grid,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm DB schema on startup
    get_conn()
    yield


app = FastAPI(title="Resiliencia Boricua API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_methods=["GET"],
    allow_headers=["*"],
)


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok"}


# ── IEPR ──────────────────────────────────────────────────────────────────────

@app.get("/api/iepr/{topic}")
async def iepr(topic: str):
    """
    Get IEPR indicators.
    topic: economia | demografia | energia | vivienda | salud
    """
    valid = {"economia", "demografia", "energia", "vivienda", "salud"}
    if topic not in valid:
        raise HTTPException(400, f"topic must be one of {valid}")
    try:
        data = await fetch_iepr_indicators(topic)
        return {"topic": topic, "count": len(data), "data": data}
    except Exception as e:
        raise HTTPException(502, f"IEPR fetch failed: {e}")


# ── Census ────────────────────────────────────────────────────────────────────

@app.get("/api/municipios")
async def municipios():
    """All PR municipios with ACS5 socioeconomic stats."""
    try:
        data = await fetch_census_municipios()
        # Persist to DuckDB (upsert via delete+insert)
        conn = get_conn()
        if data:
            df = pl.DataFrame(data)
            conn.register("_muni_tmp", df)
            conn.execute("""
                DELETE FROM municipios WHERE geoid IN (SELECT geoid FROM _muni_tmp)
            """)
            conn.execute("""
                INSERT INTO municipios (geoid, name, population, poverty_pct, median_inc)
                SELECT geoid, name, population, poverty_pct, median_income FROM _muni_tmp
            """)
        return {"count": len(data), "municipios": data}
    except Exception as e:
        raise HTTPException(502, f"Census fetch failed: {e}")


@app.get("/api/municipios/{county_fips}/tracts")
async def tracts(county_fips: str):
    """Census tract breakdown for a municipio (2-digit county FIPS, e.g. '001')."""
    try:
        data = await fetch_census_tract(county_fips)
        return {"county": county_fips, "count": len(data), "tracts": data}
    except Exception as e:
        raise HTTPException(502, f"Census tract fetch failed: {e}")


# ── NREL Solar ────────────────────────────────────────────────────────────────

@app.get("/api/solar")
async def solar(
    lat: float = Query(..., ge=17.5, le=18.6),
    lon: float = Query(..., ge=-67.9, le=-65.2),
):
    """Solar resource at a point within PR bounds."""
    try:
        return await fetch_nrel_solar(lat, lon)
    except Exception as e:
        raise HTTPException(502, f"NREL solar fetch failed: {e}")


# ── NREL Wave ─────────────────────────────────────────────────────────────────

@app.get("/api/wave")
async def wave(
    lat: float = Query(..., ge=17.0, le=19.5),
    lon: float = Query(..., ge=-68.5, le=-64.5),
):
    """Wave energy resource at a coastal point."""
    try:
        return await fetch_nrel_wave(lat, lon)
    except Exception as e:
        raise HTTPException(502, f"NREL wave fetch failed: {e}")


@app.get("/api/wave/grid")
async def wave_grid():
    """Pre-defined coastal wave grid around PR — ideal for map overlays."""
    try:
        data = await fetch_wave_grid()
        # Cache to DuckDB
        conn = get_conn()
        valid = [d for d in data if isinstance(d, dict) and d.get("wave_power_kw_m")]
        if valid:
            df = pl.DataFrame(valid)
            conn.register("_wave_tmp", df)
            conn.execute("""
                INSERT OR REPLACE INTO nrel_wave (lat, lon, period_year, wave_power, wave_height, wave_period)
                SELECT lat, lon, 2010, wave_power_kw_m, wave_height_m, wave_period_s FROM _wave_tmp
            """)
        return {"count": len(data), "grid": data}
    except Exception as e:
        raise HTTPException(502, f"Wave grid fetch failed: {e}")


# ── Analytics: Opportunity Score ──────────────────────────────────────────────

@app.get("/api/opportunity-score")
async def opportunity_score():
    """
    Composite resilience-opportunity score per municipio.
    Score = normalized(solar_ghi * 0.3 + (100-poverty_pct) * 0.4 + (100-unemp_rate) * 0.3)
    Pulls from DuckDB cache; triggers fresh Census fetch if empty.
    """
    conn = get_conn()
    rows = conn.execute("""
        SELECT geoid, name, population, poverty_pct, median_inc
        FROM municipios
        ORDER BY population DESC
    """).fetchall()

    if not rows:
        # Cold start — hydrate
        await fetch_census_municipios()
        rows = conn.execute("SELECT geoid, name, population, poverty_pct, median_inc FROM municipios").fetchall()

    result = []
    for geoid, name, pop, pov, inc in rows:
        pov  = pov  or 0.0
        inc  = inc  or 0.0
        # Normalize income 0–100 (PR range ~$10k–$35k)
        inc_norm = min(max((inc - 10000) / 25000 * 100, 0), 100)
        score = round((100 - pov) * 0.5 + inc_norm * 0.5, 2)
        result.append({
            "geoid":      geoid,
            "name":       name,
            "population": pop,
            "poverty_pct":pov,
            "median_inc": inc,
            "score":      score,
        })

    result.sort(key=lambda x: x["score"], reverse=True)
    return {"municipios": result}


# ── DuckDB query endpoint (read-only analytics) ───────────────────────────────

@app.get("/api/query")
async def query(
    sql: str = Query(..., max_length=500),
):
    """
    Run a read-only DuckDB query against cached data.
    Only SELECT statements allowed.
    """
    if not sql.strip().upper().startswith("SELECT"):
        raise HTTPException(400, "Only SELECT queries allowed")
    try:
        conn  = get_conn()
        rows  = conn.execute(sql).fetchdf().to_dict(orient="records")
        return {"rows": rows, "count": len(rows)}
    except Exception as e:
        raise HTTPException(400, f"Query error: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
