import { useState, useEffect } from 'react'
import { SplashScreen } from './SplashScreen'
import { OnboardingScreen } from './OnboardingScreen'
import { ChatScreen } from './ChatScreen'

type AppState = 'splash' | 'onboarding' | 'chat'

export function App() {
  const [appState, setAppState] = useState<AppState>('splash')

  // Check if user has already completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('jan_onboarding_completed')
    if (hasCompletedOnboarding && appState === 'splash') {
      // Skip onboarding if already completed
      setTimeout(() => setAppState('chat'), 2300) // Wait for splash screen
    }
  }, [appState])

  const handleSplashComplete = () => {
    const hasCompletedOnboarding = localStorage.getItem('jan_onboarding_completed')
    if (hasCompletedOnboarding) {
      setAppState('chat')
    } else {
      setAppState('onboarding')
    }
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('jan_onboarding_completed', 'true')
    setAppState('chat')
  }

  return (
    <div className="h-full">
      {appState === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {appState === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {appState === 'chat' && (
        <ChatScreen />
      )}
    </div>
  )
}