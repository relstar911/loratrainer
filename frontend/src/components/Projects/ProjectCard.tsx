import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Project, projectsApi } from '@/services/api/projects'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Pencil, Trash } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast({
        title: 'Project deleted',
        description: 'The project has been successfully deleted.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete the project.',
        variant: 'destructive',
      })
    },
  })

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteMutation.mutateAsync(project.id)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Created {formatDistanceToNow(new Date(project.created_at))} ago
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-4 space-x-2">
        <Button
          variant="outline"
          onClick={() => router.push(`/projects/${project.id}/generate`)}
        >
          Generate Images
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(`/projects/${project.id}/history`)}
        >
          View History
        </Button>
      </div>
    </Card>
  )
} 