"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

export type ModelSelectorProps = {
  value: string
  onValueChange: (value: string) => void
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  // 查找当前选中模型的标签
  const selectedModel = allModels.find((model) => model.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedModel ? selectedModel.label : "选择模型..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="搜索模型..." />
          <CommandList>
            <CommandEmpty>未找到模型</CommandEmpty>
            {modelGroups.map((group) => (
              <CommandGroup key={group.provider} heading={group.provider}>
                {group.models.map((model) => (
                  <CommandItem
                    key={model.value}
                    value={model.value}
                    onSelect={() => {
                      onValueChange(model.value)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === model.value ? "opacity-100" : "opacity-0")} />
                    {model.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
