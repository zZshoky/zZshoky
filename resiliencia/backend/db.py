"""DuckDB singleton + schema init for Resiliencia Boricua."""
import duckdb, os

DB_PATH = os.getenv("DUCKDB_PATH", "resiliencia.duckdb")
_conn: duckdb.DuckDBPyConnection | None = None


def get_conn() -> duckdb.DuckDBPyConnection:
    global _conn
    if _conn is None:
        _conn = duckdb.connect(DB_PATH)
        _init_schema(_conn)
    return _conn


def _init_schema(conn: duckdb.DuckDBPyConnection):
    conn.execute("""
        CREATE TABLE IF NOT EXISTS municipios (
            geoid       VARCHAR PRIMARY KEY,
            name        VARCHAR,
            population  INTEGER,
            poverty_pct DOUBLE,
            median_inc  DOUBLE,
            lat         DOUBLE,
            lon         DOUBLE,
            updated_at  TIMESTAMP DEFAULT current_timestamp
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS energy_sites (
            id          VARCHAR PRIMARY KEY,
            municipio   VARCHAR,
            site_type   VARCHAR,  -- 'solar'|'wind'|'wave'
            capacity_kw DOUBLE,
            ghi         DOUBLE,   -- solar: annual GHI kWh/m²/day
            wind_speed  DOUBLE,   -- m/s at 100m
            wave_power  DOUBLE,   -- kW/m
            lat         DOUBLE,
            lon         DOUBLE,
            fetched_at  TIMESTAMP DEFAULT current_timestamp
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS iepr_indicators (
            id          INTEGER PRIMARY KEY,
            indicator   VARCHAR,
            period      VARCHAR,
            value       DOUBLE,
            unit        VARCHAR,
            fetched_at  TIMESTAMP DEFAULT current_timestamp
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS nrel_wave (
            lat         DOUBLE,
            lon         DOUBLE,
            period_year INTEGER,
            wave_power  DOUBLE,  -- kW/m
            wave_height DOUBLE,  -- m
            wave_period DOUBLE,  -- s
            fetched_at  TIMESTAMP DEFAULT current_timestamp,
            PRIMARY KEY (lat, lon, period_year)
        )
    """)
