"use client"

import { ChatRoom } from "@/types/chat"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, MessageSquare } from "lucide-react"

interface ChatSidebarProps {
  rooms: ChatRoom[]
  selectedRoom: ChatRoom | null
  onRoomSelect: (room: ChatRoom) => void
}

export function ChatSidebar({ rooms, selectedRoom, onRoomSelect }: ChatSidebarProps) {
  return (
    <div className="w-80 border-r bg-muted/10">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Chat Rooms</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left",
                "hover:bg-muted/50 transition-colors",
                selectedRoom?.id === room.id && "bg-muted"
              )}
            >
              <div className="bg-primary/10 p-2 rounded-full">
                {room.type === "PROJECT" ? (
                  <Users className="h-4 w-4 text-primary" />
                ) : (
                  <MessageSquare className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{room.name}</span>
                  {room.unreadCount > 0 && (
                    <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {room.unreadCount}
                    </Badge>
                  )}
                </div>
                {room.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {room.lastMessage.senderName}: {room.lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}