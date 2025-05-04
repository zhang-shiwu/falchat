"use client"

import { useState } from "react"
import { Code, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HtmlPreview({ code }: { code: string }) {
  const [activeTab, setActiveTab] = useState<string>("code")
  const [iframeKey, setIframeKey] = useState<number>(0)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "preview") {
      // Force iframe refresh when switching to preview
      setIframeKey((prev) => prev + 1)
    }
  }

  const cleanCode = code.trim()

  return (
    <div className="my-2 border rounded-md overflow-hidden bg-background text-foreground">
      <Tabs defaultValue="code" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
          <p className="text-sm font-medium">HTML Code</p>
          <TabsList className="h-8">
            <TabsTrigger value="code" className="text-xs px-2 py-1 h-7">
              <Code className="h-3.5 w-3.5 mr-1" />
              Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs px-2 py-1 h-7">
              <Eye className="h-3.5 w-3.5 mr-1" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="code" className="p-0 m-0">
          <pre className="p-3 text-sm overflow-x-auto">
            <code>{cleanCode}</code>
          </pre>
        </TabsContent>

        <TabsContent value="preview" className="p-0 m-0 bg-white">
          <div className="relative">
            <iframe
              key={iframeKey}
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      body { margin: 8px; font-family: system-ui, sans-serif; }
                    </style>
                  </head>
                  <body>${cleanCode}</body>
                </html>
              `}
              className="w-full min-h-[150px] border-0"
              sandbox="allow-scripts"
              title="HTML Preview"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
