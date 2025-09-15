import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { SplashScreen } from '@/components/SplashScreen'
import { ChatScreen } from '@/components/ChatScreen'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('jan_onboarding_completed')

    const timer = setTimeout(() => {
      setShowSplash(false)
      if (!hasCompletedOnboarding) {
        setIsNavigating(true)
        navigate({ to: '/onboarding' })
      }
    }, 2300)

    return () => clearTimeout(timer)
  }, [navigate])

  if (showSplash) {
    return <SplashScreen />
  }

  if (isNavigating) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Setting up...</p>
        </div>
      </div>
    )
  }

  const hasCompletedOnboarding = localStorage.getItem('jan_onboarding_completed')

  if (!hasCompletedOnboarding) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Redirecting to onboarding...</p>
      </div>
    )
  }

  return <ChatScreen />
}