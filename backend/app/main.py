"""
Application entry point.

This file's ONLY job is to:
  1. Create the FastAPI app instance
  2. Attach middleware (CORS)
  3. Register routers (route groups from api/)

It should NEVER contain business logic. If you find yourself writing
an `if` statement that does real work here, it belongs in services/ instead.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.api import health, translate

app = FastAPI(
    title="Language Translation Tool API",
    description="Backend API for translating text between languages.",
    version="1.0.0",
)

# CORS: by default, browsers block requests from one origin (localhost:5173,
# our React dev server) to another (localhost:8000, our FastAPI server).
# This middleware tells the browser "these specific origins are allowed
# to call this API." Without it, every request from React would fail
# silently with a CORS error in the browser console.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers group related endpoints together. Registering health.router here
# keeps main.py clean regardless of how many endpoints health.py ends up with.
app.include_router(health.router)
app.include_router(translate.router)