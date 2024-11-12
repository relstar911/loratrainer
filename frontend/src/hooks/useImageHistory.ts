import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { historyApi } from '@/services/api/history'
import { useToast } from '@/components/ui/use-toast'

export function useImageHistory(projectId: number) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['imageHistory', projectId],
    queryFn: () => historyApi.getProjectImages(projectId)
  })

  const deleteMutation = useMutation({
    mutationFn: historyApi.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageHistory', projectId] })
      toast({
        title: 'Image deleted',
        description: 'The image has been successfully deleted.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete the image.',
        variant: 'destructive',
      })
    }
  })

  const deleteImage = async (imageId: number) => {
    await deleteMutation.mutateAsync(imageId)
  }

  return {
    images: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    deleteImage,
    isDeletingImage: deleteMutation.isPending
  }
} 