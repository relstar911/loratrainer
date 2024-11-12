import { api } from '@/lib/axios'

export interface Project {
  id: number
  name: string
  description: string | null
  owner_id: number
  created_at: string
  updated_at: string | null
}

export interface CreateProjectDto {
  name: string
  description?: string
}

export interface UpdateProjectDto {
  name?: string
  description?: string
}

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects')
    return response.data
  },

  getProject: async (id: number): Promise<Project> => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  createProject: async (data: CreateProjectDto): Promise<Project> => {
    const response = await api.post('/projects', data)
    return response.data
  },

  updateProject: async (id: number, data: UpdateProjectDto): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, data)
    return response.data
  },

  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`)
  },
} 