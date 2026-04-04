from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers.waitlist import router as waitlist_router

app = FastAPI(
    title="Corpora PR API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(waitlist_router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "corpora-pr-api"}
