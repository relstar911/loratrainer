import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GeneratedImageHistory } from '@/services/api/history'

interface ImageGalleryProps {
  images: GeneratedImageHistory[]
  onDelete?: (imageId: number) => Promise<void>
}

export function ImageGallery({ images, onDelete }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImageHistory | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden group relative">
            <div className="aspect-square relative">
              <Image
                src={image.image_url}
                alt={image.prompt}
                fill
                className="object-cover cursor-pointer transition-transform group-hover:scale-105"
                onClick={() => setSelectedImage(image)}
              />
            </div>
            {onDelete && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(image.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Details</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative aspect-square">
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.prompt}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Prompt</h3>
                <p>{selectedImage.prompt}</p>
                {selectedImage.negative_prompt && (
                  <>
                    <h3 className="font-semibold">Negative Prompt</h3>
                    <p>{selectedImage.negative_prompt}</p>
                  </>
                )}
                <h3 className="font-semibold">Parameters</h3>
                <ul className="list-disc list-inside">
                  <li>Steps: {selectedImage.parameters.num_inference_steps}</li>
                  <li>Guidance Scale: {selectedImage.parameters.guidance_scale}</li>
                  <li>Dimensions: {selectedImage.parameters.width}x{selectedImage.parameters.height}</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 