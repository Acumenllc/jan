import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
}

export interface ApiConfig {
  baseUrl: string
  apiKey: string
  model: string
  provider: 'openai' | 'anthropic' | 'custom'
}

interface ChatState {
  messages: ChatMessage[]
  currentMessage: string
  isLoading: boolean
  apiConfig: ApiConfig
  
  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  updateMessage: (id: string, content: string) => void
  setCurrentMessage: (message: string) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
  setApiConfig: (config: Partial<ApiConfig>) => void
  sendMessage: (content: string) => Promise<void>
}

const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  provider: 'openai'
}

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    messages: [],
    currentMessage: '',
    isLoading: false,
    apiConfig: DEFAULT_API_CONFIG,
    
    addMessage: (message) => {
      const newMessage: ChatMessage = {
        ...message,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      }
      set((state) => ({
        messages: [...state.messages, newMessage]
      }))
    },
    
    updateMessage: (id, content) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, content, isStreaming: false } : msg
        )
      }))
    },
    
    setCurrentMessage: (message) => {
      set({ currentMessage: message })
    },
    
    setLoading: (loading) => {
      set({ isLoading: loading })
    },
    
    clearMessages: () => {
      set({ messages: [] })
    },
    
    setApiConfig: (config) => {
      set((state) => ({
        apiConfig: { ...state.apiConfig, ...config }
      }))
    },
    
    sendMessage: async (content: string) => {
      const { apiConfig, addMessage, setLoading } = get()
      
      if (!content.trim() || !apiConfig.apiKey) return
      
      // Add user message
      addMessage({ role: 'user', content: content.trim() })
      
      // Add placeholder assistant message
      addMessage({ 
        role: 'assistant', 
        content: '', 
        isStreaming: true 
      })
      
      setLoading(true)
      
      try {
        const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiConfig.apiKey}`,
          },
          body: JSON.stringify({
            model: apiConfig.model,
            messages: [
              ...get().messages
                .filter(msg => !msg.isStreaming)
                .map(msg => ({
                  role: msg.role,
                  content: msg.content
                })),
              { role: 'user', content: content.trim() }
            ],
            stream: true,
            max_tokens: 2000,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body')
        }

        let assistantContent = ''
        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue
                
                try {
                  const parsed = JSON.parse(data)
                  const delta = parsed.choices?.[0]?.delta?.content
                  if (delta) {
                    assistantContent += delta
                    set((state) => ({
                      messages: state.messages.map((msg, index) =>
                        index === state.messages.length - 1
                          ? { ...msg, content: assistantContent, isStreaming: true }
                          : msg
                      )
                    }))
                  }
                } catch (e) {
                  // Skip invalid JSON
                  continue
                }
              }
            }
          }
        } finally {
          reader.releaseLock()
        }

        // Mark message as complete
        set((state) => ({
          messages: state.messages.map((msg, index) =>
            index === state.messages.length - 1
              ? { ...msg, isStreaming: false }
              : msg
          )
        }))

      } catch (error) {
        console.error('Error sending message:', error)
        // Update the assistant message with error
        set((state) => ({
          messages: state.messages.map((msg, index) =>
            index === state.messages.length - 1
              ? { 
                  ...msg, 
                  content: 'Sorry, I encountered an error. Please check your API configuration and try again.',
                  isStreaming: false 
                }
              : msg
          )
        }))
      } finally {
        setLoading(false)
      }
    },
  }))
)