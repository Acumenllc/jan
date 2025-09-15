import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'
import { useState, useEffect } from 'react'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize mobile app
    setIsInitialized(true)
  }, [])

  if (!isInitialized) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg className="animate-spin h-16 w-16 text-primary" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-muted-foreground">Loading Jan Mobile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      <Outlet />
      <Toaster position="top-center" />
      {process.env.NODE_ENV === 'development' && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </div>
  )
}