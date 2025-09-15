import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { OnboardingScreen } from '@/components/OnboardingScreen'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})

function OnboardingPage() {
  const navigate = useNavigate()

  const handleOnboardingComplete = () => {
    localStorage.setItem('jan_onboarding_completed', 'true')
    navigate({ to: '/' })
  }

  return <OnboardingScreen onComplete={handleOnboardingComplete} />
}