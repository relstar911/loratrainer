from fastapi import APIRouter
from app.api.v1.endpoints import auth, projects, generation

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(generation.router, prefix="/generation", tags=["generation"]) 