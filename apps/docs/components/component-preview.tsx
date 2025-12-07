'use client'

import * as React from 'react'
import { RegistryItem } from '@timui/core'
import { cn } from '@timui/shared'
import { Check, Clipboard, Loader2, Monitor, Moon, Sun, Terminal } from 'lucide-react'
import { useTheme } from 'next-themes'

import CodeBlock from '@/components/code-block'
import ComponentLoaderClient from '@/components/component-loader-client'

interface ComponentPreviewProps {
  component: RegistryItem
  align?: 'center' | 'start' | 'end'
}

export default function ComponentPreview({ component, align = 'center' }: ComponentPreviewProps) {
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview')
  const [hasCopied, setHasCopied] = React.useState(false)

  // Extract primary file content for code view
  const primaryFile = component.files?.[0]
  const code = primaryFile?.content || ''

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [hasCopied])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setHasCopied(true)
  }

  return (
    <div className="group relative my-4 flex flex-col space-y-2">
      <div className="flex items-center justify-between pb-3">
        {/* Tabs - Linear Style */}
        <div className="flex items-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-transparent">
          <button
            onClick={() => setTab('preview')}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring',
              tab === 'preview'
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50 hover:text-foreground'
            )}
          >
            <Monitor className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={() => setTab('code')}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring',
              tab === 'code'
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50 hover:text-foreground'
            )}
          >
            <Terminal className="h-4 w-4" />
            Code
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background/50 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            title="Copy code"
          >
            {hasCopied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
            <span className="sr-only">Copy code</span>
          </button>
        </div>
      </div>

      <div className="relative rounded-xl border bg-background shadow-xs">
        {tab === 'preview' ? (
          <div
            className={cn('preview flex min-h-[350px] w-full justify-center p-10', {
              'items-center': align === 'center',
              'items-start': align === 'start',
              'items-end': align === 'end',
            })}
            style={{
              // Optional: Add a subtle dot pattern for Linear-like feel
              backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <ComponentLoaderClient component={component} />
          </div>
        ) : (
          <div className="relative">
            <CodeBlock code={code} lang="tsx" className="rounded-xl border-0" />
          </div>
        )}
      </div>
    </div>
  )
}
