from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.routers import auth, users, assets, categories, maintenance, reports
from app.models import user, asset, category, maintenance as maint_model, report
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title       = "AssetHub API",
    description = "Asset Management System API",
    version     = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:3000"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# Serve uploaded files
os.makedirs("media", exist_ok=True)
app.mount("/media", StaticFiles(directory="media"), name="media")

# Include all routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(assets.router)
app.include_router(categories.router)
app.include_router(maintenance.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {"message": "AssetHub API is running ✅"}