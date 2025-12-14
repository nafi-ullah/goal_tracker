"""
Vercel serverless function entry point for FastAPI
This file serves as the ASGI application entry point for Vercel
"""
import sys
import os

# Add the parent directory to the path so we can import app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from mangum import Mangum

# Create the handler for Vercel
handler = Mangum(app, lifespan="off")

# Also export app for ASGI servers
__all__ = ["app", "handler"]
