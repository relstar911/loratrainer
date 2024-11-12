'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/services/api/projects'
import { Button } from '@/components/ui/button'
import { LoadingPage } from '@/components/ui/loading'
import { ProjectCard } from '@/components/Projects/ProjectCard'
import { CreateProjectDialog } from '@/components/Projects/CreateProjectDialog'
import { Plus } from 'lucide-react'

export default function ProjectsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
  })

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your AI generation projects
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects yet.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsCreateOpen(true)}
          >
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  )
} 