import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"

// 配置 Fal AI 客户端
if (process.env.FAL_KEY) {
  fal.config({
    credentials: process.env.FAL_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model } = await request.json()

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY 环境变量未设置" }, { status: 500 })
    }

    // 使用提供的模型或默认为 gemini-flash-1.5
    const selectedModel = model || "google/gemini-flash-1.5"

    // 格式化消息历史
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // 构建提示
    const lastMessage = formattedMessages[formattedMessages.length - 1].content

    // 调用 Fal AI API
    const result = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model: selectedModel,
        prompt: lastMessage,
        system_prompt:
          "你是一个有帮助的助手。如果用户请求HTML代码，请使用```html```代码块格式提供。请提供详细且有用的回答。",
      },
    })

    return NextResponse.json({ response: result.data.output })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "处理请求时出错" }, { status: 500 })
  }
}
