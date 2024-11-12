'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/services/api/projects'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { EditProjectDialog } from '@/components/Projects/EditProjectDialog'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', params.id],
    queryFn: () => projectsApi.getProject(parseInt(params.id as string)),
  })

  if (isLoading) {
    return <LoadingPage />
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/projects')}
        >
          Back to Projects
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          {project.description && (
            <p className="mt-2 text-muted-foreground">{project.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Created {formatDistanceToNow(new Date(project.created_at))} ago
          </p>
        </div>
        <Button onClick={() => setIsEditOpen(true)}>Edit Project</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => router.push(`/projects/${project.id}/generate`)}
            >
              Generate New Image
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/projects/${project.id}/history`)}
            >
              View Generation History
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Project Stats</h3>
          <div className="space-y-2 text-sm">
            <p>Total Generations: Coming soon</p>
            <p>Last Generation: Coming soon</p>
          </div>
        </Card>
      </div>

      <EditProjectDialog
        project={project}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  )
} 