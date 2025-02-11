export interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  timestamp: string
  attachments?: {
    name: string
    url: string
    type: string
  }[]
}

export interface ChatRoom {
  id: string
  name: string
  type: "PROJECT" | "DIRECT"
  participants: string[]
  lastMessage?: Message
  unreadCount: number
}