import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SplashScreenProps {
  onComplete?: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps = {}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onComplete) {
        setTimeout(onComplete, 300) // Wait for fade out animation
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary animate-pulse">
          Jan
        </h1>
        <div className="mt-4 w-12 h-1 bg-primary mx-auto rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}