import { api } from '@/lib/axios'

export interface GenerationParams {
  prompt: string
  negative_prompt?: string
  num_inference_steps: number
  guidance_scale: number
  width: number
  height: number
  project_id: number
}

export interface GenerationTask {
  task_id: string
  status: string
}

export interface TaskStatus {
  status: string
  current: number
  total: number
  result?: {
    image_url: string
    image_id: number
  }
}

export const generationApi = {
  generate: async (params: GenerationParams): Promise<GenerationTask> => {
    const response = await api.post('/generation', params)
    return response.data
  },

  getTaskStatus: async (taskId: string): Promise<TaskStatus> => {
    const response = await api.get(`/generation/task/${taskId}`)
    return response.data
  },
} 