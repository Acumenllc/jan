import { ChatMessage } from '@/stores/chatStore'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  messages: ChatMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isConsecutive={
            index > 0 && messages[index - 1].role === message.role
          }
        />
      ))}
    </div>
  )
}