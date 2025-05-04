"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SendHorizontal, Code, Eye, Trash2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 按提供商分组的模型
const modelGroups = [
  {
    provider: "Anthropic",
    models: [
      { value: "anthropic/claude-3.7-sonnet", label: "Claude 3.7 Sonnet" },
      { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
      { value: "anthropic/claude-3-5-haiku", label: "Claude 3.5 Haiku" },
      { value: "anthropic/claude-3-haiku", label: "Claude 3 Haiku" },
    ],
  },
  {
    provider: "Google",
    models: [
      { value: "google/gemini-pro-1.5", label: "Gemini Pro 1.5" },
      { value: "google/gemini-flash-1.5", label: "Gemini Flash 1.5" },
      { value: "google/gemini-flash-1.5-8b", label: "Gemini Flash 1.5 8B" },
      { value: "google/gemini-2.0-flash-001", label: "Gemini 2.0 Flash" },
    ],
  },
  {
    provider: "Meta",
    models: [
      { value: "meta-llama/llama-3.2-1b-instruct", label: "Llama 3.2 1B" },
      { value: "meta-llama/llama-3.2-3b-instruct", label: "Llama 3.2 3B" },
      { value: "meta-llama/llama-3.1-8b-instruct", label: "Llama 3.1 8B" },
      { value: "meta-llama/llama-3.1-70b-instruct", label: "Llama 3.1 70B" },
      { value: "meta-llama/llama-4-maverick", label: "Llama 4 Maverick" },
      { value: "meta-llama/llama-4-scout", label: "Llama 4 Scout" },
    ],
  },
  {
    provider: "OpenAI",
    models: [
      { value: "openai/gpt-4o-mini", label: "GPT-4o Mini" },
      { value: "openai/gpt-4o", label: "GPT-4o" },
    ],
  },
  {
    provider: "DeepSeek",
    models: [{ value: "deepseek/deepseek-r1", label: "DeepSeek R1" }],
  },
]

// 所有模型的平面列表
const allModels = modelGroups.flatMap((group) => group.models)

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [previewMap, setPreviewMap] = useState<Record<string, boolean>>({})
  const [foldedMap, setFoldedMap] = useState<Record<string, boolean>>({})
  const [selectedModel, setSelectedModel] = useState<string>("google/gemini-flash-1.5")

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call API route to get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "抱歉，发生了错误。请稍后再试。",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const togglePreview = (id: string) => {
    setPreviewMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleFolded = (id: string) => {
    setFoldedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const shouldFoldByDefault = (code: string): boolean => {
    // 如果代码超过10行或300个字符，默认折叠
    const lines = code.split("\n")
    return lines.length > 10 || code.length > 300
  }

  const clearChat = () => {
    setMessages([])
    setPreviewMap({})
    setFoldedMap({})
  }

  // Function to detect and format code blocks
  const formatMessage = (content: string, messageId: string) => {
    // Split by HTML code blocks
    const htmlRegex = /```html([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = htmlRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <div key={`${messageId}-text-${lastIndex}`} className="whitespace-pre-wrap">
            {content.slice(lastIndex, match.index)}
          </div>,
        )
      }

      // Add code block
      const codeContent = match[1].trim()
      const codeBlockId = `${messageId}-code-${match.index}`
      // 检查是否是新的代码块，如果是且应该默认折叠，则设置为折叠状态
      if (foldedMap[codeBlockId] === undefined && shouldFoldByDefault(codeContent)) {
        setFoldedMap((prev) => ({
          ...prev,
          [codeBlockId]: true,
        }))
      }
      const isFolded = foldedMap[codeBlockId]

      parts.push(
        <div key={codeBlockId} className="my-3 border rounded-md overflow-hidden">
          <div className="flex items-center justify-between bg-muted p-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-primary/10 px-2 py-1 rounded">HTML</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => toggleFolded(codeBlockId)}
                title={isFolded ? "展开代码" : "折叠代码"}
              >
                {isFolded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => togglePreview(codeBlockId)}
              title={previewMap[codeBlockId] ? "查看代码" : "预览 HTML"}
            >
              {previewMap[codeBlockId] ? <Code size={14} /> : <Eye size={14} />}
            </Button>
          </div>

          {!isFolded ? (
            <>
              {previewMap[codeBlockId] ? (
                <div className="border-t p-4 bg-white">
                  <div dangerouslySetInnerHTML={{ __html: codeContent }} />
                </div>
              ) : (
                <pre className="bg-muted/30 p-4 overflow-x-auto text-sm">
                  <code>{codeContent}</code>
                </pre>
              )}
            </>
          ) : (
            <div className="border-t p-2 bg-muted/10 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>{codeContent.split("\n").length} 行代码</span>
                <span>{codeContent.length} 个字符</span>
              </div>
            </div>
          )}
        </div>,
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <div key={`${messageId}-text-${lastIndex}`} className="whitespace-pre-wrap">
          {content.slice(lastIndex)}
        </div>,
      )
    }

    return parts.length > 0 ? parts : <div className="whitespace-pre-wrap">{content}</div>
  }

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="border-b p-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-xl font-bold">聊天应用</h1>
            <div className="flex items-center gap-2">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {modelGroups.map((group) => (
                    <SelectGroup key={group.provider}>
                      <SelectLabel>{group.provider}</SelectLabel>
                      {group.models.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={clearChat} title="清空聊天">
                <Trash2 size={18} />
              </Button>
            </div>
          </div>

          <Alert className="mt-4 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800 font-medium">
              注意：此聊天应用<span className="bg-amber-100 px-1 font-bold">不支持上下文</span>
              ，每条消息都是独立的对话。
            </AlertDescription>
          </Alert>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 px-4 border rounded-lg bg-muted/20">
              <h2 className="text-lg font-medium mb-2">开始新的对话</h2>
              <p className="mb-4">发送消息开始与 AI 助手聊天</p>
              <div className="text-sm bg-muted/40 p-3 rounded-md inline-block">
                <p className="mb-1">✓ 支持 HTML 代码块预览</p>
                <p className="mb-1">✓ 代码折叠功能</p>
                <p>✓ 多种 AI 模型选择</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Card
                key={message.id}
                className={cn("p-4 shadow-sm", message.role === "user" ? "bg-primary/5 border-primary/20" : "bg-muted")}
              >
                <div className="font-semibold mb-2 text-sm">{message.role === "user" ? "你" : "助手"}</div>
                <div>{formatMessage(message.content, message.id)}</div>
              </Card>
            ))
          )}
          {isLoading && (
            <Card className="p-4 bg-muted shadow-sm">
              <div className="font-semibold mb-2 text-sm">助手</div>
              <div className="flex items-center gap-2">
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full animation-delay-200"></div>
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full animation-delay-400"></div>
                <span className="ml-1 text-muted-foreground">正在思考...</span>
              </div>
            </Card>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <footer className="border-t p-4 bg-white">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入消息..."
              className="flex-1 min-h-[60px] max-h-[200px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="self-end">
              <SendHorizontal size={18} />
              <span className="sr-only">发送</span>
            </Button>
          </div>
        </form>
      </footer>
    </div>
  )
}
