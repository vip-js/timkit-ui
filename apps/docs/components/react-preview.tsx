'use client'

import type { RegistryItem } from '@timui/core'

import RuntimePreview from '@/components/runtime-preview'

interface ReactPreviewProps {
  component: RegistryItem
}

export default function ReactPreview({ component }: ReactPreviewProps) {
  const reactFile = component.files?.find((file) => file.path.endsWith('.tsx'))
  const reactPath = reactFile?.path

  if (!reactPath) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-muted-foreground border border-dashed rounded-md bg-muted/20 w-full min-h-[100px]">
        No React preview available
      </div>
    )
  }

  return (
    <RuntimePreview
      framework="react"
      componentName={component.name}
      componentPath={reactPath}
      props={{}}
    />
  )
}
