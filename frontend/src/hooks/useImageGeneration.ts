import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { generationApi, GenerationParams, TaskStatus } from '@/services/api/generation'

export function useImageGeneration() {
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)

  const generateMutation = useMutation({
    mutationFn: generationApi.generate,
    onSuccess: (data) => {
      setCurrentTaskId(data.task_id)
    },
  })

  const taskStatus = useQuery({
    queryKey: ['generationTask', currentTaskId],
    queryFn: () => generationApi.getTaskStatus(currentTaskId!),
    enabled: !!currentTaskId,
    refetchInterval: (data) => {
      if (data?.status === 'SUCCESS' || data?.status === 'FAILURE') {
        return false
      }
      return 1000 // Poll every second
    },
  })

  const generate = async (params: GenerationParams) => {
    await generateMutation.mutateAsync(params)
  }

  return {
    generate,
    isGenerating: generateMutation.isPending || taskStatus.isPending,
    currentTask: taskStatus.data,
    error: generateMutation.error || taskStatus.error,
  }
} 