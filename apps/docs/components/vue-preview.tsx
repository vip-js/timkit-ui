'use client'

import RuntimePreview from '@/components/runtime-preview'

interface VuePreviewProps {
  componentName?: string
}

export default function VuePreview({ componentName }: VuePreviewProps) {
  return <RuntimePreview framework="vue" componentName={componentName} props={{}} />
}
