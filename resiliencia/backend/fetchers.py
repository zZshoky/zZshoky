"""Async data fetchers: IEPR, Census ACS5, NREL (solar/wind/wave)."""
import os, httpx, polars as pl
from typing import Any
from cache import get as c_get, set as c_set

CENSUS_KEY = os.getenv("CENSUS_API_KEY", "")
NREL_KEY   = os.getenv("NREL_API_KEY", "DEMO_KEY")  # replace for prod

_http = httpx.AsyncClient(timeout=30, follow_redirects=True)

# ── IEPR ─────────────────────────────────────────────────────────────────────

async def fetch_iepr_indicators(topic: str = "economia") -> list[dict]:
    """Fetch IEPR economic/social indicators. topic: economia|demografia|energia."""
    ck = f"iepr:{topic}"
    if cached := await c_get(ck):
        return cached
    r = await _http.get(
        f"http://api.estadisticas.gobierno.pr/api/{topic}",
        params={"format": "json", "lang": "es"},
    )
    r.raise_for_status()
    data = r.json()
    # Normalize varying IEPR response shapes
    rows = data if isinstance(data, list) else data.get("data", data.get("results", []))
    await c_set(ck, rows, ttl=7200)
    return rows


# ── Census ACS5 ───────────────────────────────────────────────────────────────

_ACS_BASE = "https://api.census.gov/data/2022/acs/acs5"

_ACS_VARS = {
    "B01003_001E": "population",
    "B17001_002E": "poverty_count",
    "B19013_001E": "median_income",
    "B25077_001E": "median_home_value",
    "B23025_005E": "unemployed",
    "B23025_002E": "labor_force",
}

async def fetch_census_municipios() -> list[dict]:
    """ACS5 socioeconomic data for all PR municipios (county-level FIPS)."""
    ck = "census:municipios:acs5"
    if cached := await c_get(ck):
        return cached
    get_vars = "NAME," + ",".join(_ACS_VARS.keys())
    params = {
        "get": get_vars,
        "for": "county:*",
        "in": "state:72",
    }
    if CENSUS_KEY:
        params["key"] = CENSUS_KEY
    r = await _http.get(_ACS_BASE, params=params)
    r.raise_for_status()
    raw = r.json()
    headers, *rows = raw
    out = []
    for row in rows:
        rec = dict(zip(headers, row))
        pop  = int(rec["B01003_001E"] or 0)
        pov  = int(rec["B17001_002E"] or 0)
        lf   = int(rec["B23025_002E"] or 1)
        unemp= int(rec["B23025_005E"] or 0)
        out.append({
            "geoid":        f"72{rec['county']}",
            "name":         rec["NAME"].split(",")[0],
            "population":   pop,
            "poverty_pct":  round(pov / pop * 100, 2) if pop else 0,
            "median_income":int(rec["B19013_001E"] or 0),
            "home_value":   int(rec["B25077_001E"] or 0),
            "unemp_rate":   round(unemp / lf * 100, 2) if lf else 0,
            "state":        rec["state"],
            "county":       rec["county"],
        })
    await c_set(ck, out, ttl=86400)  # 24h — census data stable
    return out


async def fetch_census_tract(county_fips: str) -> list[dict]:
    """Census tract data for a specific municipio."""
    ck = f"census:tract:{county_fips}"
    if cached := await c_get(ck):
        return cached
    params = {
        "get": "NAME,B01003_001E,B17001_002E,B19013_001E",
        "for": "tract:*",
        "in": f"state:72 county:{county_fips}",
    }
    if CENSUS_KEY:
        params["key"] = CENSUS_KEY
    r = await _http.get(_ACS_BASE, params=params)
    r.raise_for_status()
    raw = r.json()
    headers, *rows = raw
    out = [dict(zip(headers, row)) for row in rows]
    await c_set(ck, out, ttl=86400)
    return out


# ── NREL Solar Resource ───────────────────────────────────────────────────────

