import { MainNav } from '@/components/Layout/MainNav'
import { Sidebar } from '@/components/Layout/Sidebar'
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <MainNav />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
} 