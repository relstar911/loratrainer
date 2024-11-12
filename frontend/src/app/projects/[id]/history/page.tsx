'use client'

import { useParams } from 'next/navigation'
import { useImageHistory } from '@/hooks/useImageHistory'
import { ImageGallery } from '@/components/ImageGeneration/ImageGallery'
import { Skeleton } from '@/components/ui/skeleton'

export default function HistoryPage() {
  const params = useParams()
  const projectId = parseInt(params.id as string)
  const { images, isLoading, error, deleteImage } = useImageHistory(projectId)

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500">
          Error loading images: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Generated Images</h1>
      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No images generated yet.</p>
        </div>
      ) : (
        <ImageGallery images={images} onDelete={deleteImage} />
      )}
    </div>
  )
} 