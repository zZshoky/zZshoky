from sqlalchemy import Column, Integer, String, DateTime, func
from database import Base


class WaitlistEntry(Base):
    __tablename__ = "waitlist"

    id         = Column(Integer, primary_key=True)
    email      = Column(String(255), unique=True, nullable=False)
    name       = Column(String(255))
    org_type   = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ip_hash    = Column(String(64))
