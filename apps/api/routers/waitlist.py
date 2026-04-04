import hashlib
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models import WaitlistEntry
from schemas import WaitlistCreate, WaitlistResponse, WaitlistStats
from config import settings

router = APIRouter(prefix="/api/waitlist", tags=["waitlist"])


def _hash_ip(ip: str) -> str:
    return hashlib.sha256(f"{settings.ip_hash_salt}{ip}".encode()).hexdigest()


@router.post("", response_model=WaitlistResponse, status_code=201)
async def join_waitlist(
    payload: WaitlistCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(
        select(WaitlistEntry).where(WaitlistEntry.email == payload.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    client_ip = request.client.host if request.client else "unknown"
    entry = WaitlistEntry(
        email    = payload.email,
        name     = payload.name,
        org_type = payload.org_type,
        ip_hash  = _hash_ip(client_ip),
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)

    count_result = await db.execute(select(func.count()).select_from(WaitlistEntry))
    position = count_result.scalar_one()

    return WaitlistResponse(id=entry.id, position=position)


@router.get("/stats", response_model=WaitlistStats)
async def get_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(WaitlistEntry))
    return WaitlistStats(count=result.scalar_one())
