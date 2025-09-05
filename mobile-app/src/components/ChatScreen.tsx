import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { Header } from './Header'
import { cn } from '@/lib/utils'

export function ChatScreen() {
  const { messages, apiConfig } = useChatStore()
  const [isAtBottom, setIsAtBottom] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const previousMessageCount = useRef(messages.length)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > previousMessageCount.current && isAtBottom) {
      scrollToBottom()
    }
    previousMessageCount.current = messages.length
  }, [messages, isAtBottom])

  // Auto-scroll during streaming
  useEffect(() => {
    const hasStreamingMessage = messages.some(msg => msg.isStreaming)
    if (hasStreamingMessage && isAtBottom) {
      scrollToBottom()
    }
  }, [messages, isAtBottom])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10
      setIsAtBottom(atBottom)
    }
  }

  const showConfigMessage = !apiConfig.apiKey

  return (
    <div className="flex flex-col h-full bg-background">
      <Header />
      
      <div className="flex-1 flex flex-col min-h-0">
        {/* Messages area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={cn(
            "flex-1 overflow-y-auto px-4 py-4 smooth-scroll",
            "scrollbar-hide"
          )}
        >
          {showConfigMessage ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Setup Required</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Configure your AI API settings to start chatting
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Start Chatting</h3>
                <p className="text-muted-foreground text-sm">
                  Send your first message to begin the conversation
                </p>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>

        {/* Input area */}
        <div className="border-t bg-background/95 backdrop-blur-sm">
          <ChatInput disabled={showConfigMessage} />
        </div>
      </div>
    </div>
  )
}