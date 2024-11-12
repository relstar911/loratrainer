'use client'

import { useParams } from 'next/navigation'
import { GenerationForm } from '@/components/ImageGeneration/GenerationForm'
import { useImageGeneration } from '@/hooks/useImageGeneration'
import { Card } from '@/components/ui/card'

export default function GeneratePage() {
  const params = useParams()
  const projectId = parseInt(params.id as string)
  const { generate, isGenerating, currentTask, error } = useImageGeneration()

  const handleGenerate = async (formData: any) => {
    await generate({
      ...formData,
      project_id: projectId,
    })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Generate Image</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <GenerationForm
            projectId={projectId}
            onSubmit={handleGenerate}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          {currentTask?.result?.image_url && (
            <img
              src={currentTask.result.image_url}
              alt="Generated image"
              className="w-full rounded-lg"
            />
          )}
          {isGenerating && (
            <div className="flex items-center justify-center h-64">
              <p>Generating image...</p>
            </div>
          )}
          {error && (
            <div className="text-red-500">
              Error: {error.message}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 