import boto3
from botocore.exceptions import ClientError
from PIL import Image
import io
from uuid import uuid4
from app.core.config import get_settings

settings = get_settings()

class S3StorageService:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket_name = settings.S3_BUCKET_NAME

    async def upload_image(self, image: Image.Image, project_id: int) -> str:
        """Upload a PIL Image to S3 and return the URL"""
        # Convert PIL Image to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()

        # Generate unique filename
        filename = f"projects/{project_id}/images/{uuid4()}.png"

        try:
            # Upload to S3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=filename,
                Body=img_byte_arr,
                ContentType='image/png'
            )

            # Generate URL
            url = f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{filename}"
            return url

        except ClientError as e:
            print(f"Error uploading to S3: {e}")
            raise HTTPException(status_code=500, detail="Error uploading image") 