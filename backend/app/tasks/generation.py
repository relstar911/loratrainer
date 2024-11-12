from app.core.celery_app import celery_app
from app.services.image_generation import ImageGenerationService
from app.services.storage import S3StorageService
from app.db.base import SessionLocal
from app.models.image import GeneratedImage

image_service = ImageGenerationService()
storage_service = S3StorageService()

@celery_app.task(name="app.tasks.generation.generate_image")
def generate_image(
    project_id: int,
    prompt: str,
    negative_prompt: str | None = None,
    parameters: dict = None
) -> dict:
    """Generate image as a background task"""
    try:
        # Generate the image
        image = image_service.generate_image(
            prompt=prompt,
            negative_prompt=negative_prompt,
            **(parameters or {})
        )

        # Upload to S3
        image_url = storage_service.upload_image(image, project_id)

        # Store in database
        db = SessionLocal()
        try:
            db_image = GeneratedImage(
                project_id=project_id,
                prompt=prompt,
                negative_prompt=negative_prompt,
                parameters=parameters or {},
                image_url=image_url
            )
            db.add(db_image)
            db.commit()
            db.refresh(db_image)
            
            return {
                "status": "success",
                "image_id": db_image.id,
                "image_url": image_url
            }
        finally:
            db.close()

    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        } 