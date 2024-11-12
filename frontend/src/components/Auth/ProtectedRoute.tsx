'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login' && pathname !== '/register') {
      router.push('/login')
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return children
} 