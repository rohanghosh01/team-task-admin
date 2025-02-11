"use client"

import { useState } from "react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatMain } from "@/components/chat/chat-main"
import { ChatRoom, Message } from "@/types/chat"

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [rooms] = useState<ChatRoom[]>([
    {
      id: "1",
      name: "Website Redesign",
      type: "PROJECT",
      participants: ["1", "2", "3"],
      unreadCount: 2,
      lastMessage: {
        id: "msg1",
        content: "Updated the design specs",
        senderId: "2",
        senderName: "Jane Smith",
        timestamp: new Date().toISOString(),
      },
    },
    {
      id: "2",
      name: "Mobile App Team",
      type: "PROJECT",
      participants: ["1", "4", "5"],
      unreadCount: 0,
      lastMessage: {
        id: "msg2",
        content: "Sprint planning at 2 PM",
        senderId: "4",
        senderName: "Mike Johnson",
        timestamp: new Date().toISOString(),
      },
    },
  ])

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 -mt-6 -mx-4">
      <ChatSidebar
        rooms={rooms}
        selectedRoom={selectedRoom}
        onRoomSelect={setSelectedRoom}
      />
      <ChatMain selectedRoom={selectedRoom} />
    </div>
  )
}