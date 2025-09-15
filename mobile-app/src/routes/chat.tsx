import { createFileRoute } from '@tanstack/react-router'
import { ChatScreen } from '@/components/ChatScreen'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  return <ChatScreen />
}