async def fetch_nrel_solar(lat: float, lon: float) -> dict:
    """Annual solar resource (GHI) at a point via NREL Solar Resource Data."""
    ck = f"nrel:solar:{lat:.3f}:{lon:.3f}"
    if cached := await c_get(ck):
        return cached
    r = await _http.get(
        "https://developer.nrel.gov/api/solar/solar_resource/v1.json",
        params={"api_key": NREL_KEY, "lat": lat, "lon": lon},
    )
    r.raise_for_status()
    data = r.json()
    avg = data["outputs"]["avg_dni"]["annual"]
    ghi = data["outputs"]["avg_ghi"]["annual"]
    result = {"lat": lat, "lon": lon, "avg_dni": avg, "avg_ghi": ghi}
    await c_set(ck, result, ttl=86400 * 30)
    return result


# ── NREL Wind Resource ────────────────────────────────────────────────────────

async def fetch_nrel_wind(lat: float, lon: float, height: int = 100) -> dict:
    """Wind speed at hub height via NREL Wind Resource API."""
    ck = f"nrel:wind:{lat:.3f}:{lon:.3f}:{height}"
    if cached := await c_get(ck):
        return cached
    r = await _http.get(
        "https://developer.nrel.gov/api/wind/wind_toolkit/v2/wind/wtk-download.json",
        params={
            "api_key":    NREL_KEY,
            "wkt":        f"POINT({lon} {lat})",
            "attributes": f"windspeed_{height}m",
            "names":      "2014",
            "utc":        "false",
            "leap_day":   "false",
            "interval":   "60",
            "full_name":  "Resiliencia Boricua",
            "email":      os.getenv("NREL_EMAIL", "admin@resilienciaboricua.pr"),
            "affiliation":"ResilienciaBoricua",
            "reason":     "research",
        },
    )
    r.raise_for_status()
    data = r.json()
    # Wind Toolkit returns download URL; extract mean from outputs if available
    result = {"lat": lat, "lon": lon, "height_m": height, "raw": data}
    await c_set(ck, result, ttl=86400 * 30)
    return result


# ── NREL Wave Resource (MHK Atlas) ────────────────────────────────────────────

async def fetch_nrel_wave(lat: float, lon: float) -> dict:
    """
    Wave energy resource via NREL MHK Atlas.
    Returns annual mean wave power density (kW/m), significant wave height, period.
    <!-- STRATEGIC NOTE: MHK Atlas v1 uses grid nearest-point lookup for PR coords -->
    """
    ck = f"nrel:wave:{lat:.3f}:{lon:.3f}"
    if cached := await c_get(ck):
        return cached

    r = await _http.get(
        "https://developer.nrel.gov/api/wave/v2/hindcast/point-output.json",
        params={
            "api_key":    NREL_KEY,
            "lat":        lat,
            "lon":        lon,
            "names":      "2010",  # representative year
            "attributes": "omni-directional_wave_power,significant_wave_height,energy_period",
            "utc":        "true",
            "email":      os.getenv("NREL_EMAIL", "admin@resilienciaboricua.pr"),
        },
    )
    r.raise_for_status()
    data = r.json()

    outputs = data.get("outputs", {})
    # Compute annual means via polars if time-series returned
    result: dict[str, Any] = {"lat": lat, "lon": lon}
    for key, alias in [
        ("omni-directional_wave_power", "wave_power_kw_m"),
        ("significant_wave_height",     "wave_height_m"),
        ("energy_period",               "wave_period_s"),
    ]:
        vals = outputs.get(key, [])
        if vals:
            s = pl.Series(vals).cast(pl.Float64)
            result[alias]      = round(float(s.mean()), 4)
            result[f"{alias}_max"] = round(float(s.max()), 4)
        else:
            result[alias] = None

    await c_set(ck, result, ttl=86400 * 30)
    return result


# ── Bulk PR coastal wave grid ─────────────────────────────────────────────────

# Representative offshore coords ringing PR coast (lat, lon)
PR_COASTAL_GRID = [
    (18.47, -66.12), (18.47, -65.60), (18.47, -65.20),  # north coast
    (18.47, -67.10), (18.47, -67.50),
    (17.97, -66.12), (17.97, -65.60), (17.97, -66.80),  # south coast
    (18.22, -67.18), (18.22, -65.60),                    # east/west tips
]

async def fetch_wave_grid() -> list[dict]:
    """Fetch wave data for all coastal grid points (cached per point)."""
    import asyncio
    tasks = [fetch_nrel_wave(lat, lon) for lat, lon in PR_COASTAL_GRID]
    return await asyncio.gather(*tasks, return_exceptions=False)
