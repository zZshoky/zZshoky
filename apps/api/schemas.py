from pydantic import BaseModel, EmailStr
from typing import Literal, Optional

ORG_TYPE = Literal[
    "contractor", "law_firm", "journalist",
    "compliance", "federal", "municipal", "other"
]


class WaitlistCreate(BaseModel):
    email:    EmailStr
    org_type: ORG_TYPE
    name:     Optional[str] = None


class WaitlistResponse(BaseModel):
    id:       int
    position: int


class WaitlistStats(BaseModel):
    count: int
