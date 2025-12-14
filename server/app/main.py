from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routes import user_routes, goal_routes, resource_routes, topic_routes

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Goal Tracker API",
    description="API for tracking goals, resources, and topics",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_routes.router, prefix="/api/users", tags=["Users"])
app.include_router(goal_routes.router, prefix="/api/goals", tags=["Goals"])
app.include_router(resource_routes.router, prefix="/api/resources", tags=["Resources"])
app.include_router(topic_routes.router, prefix="/api/topics", tags=["Topics"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Goal Tracker API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
