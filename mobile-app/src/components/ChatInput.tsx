import React, { useState, useRef, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useChatStore } from '@/stores/chatStore'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  disabled?: boolean
}

export function ChatInput({ disabled = false }: ChatInputProps) {
  const { currentMessage, setCurrentMessage, sendMessage, isLoading } = useChatStore()
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async () => {
    if (!currentMessage.trim() || isLoading || disabled) return

    const messageToSend = currentMessage.trim()
    setCurrentMessage('')
    
    // Reset textarea height by triggering a re-render
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    
    await sendMessage(messageToSend)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-focus on mount (for desktop)
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      // Small delay to ensure proper rendering
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [disabled])

  const canSend = currentMessage.trim() && !isLoading && !disabled

  return (
    <div className="p-4">
      <div className={cn(
        "flex items-end gap-2 p-2 border rounded-2xl bg-background transition-colors",
        isFocused && "ring-2 ring-primary/20",
        disabled && "opacity-50"
      )}>
        <div className="flex-1 min-h-[40px] flex items-center">
          <TextareaAutosize
            ref={textareaRef}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={disabled ? "Configure API settings first..." : "Type your message..."}
            disabled={disabled || isLoading}
            maxRows={6}
            className={cn(
              "w-full bg-transparent border-none outline-none resize-none",
              "text-sm leading-relaxed",
              "placeholder:text-muted-foreground",
              "scrollbar-hide"
            )}
            style={{
              lineHeight: '1.5',
            }}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSend}
          size="icon"
          className={cn(
            "rounded-full transition-all duration-200",
            "touch-target",
            canSend 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "bg-muted text-muted-foreground"
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Input hints */}
      <div className="mt-2 px-2">
        <p className="text-xs text-muted-foreground">
          {disabled 
            ? "Set up your API configuration in settings to start chatting"
            : "Press Enter to send, Shift+Enter for new line"
          }
        </p>
      </div>
    </div>
  )
}