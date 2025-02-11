"use client"

import { useState } from "react"
import { ChatRoom, Message } from "@/types/chat"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users } from "lucide-react"

interface ChatMainProps {
  selectedRoom: ChatRoom | null
}

export function ChatMain({ selectedRoom }: ChatMainProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey team, I've updated the design specs for the landing page",
      senderId: "2",
      senderName: "Jane Smith",
      timestamp: "2024-03-15T10:30:00Z",
    },
    {
      id: "2",
      content: "Great! I'll take a look at them now",
      senderId: "1",
      senderName: "John Doe",
      timestamp: "2024-03-15T10:32:00Z",
    },
    {
      id: "3",
      content: "Let me know if you need any clarification",
      senderId: "2",
      senderName: "Jane Smith",
      timestamp: "2024-03-15T10:33:00Z",
    },
  ])

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: "1", // Current user ID
      senderName: "John Doe", // Current user name
      timestamp: new Date().toISOString(),
    }
    setMessages([...messages, newMessage])
  }

  if (!selectedRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <div className="bg-primary/10 p-4 rounded-full inline-block mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium">No Chat Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a chat room to start messaging
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-muted/10">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{selectedRoom.name}</h2>
          <p className="text-sm text-muted-foreground">
            {selectedRoom.participants.length} participants
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <Users className="h-4 w-4" />
        </Button>
      </div>
      <ChatMessages messages={messages} currentUserId="1" />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}