'use client'

import Prism from 'prismjs'

import 'prismjs/components/prism-jsx'

import { useEffect, useRef } from 'react'
import mergeTW from '@/utils/mergeTW'

export default function SyntaxHighlight({
  code,
  className = '',
}: {
  code: string
  className?: string
}) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code])

  return (
    <pre suppressHydrationWarning>
      <code
        ref={codeRef}
        suppressHydrationWarning
        className={mergeTW(`lang-jsx text-sm ${className}`)}
      >
        {code}
      </code>
    </pre>
  )
}
