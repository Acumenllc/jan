import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HuggingFaceModelList } from './HuggingFaceModelList'

interface OnboardingScreenProps {
  onComplete: () => void
}

type SetupOption = 'local' | 'cloud' | 'manual'

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState<'main' | 'local' | 'cloud' | 'manual'>('main')

  const handleSetupChoice = (option: SetupOption) => {
    if (option === 'manual') {
      setCurrentStep('manual')
    } else {
      setCurrentStep(option)
    }
  }

  const handleLocalChoice = () => {
    // Handle local setup completion
    onComplete()
  }

  const handleCloudChoice = () => {
    // Handle cloud setup completion
    onComplete()
  }

  const handleModelSelection = (model: any) => {
    // Store selected model and complete setup
    localStorage.setItem('jan_selected_model', JSON.stringify(model))
    onComplete()
  }

  const renderMainScreen = () => (
    <div className="flex flex-col items-center text-center space-y-8 px-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-primary">Jan</h1>
        <h2 className="text-xl font-semibold text-foreground">Mobile App</h2>
        <p className="text-muted-foreground text-lg">
          ChatGPT alternative in your local device
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Button
          onClick={() => handleSetupChoice('local')}
          className="w-full h-12 text-lg font-medium"
          variant="default"
        >
          Easy setup local (Jan model)
        </Button>

        <Button
          onClick={() => handleSetupChoice('cloud')}
          className="w-full h-12 text-lg font-medium"
          variant="outline"
        >
          Easy setup cloud (Cloud model)
        </Button>

        <Button
          onClick={() => handleSetupChoice('manual')}
          className="w-full h-12 text-lg font-medium"
          variant="outline"
        >
          Manual setup
        </Button>
      </div>
    </div>
  )

  const renderLocalScreen = () => (
    <div className="flex flex-col items-center text-center space-y-8 px-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Local Setup</h2>
        <p className="text-muted-foreground">
          Choose your preferred local model option
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Button
          onClick={() => handleLocalChoice()}
          className="w-full h-12 text-lg font-medium"
          variant="default"
        >
          Jan model
        </Button>

        <Button
          onClick={() => handleLocalChoice()}
          className="w-full h-12 text-lg font-medium"
          variant="outline"
        >
          Custom models
        </Button>
      </div>

      <Button
        onClick={() => setCurrentStep('main')}
        className="text-muted-foreground"
        variant="ghost"
      >
        ← Back
      </Button>
    </div>
  )

  const renderCloudScreen = () => (
    <div className="flex flex-col items-center text-center space-y-8 px-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Cloud Setup</h2>
        <p className="text-muted-foreground">
          Choose your preferred cloud AI provider
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Button
          onClick={() => handleCloudChoice()}
          className="w-full h-12 text-lg font-medium"
          variant="default"
        >
          ChatGPT
        </Button>

        <Button
          onClick={() => handleCloudChoice()}
          className="w-full h-12 text-lg font-medium"
          variant="outline"
        >
          Claude
        </Button>
      </div>

      <Button
        onClick={() => setCurrentStep('main')}
        className="text-muted-foreground"
        variant="ghost"
      >
        ← Back
      </Button>
    </div>
  )

  const renderManualScreen = () => (
    <HuggingFaceModelList
      onSelectModel={handleModelSelection}
      onBack={() => setCurrentStep('main')}
    />
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        {currentStep === 'main' && renderMainScreen()}
        {currentStep === 'local' && renderLocalScreen()}
        {currentStep === 'cloud' && renderCloudScreen()}
        {currentStep === 'manual' && renderManualScreen()}
      </div>
    </div>
  )
}