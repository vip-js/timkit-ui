import React from "react"
import blockRegistry from "@/blocks"

export interface SimpleTemplateProps {
  text: string
}

export function SimpleTemplate({ text }: SimpleTemplateProps) {
  const Text = blockRegistry.get("TextBlock")?.component
  return (
    <div className="p-4 border rounded">
      {Text && <Text text={text} />}
    </div>
  )
}
