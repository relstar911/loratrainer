'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.full_name}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your AI generation projects
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Quick Generate</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start a new image generation project
          </p>
          <Button asChild>
            <Link href="/projects/new">Create Project</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Recent Projects</h3>
          <p className="text-sm text-muted-foreground">
            You have no recent projects
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Generated Images</h3>
          <p className="text-sm text-muted-foreground">
            View your generated images
          </p>
          <Button variant="outline" asChild className="mt-4">
            <Link href="/gallery">View Gallery</Link>
          </Button>
        </Card>
      </div>
    </div>
  )
} 