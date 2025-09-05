import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ChatMessage } from '@/stores/chatStore'
import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'

interface MessageBubbleProps {
  message: ChatMessage
  isConsecutive?: boolean
}

export function MessageBubble({ message, isConsecutive = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isStreaming = message.isStreaming

  return (
    <div className={cn(
      "flex gap-3",
      isUser ? "flex-row-reverse" : "flex-row",
      isConsecutive && "mt-2"
    )}>
      {/* Avatar */}
      {!isConsecutive && (
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
      )}

      {/* Spacer for consecutive messages */}
      {isConsecutive && <div className="w-8" />}

      {/* Message content */}
      <div className={cn(
        "flex-1 max-w-[80%]",
        isUser && "flex justify-end"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 break-words",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md",
          isConsecutive && (isUser ? "rounded-tr-md" : "rounded-tl-md")
        )}>
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="prose prose-sm max-w-none prose-invert">
              <ReactMarkdown
                components={{
                  code: ({ node, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !(props as any).inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md text-xs"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-muted-foreground/20 px-1 py-0.5 rounded text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  p: ({ children }) => (
                    <p className="text-sm leading-relaxed mb-2 last:mb-0">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="text-sm space-y-1 ml-4 list-decimal">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-muted-foreground pl-4 italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
              
              {/* Streaming indicator */}
              {isStreaming && (
                <div className="flex items-center mt-2">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse animation-delay-200" />
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse animation-delay-400" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {!isConsecutive && (
          <div className={cn(
            "text-xs text-muted-foreground mt-1 px-2",
            isUser ? "text-right" : "text-left"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </div>
  )
}