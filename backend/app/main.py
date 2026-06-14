from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import engine, SessionLocal
from app.models import Base
from app.seed import seed_data

from app.routes import menu
from app.routes import orders
from app.routes import admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Food Truck API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Food Truck API Running"}