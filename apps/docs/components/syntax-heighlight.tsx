'use client'

import Prism from 'prismjs'

import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/themes/prism-tomorrow.css'

import { useEffect, useRef } from 'react'
import mergeTW from '@/utils/merge-tw'

export default function SyntaxHighlight({
  code,
  language = 'jsx',
  className = '',
}: {
  code: string
  language?: string
  className?: string
}) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, language])

  return (
    <pre suppressHydrationWarning className="!bg-transparent">
      <code
        ref={codeRef}
        suppressHydrationWarning
        className={mergeTW(`language-${language} text-sm ${className}`)}
      >
        {code}
      </code>
    </pre>
  )
}
