'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@timui/react'

export default function Component() {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-40 max-w-lg rounded-lg border">
      <ResizablePanel defaultSize={50}>Left</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>Right</ResizablePanel>
    </ResizablePanelGroup>
  )
}
