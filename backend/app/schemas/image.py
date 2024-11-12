from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel

class ImageGenerationBase(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = None
    parameters: Dict = {
        "num_inference_steps": 50,
        "guidance_scale": 7.5,
        "width": 512,
        "height": 512
    }

class ImageGenerationCreate(ImageGenerationBase):
    project_id: int

class GeneratedImage(ImageGenerationBase):
    id: int
    project_id: int
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True 