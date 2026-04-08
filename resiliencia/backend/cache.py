"""Redis cache wrapper with graceful fallback to in-memory dict."""
import os, json, time
from typing import Any

try:
    import redis.asyncio as aioredis
    _redis = aioredis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"), decode_responses=True)
    USE_REDIS = True
except Exception:
    USE_REDIS = False

_mem: dict[str, tuple[float, Any]] = {}  # fallback: {key: (expires_ts, val)}
DEFAULT_TTL = int(os.getenv("CACHE_TTL", "3600"))  # 1h


async def get(key: str) -> Any | None:
    if USE_REDIS:
        try:
            raw = await _redis.get(key)
            return json.loads(raw) if raw else None
        except Exception:
            pass
    entry = _mem.get(key)
    if entry and entry[0] > time.time():
        return entry[1]
    return None


async def set(key: str, val: Any, ttl: int = DEFAULT_TTL):
    if USE_REDIS:
        try:
            await _redis.setex(key, ttl, json.dumps(val))
            return
        except Exception:
            pass
    _mem[key] = (time.time() + ttl, val)


async def invalidate(key: str):
    if USE_REDIS:
        try:
            await _redis.delete(key)
        except Exception:
            pass
    _mem.pop(key, None)
