import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface Model {
  id: string
  name: string
  downloads: number
  tags: string[]
}

interface HuggingFaceModelListProps {
  onSelectModel: (model: Model) => void
  onBack: () => void
}

export function HuggingFaceModelList({ onSelectModel, onBack }: HuggingFaceModelListProps) {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock popular models for demo purposes
  const mockModels: Model[] = [
    {
      id: 'microsoft/DialoGPT-medium',
      name: 'DialoGPT Medium',
      downloads: 2500000,
      tags: ['conversational', 'chat', 'pytorch']
    },
    {
      id: 'microsoft/DialoGPT-large',
      name: 'DialoGPT Large',
      downloads: 1800000,
      tags: ['conversational', 'chat', 'pytorch']
    },
    {
      id: 'facebook/blenderbot-400M-distill',
      name: 'BlenderBot 400M',
      downloads: 1200000,
      tags: ['conversational', 'facebook', 'pytorch']
    },
    {
      id: 'microsoft/DialoGPT-small',
      name: 'DialoGPT Small',
      downloads: 900000,
      tags: ['conversational', 'chat', 'pytorch']
    },
    {
      id: 'facebook/blenderbot-1B-distill',
      name: 'BlenderBot 1B',
      downloads: 800000,
      tags: ['conversational', 'facebook', 'pytorch']
    }
  ]

  useEffect(() => {
    // Simulate API call to HuggingFace
    const fetchModels = async () => {
      setLoading(true)
      try {
        // In a real implementation, you would fetch from HuggingFace API
        // const response = await fetch('https://huggingface.co/api/models?filter=conversational&sort=downloads&direction=-1&limit=10')
        // const data = await response.json()

        // For demo, use mock data with a delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        setModels(mockModels)
      } catch (err) {
        setError('Failed to load models')
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  const formatDownloads = (downloads: number) => {
    if (downloads >= 1000000) {
      return `${(downloads / 1000000).toFixed(1)}M`
    }
    if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}k`
    }
    return downloads.toString()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-6 px-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-foreground">HuggingFace Models</h2>
          <p className="text-muted-foreground">Loading available models...</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
                  <div className="h-6 bg-muted-foreground/20 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={onBack} variant="ghost">
          ← Back
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-6 px-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-foreground">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>

        <Button onClick={onBack} variant="ghost">
          ← Back
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6 px-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-foreground">HuggingFace Models</h2>
        <p className="text-muted-foreground">Select a model for your chat assistant</p>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-3 max-h-96 overflow-y-auto">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-card border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onSelectModel(model)}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">{model.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {formatDownloads(model.downloads)} downloads
                </span>
              </div>

              <p className="text-xs text-muted-foreground">{model.id}</p>

              <div className="flex flex-wrap gap-1">
                {model.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onBack} className="mx-auto" variant="ghost">
        ← Back
      </Button>
    </div>
  )
}