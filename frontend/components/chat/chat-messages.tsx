"use client"

import { useEffect, useRef } from "react"
import { Message } from "@/types/chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatMessagesProps {
  messages: Message[]
  currentUserId: string
}

export function ChatMessages({ messages, currentUserId }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId
          const showAvatar = index === 0 || 
            messages[index - 1].senderId !== message.senderId

          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                isCurrentUser && "justify-end"
              )}
            >
              {!isCurrentUser && showAvatar && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.senderName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[70%] space-y-1",
                  isCurrentUser && "items-end"
                )}
              >
                {showAvatar && (
                  <p className={cn(
                    "text-sm",
                    isCurrentUser ? "text-right" : "text-left"
                  )}>
                    {message.senderName}
                  </p>
                )}
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
                <p className={cn(
                  "text-xs text-muted-foreground",
                  isCurrentUser ? "text-right" : "text-left"
                )}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}