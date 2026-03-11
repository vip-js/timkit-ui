'use client'

import RuntimePreview from '@/components/runtime-preview'

interface HtmlPreviewProps {
  code?: string
  componentName?: string
}

export default function HtmlPreview({ code, componentName }: HtmlPreviewProps) {
  return <RuntimePreview framework="html" componentName={componentName} code={code} />
}
