import { api } from '@/lib/axios'

export interface GeneratedImageHistory {
  id: number
  project_id: number
  prompt: string
  negative_prompt?: string
  parameters: {
    num_inference_steps: number
    guidance_scale: number
    width: number
    height: number
  }
  image_url: string
  created_at: string
}

export const historyApi = {
  getProjectImages: async (projectId: number, page: number = 1, limit: number = 20): Promise<{
    items: GeneratedImageHistory[]
    total: number
  }> => {
    const response = await api.get(`/generation/history/${projectId}`, {
      params: { page, limit }
    })
    return response.data
  },

  deleteImage: async (imageId: number): Promise<void> => {
    await api.delete(`/generation/history/${imageId}`)
  }
} 