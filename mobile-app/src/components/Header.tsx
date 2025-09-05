import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { useChatStore } from '@/stores/chatStore'
import { Settings, MessageCircle, Trash2 } from 'lucide-react'

export function Header() {
  const { clearMessages, messages } = useChatStore()

  const handleClearMessages = () => {
    if (messages.length > 0) {
      if (confirm('Clear all messages?')) {
        clearMessages()
      }
    }
  }

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Jan Mobile</h1>
          <p className="text-xs text-muted-foreground">AI Chat Assistant</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearMessages}
            className="text-muted-foreground"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
        
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </header>
  )
}