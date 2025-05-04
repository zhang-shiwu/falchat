import type { Metadata } from "next"
import ChatPage from "./chat-page"

export const metadata: Metadata = {
  title: "Chat App with HTML Preview",
  description: "A chat application with HTML code block preview support",
}

export default function Page() {
  return <ChatPage />
}
