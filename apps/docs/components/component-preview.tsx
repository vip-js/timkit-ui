'use client'

import * as React from 'react'
import type { RegistryItem } from '@timui/core'
import { Monitor, Terminal } from 'lucide-react'

import { demoCanvasClass, demoKindFromName, demoStageClass } from '@/lib/demo-layout'
import type { FrameworkPreviewHints, PreviewFrameworkKey } from '@/lib/framework-preview'
import { resolveFrameworkPreviewTargets } from '@/lib/framework-preview'
import { getAvailablePreviewFrameworkTabs, getFrameworkCodePanes } from '@/lib/framework-utils'
import FrameworksTabs, { type FrameworkPane } from '@/components/frameworks-tabs'
import RuntimePreview from '@/components/runtime-preview'
import { cn } from '@/registry/default/lib/utils'

type PreviewTabFramework = PreviewFrameworkKey | 'weapp'

interface ComponentPreviewProps {
  component: RegistryItem
  previewHints?: FrameworkPreviewHints
  align?: 'center' | 'start' | 'end'
  className?: string
}

export default function ComponentPreview({
  component,
  previewHints,
  align = 'center',
  className,
}: ComponentPreviewProps) {
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview')
  const [previewWidth, setPreviewWidth] = React.useState<number | '100%'>('100%')

  const frameworkTabs = React.useMemo(
    () => getAvailablePreviewFrameworkTabs(component, previewHints),
    [component, previewHints]
  )
  const previewTargets = React.useMemo(
    () => resolveFrameworkPreviewTargets(component, previewHints),
    [component, previewHints]
  )
  const frameworkPanes = React.useMemo<FrameworkPane[]>(() => {
    const paneMap = getFrameworkCodePanes(component)
    return frameworkTabs.map((tab) => ({
      value: tab.value,
      code: paneMap[tab.value] ?? '',
    }))
  }, [component, frameworkTabs])

  const preferredFramework = (frameworkTabs[0]?.value || 'react') as PreviewTabFramework
  const [activeFramework, setActiveFramework] =
    React.useState<PreviewTabFramework>(preferredFramework)

  const effectiveFramework: PreviewTabFramework = frameworkTabs.some(
    (item) => item.value === activeFramework
  )
    ? activeFramework
    : preferredFramework
  const currentPreviewTarget =
    effectiveFramework === 'weapp' ? undefined : previewTargets[effectiveFramework]
  const currentPane = frameworkPanes.find((p) => p.value === effectiveFramework)
  const hasCode = frameworkTabs.length > 0
  const demoKind = demoKindFromName(component.name)

  React.useEffect(() => {
    if (!frameworkTabs.some((item) => item.value === activeFramework) && frameworkTabs[0]) {
      setActiveFramework(frameworkTabs[0].value as PreviewTabFramework)
    }
  }, [activeFramework, frameworkTabs])

  return (
    <div className={cn('group relative flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Framework Switcher - Minimal Pill */}
          {frameworkTabs.length > 1 && (
            <div className="flex items-center rounded-lg border border-border/50 bg-background/50 p-1 backdrop-blur-sm">
              {frameworkTabs.map((fw) => (
                <button
                  key={fw.value}
                  onClick={() => setActiveFramework(fw.value as PreviewTabFramework)}
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

      <div
        className={cn(
          'relative rounded-xl border border-border/55 bg-muted/20 shadow-none dark:border-border/50',
          demoKind === 'overlay' ? 'overflow-visible' : 'overflow-hidden'
        )}
      >
        {tab === 'preview' ? (
          <div
            className={cn(
              'relative w-full',
              demoKind === 'control' && 'min-h-36',
              demoKind === 'form' && 'min-h-52',
              demoKind === 'data' && 'min-h-40',
              demoKind === 'overlay' && 'min-h-64'
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.35] dark:opacity-25" />

            <div className="relative flex w-full justify-center px-3 py-5 sm:px-4 sm:py-6">
              <div
                className={cn(
                  'relative flex w-full flex-col rounded-lg bg-background/85 ring-1 ring-border/35',
                  demoStageClass(demoKind),
                  align === 'start' && 'items-start',
                  align === 'end' && 'items-end'
                )}
                style={{ maxWidth: previewWidth }}
              >
                <div className={cn('z-10 w-full p-4 sm:p-5', demoCanvasClass(demoKind))}>
                  {effectiveFramework === 'react' && currentPreviewTarget?.componentPath ? (
                    <RuntimePreview
                      key={`react:${currentPreviewTarget.componentPath}`}
                      framework="react"
                      componentName={currentPreviewTarget.componentName || component.name}
                      componentPath={currentPreviewTarget.componentPath}
                      props={{}}
                      className="relative w-full overflow-hidden rounded-md bg-transparent"
                    />
                  ) : effectiveFramework === 'html' && currentPreviewTarget ? (
                    <RuntimePreview
                      key={`html:${currentPreviewTarget.componentName || component.name}`}
                      framework="html"
                      componentName={currentPreviewTarget.componentName}
                      code={currentPreviewTarget.code || currentPane?.code || ''}
                      className="relative w-full overflow-hidden rounded-md bg-transparent"
                    />
                  ) : effectiveFramework === 'vue' && currentPreviewTarget ? (
                    <RuntimePreview
                      key={`vue:${currentPreviewTarget.componentName || component.name}`}
                      framework="vue"
                      componentName={currentPreviewTarget.componentName || component.name}
                      props={{}}
                      className="relative w-full overflow-hidden rounded-md bg-transparent"
                    />
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
                  aria-label="Full width"
                  aria-pressed={previewWidth === '100%'}
                  title="Full width"
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
                  aria-label="Mobile width"
                  aria-pressed={previewWidth === 375}
                  title="Mobile width"
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
