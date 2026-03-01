'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import type { RegistryItem } from '@timui/core'
import { Monitor, Terminal } from 'lucide-react'

import { getAvailableFrameworkTabs, getFrameworkCodePanes } from '@/lib/framework-utils'
import FrameworksTabs, { type FrameworkPane } from '@/components/frameworks-tabs'
import VuePreview from '@/components/vue-preview'
import { cn } from '@/registry/default/lib/utils'

const ReactComponentLoader = dynamic(() => import('@/components/component-loader-client'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
      Loading React preview...
    </div>
  ),
})

interface ComponentPreviewProps {
  component: RegistryItem
  align?: 'center' | 'start' | 'end'
  className?: string
}

export default function ComponentPreview({
  component,
  align = 'center',
  className,
}: ComponentPreviewProps) {
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview')
  const [previewWidth, setPreviewWidth] = React.useState<number | '100%'>('100%')

  const frameworkTabs = React.useMemo(
    () => getAvailableFrameworkTabs(component.files || []),
    [component.files]
  )
  const frameworkPanes = React.useMemo<FrameworkPane[]>(() => {
    const files = component.files || []
    const paneMap = getFrameworkCodePanes(files)
    return frameworkTabs.map((tab) => ({
      value: tab.value,
      code: paneMap[tab.value] ?? '',
    }))
  }, [component.files, frameworkTabs])

  const preferredFramework = frameworkTabs[0]?.value || 'react'
  const [activeFramework, setActiveFramework] = React.useState(preferredFramework)

  const effectiveFramework = frameworkTabs.some((item) => item.value === activeFramework)
    ? activeFramework
    : preferredFramework
  const currentPane = frameworkPanes.find((p) => p.value === effectiveFramework)
  const hasCode = frameworkTabs.length > 0

  React.useEffect(() => {
    if (!frameworkTabs.some((item) => item.value === activeFramework) && frameworkTabs[0]) {
      setActiveFramework(frameworkTabs[0].value)
    }
  }, [activeFramework, frameworkTabs])

  return (
    <div className={cn('group relative my-6 flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Framework Switcher - Minimal Pill */}
          {frameworkTabs.length > 1 && (
            <div className="flex items-center rounded-lg border border-border/50 bg-background/50 p-1 backdrop-blur-sm">
              {frameworkTabs.map((fw) => (
                <button
                  key={fw.value}
                  onClick={() => setActiveFramework(fw.value)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium transition-all duration-200',
                    effectiveFramework === fw.value
                      ? 'bg-muted text-foreground shadow-xs'
                      : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <span
                    className={cn(
                      'h-3.5 w-3.5 flex items-center justify-center opacity-70',
                      effectiveFramework === fw.value && 'opacity-100'
                    )}
                  >
                    {fw.icon}
                  </span>
                  <span className="hidden sm:inline">{fw.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mode Tabs - Top Right */}
        <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-background/50 p-1 backdrop-blur-sm">
          <button
            onClick={() => setTab('preview')}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1 text-[12px] font-medium transition-all duration-200',
              tab === 'preview'
                ? 'bg-muted text-foreground shadow-xs'
                : 'text-muted-foreground/70 hover:text-foreground'
            )}
          >
            <Monitor className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={() => setTab('code')}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1 text-[12px] font-medium transition-all duration-200',
              tab === 'code'
                ? 'bg-muted text-foreground shadow-xs'
                : 'text-muted-foreground/70 hover:text-foreground'
            )}
          >
            <Terminal className="h-3.5 w-3.5" />
            Code
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border shadow-xs dark:border-border/60">
        {tab === 'preview' ? (
          <div className="relative min-h-[400px] w-full bg-background">
            {/* Preview Background: Dot Matrix */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25 dark:bg-[radial-gradient(#2f333a_1px,transparent_1px)]" />

            {/* Resizable Container Wrapper */}
            <div
              className="relative flex w-full justify-center overflow-hidden py-10"
              style={{ minHeight: 400 }}
            >
              <div
                className={cn(
                  'relative flex min-h-[350px] w-full flex-col bg-background ring-1 ring-border/30 transition-all duration-300 ease-in-out',
                  align === 'center' && 'items-center',
                  align === 'start' && 'items-start',
                  align === 'end' && 'items-end'
                )}
                style={{ maxWidth: previewWidth }}
              >
                <div className="z-10 w-full p-8 md:p-10">
                  {effectiveFramework === 'react' ? (
                    <ReactComponentLoader component={component} />
                  ) : effectiveFramework === 'html' ? (
                    <HtmlPreview code={currentPane?.code || ''} />
                  ) : effectiveFramework === 'vue' ? (
                    <VuePreview componentName={component.name} />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Terminal className="h-8 w-8 opacity-20 mb-2" />
                      <p>Preview not available for {effectiveFramework}</p>
                      <button
                        onClick={() => setTab('code')}
                        className="text-secondary-foreground underline underline-offset-4 hover:text-primary"
                      >
                        View Code
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Resize Handles (Mock/Simple) */}
              <div className="absolute top-4 right-4 z-20 hidden md:flex items-center gap-2 rounded-md border border-border/50 bg-background/80 p-1 backdrop-blur-md shadow-sm">
                <button
                  onClick={() => setPreviewWidth('100%')}
                  className={cn(
                    'p-1.5 rounded hover:bg-muted text-muted-foreground',
                    previewWidth === '100%' && 'text-foreground bg-muted'
                  )}
                  title="Full Width"
                >
                  <div className="h-3 w-5 border border-current rounded-sm" />
                </button>
                <div className="h-3 w-[1px] bg-border" />
                <button
                  onClick={() => setPreviewWidth(375)}
                  className={cn(
                    'p-1.5 rounded hover:bg-muted text-muted-foreground',
                    previewWidth === 375 && 'text-foreground bg-muted'
                  )}
                  title="Mobile (375px)"
                >
                  <div className="h-4 w-2.5 border border-current rounded-[1px]" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative border-t border-border/40 bg-muted/5">
            {hasCode ? (
              <FrameworksTabs tabs={frameworkTabs} panes={frameworkPanes} height={500} />
            ) : (
              <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
                No code available
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Hints */}
      {effectiveFramework === 'weapp' && tab === 'code' && (
        <div className="flex items-center gap-2 rounded-md border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-[13px] text-blue-600 dark:text-blue-400">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
            i
          </span>
          WeChat Mini Program code is for reference only and may depend on framework specifics.
        </div>
      )}
    </div>
  )
}

function HtmlPreview({ code }: { code: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!containerRef.current) return

    // Create a temporary container to parse the HTML
    const temp = document.createElement('div')
    temp.innerHTML = code

    // Extract scripts
    const scripts = temp.querySelectorAll('script')

    // Replace current content (without scripts)
    // We strip scripts to avoid double execution or weirdness if we just set innerHTML directly
    // But setting innerHTML doesn't execute scripts anyway.
    // However, we want to remove them from visual DOM if they occupy space (unlikely for script)
    // Actually, just setting innerHTML is fine, scripts act as dead tags.
    // But let's keep clean.
    const sanitizedCode = code.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
    containerRef.current.innerHTML = sanitizedCode

    // Execute scripts
    scripts.forEach((script) => {
      const newScript = document.createElement('script')
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      newScript.appendChild(document.createTextNode(script.innerHTML))
      containerRef.current?.appendChild(newScript)
    })
  }, [code])

  return <div ref={containerRef} className="w-full" />
}
