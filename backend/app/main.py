from fastapi import FastAPI
from app.routes.search import router as search_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Social Profile Intelligence")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(search_router)

@app.get("/")
def root():
    return {"status": "ok"}
