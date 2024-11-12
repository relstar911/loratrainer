from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict
from app.api.deps import get_current_active_user
from app.db.base import get_db
from app.models.user import User
from app.models.project import Project
from app.schemas.image import ImageGenerationCreate, GeneratedImage
from app.tasks.generation import generate_image as generate_image_task

router = APIRouter()

@router.post("/", response_model=Dict)
async def generate_image(
    *,
    db: Session = Depends(get_db),
    image_in: ImageGenerationCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Start image generation task"""
    # Verify project belongs to user
    project = db.query(Project).filter(
        Project.id == image_in.project_id,
        Project.owner_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Start celery task
    task = generate_image_task.delay(
        project_id=image_in.project_id,
        prompt=image_in.prompt,
        negative_prompt=image_in.negative_prompt,
        parameters=image_in.parameters
    )

    return {
        "task_id": task.id,
        "status": "processing"
    }

@router.get("/task/{task_id}", response_model=Dict)
async def get_task_status(task_id: str):
    """Get the status of a generation task"""
    task = generate_image_task.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {
            'status': task.state,
            'current': 0,
            'total': 1,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        response = {
            'status': task.state,
            'current': 1,
            'total': 1,
            'result': task.result
        }
    else:
        response = {
            'status': task.state,
            'current': 1,
            'total': 1,
            'status': str(task.info),
        }
    return response