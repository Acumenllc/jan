import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useChatStore, ApiConfig } from '@/stores/chatStore'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ArrowLeft, Eye, EyeOff, Save, TestTube } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function SettingsScreen() {
  const { apiConfig, setApiConfig } = useChatStore()
  const [localConfig, setLocalConfig] = useState<ApiConfig>(apiConfig)
  const [showApiKey, setShowApiKey] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: keyof ApiConfig, value: string) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      setApiConfig(localConfig)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const testConnection = async () => {
    if (!localConfig.apiKey || !localConfig.baseUrl) {
      toast.error('Please fill in API key and base URL')
      return
    }

    setIsTestingConnection(true)
    try {
      const response = await fetch(`${localConfig.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${localConfig.apiKey}`,
        },
      })

      if (response.ok) {
        toast.success('Connection successful!')
      } else {
        toast.error(`Connection failed: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      toast.error('Connection failed: Network error')
    } finally {
      setIsTestingConnection(false)
    }
  }

  const presetConfigs = {
    openai: {
      provider: 'openai' as const,
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-3.5-turbo',
    },
    anthropic: {
      provider: 'anthropic' as const,
      baseUrl: 'https://api.anthropic.com',
      model: 'claude-3-haiku-20240307',
    },
    custom: {
      provider: 'custom' as const,
      baseUrl: '',
      model: '',
    },
  }

  const handlePresetChange = (preset: keyof typeof presetConfigs) => {
    const config = presetConfigs[preset]
    setLocalConfig(prev => ({
      ...prev,
      ...config,
    }))
  }

  const hasChanges = JSON.stringify(localConfig) !== JSON.stringify(apiConfig)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-xs text-muted-foreground">API Configuration</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={testConnection}
            disabled={isTestingConnection || !localConfig.apiKey || !localConfig.baseUrl}
            variant="outline"
            size="sm"
          >
            {isTestingConnection ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <TestTube className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            size="sm"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Provider Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Provider</Label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(presetConfigs).map(([key, preset]) => (
              <Button
                key={key}
                variant={localConfig.provider === preset.provider ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetChange(key as keyof typeof presetConfigs)}
                className="capitalize"
              >
                {key}
              </Button>
            ))}
          </div>
        </div>

        {/* Base URL */}
        <div className="space-y-2">
          <Label htmlFor="baseUrl" className="text-sm font-medium">
            Base URL
          </Label>
          <Input
            id="baseUrl"
            type="url"
            placeholder="https://api.openai.com/v1"
            value={localConfig.baseUrl}
            onChange={(e) => handleInputChange('baseUrl', e.target.value)}
            className="h-12"
          />
          <p className="text-xs text-muted-foreground">
            API endpoint URL for your chosen provider
          </p>
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-sm font-medium">
            API Key
          </Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? "text" : "password"}
              placeholder="sk-..."
              value={localConfig.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              className="h-12 pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your API key will be stored locally on your device
          </p>
        </div>

        {/* Model */}
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">
            Model
          </Label>
          <Input
            id="model"
            placeholder="gpt-3.5-turbo"
            value={localConfig.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            className="h-12"
          />
          <p className="text-xs text-muted-foreground">
            Model name to use for chat completions
          </p>
        </div>

        {/* Connection Status */}
        <div className="p-4 border rounded-lg bg-muted/20">
          <h3 className="text-sm font-medium mb-2">Connection Status</h3>
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              localConfig.apiKey && localConfig.baseUrl
                ? "bg-green-500"
                : "bg-gray-400"
            )} />
            <span className="text-sm text-muted-foreground">
              {localConfig.apiKey && localConfig.baseUrl
                ? "Ready to connect"
                : "Configuration required"
              }
            </span>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="p-4 border rounded-lg bg-muted/20">
          <h3 className="text-sm font-medium mb-2">Quick Setup Guide</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>1. Choose your AI provider (OpenAI, Anthropic, or Custom)</p>
            <p>2. Enter your API key from the provider's dashboard</p>
            <p>3. Select or enter the model name you want to use</p>
            <p>4. Test the connection and save your settings</p>
          </div>
        </div>

        {/* Popular Models Reference */}
        <div className="p-4 border rounded-lg bg-muted/20">
          <h3 className="text-sm font-medium mb-2">Popular Models</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>OpenAI:</strong> gpt-4, gpt-3.5-turbo, gpt-4-turbo</p>
            <p><strong>Anthropic:</strong> claude-3-haiku-20240307, claude-3-sonnet-20240229</p>
            <p><strong>Custom:</strong> Depends on your provider</p>
          </div>
        </div>
      </div>
    </div>
  )
}