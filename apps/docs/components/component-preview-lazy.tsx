'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'
import type { RegistryItem } from '@timui/core'
import { LoaderCircleIcon } from 'lucide-react'

import type { FrameworkPreviewHints } from '@/lib/framework-preview'
import { cn } from '@/registry/default/lib/utils'

function PreviewLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/70 text-sm text-muted-foreground shadow-[0_10px_28px_-22px_rgba(15,23,42,0.22)]',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>Loading preview...</span>
      </div>
    </div>
  )
}

interface ComponentPreviewLazyProps {
  componentName?: string
  previewHints?: FrameworkPreviewHints
  align?: 'center' | 'start' | 'end'
  className?: string
}

export default function ComponentPreviewLazy({
  componentName,
  previewHints,
  align = 'center',
  className,
}: ComponentPreviewLazyProps) {
  const normalizedName = componentName?.trim()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [component, setComponent] = useState<RegistryItem | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [PreviewComponent, setPreviewComponent] = useState<ComponentType<{
    component: RegistryItem
    previewHints?: FrameworkPreviewHints
    align?: 'center' | 'start' | 'end'
    className?: string
  }> | null>(null)

  useEffect(() => {
    setComponent(null)
    setLoadError(null)
  }, [normalizedName])

  useEffect(() => {
    if (!containerEl || visible) return
    if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
        }
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    )
    observer.observe(containerEl)

    // Fallback: ensure previews still load even if observer misses due layout/viewport quirks.
    const fallbackTimer = window.setTimeout(() => {
      setVisible(true)
    }, 1200)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallbackTimer)
    }
  }, [containerEl, visible])

  useEffect(() => {
    if (!normalizedName) {
      setLoadError('Component source metadata is missing.')
      return
    }
    if (!visible || component || loadError) return
    let active = true

    fetch(`/registry/${normalizedName}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((item) => {
        if (!active) return
        if (!item) {
          setLoadError(`Component source not found: ${normalizedName}`)
          return
        }
        setComponent(item as RegistryItem)
      })
      .catch((error) => {
        if (!active) return
        console.error('Failed to fetch component source:', error)
        setLoadError(`Failed to load component source: ${normalizedName}`)
      })

    return () => {
      active = false
    }
  }, [component, loadError, normalizedName, visible])

  useEffect(() => {
    if (!normalizedName || !visible || PreviewComponent || loadError) return
    let active = true

    import('@/components/component-preview')
      .then((mod) => {
        if (!active) return
        if (!mod.default) {
          setLoadError(`Preview module invalid: ${normalizedName}`)
          return
        }
        setPreviewComponent(() => mod.default)
      })
      .catch((error) => {
        if (!active) return
        console.error('Failed to load preview module:', error)
        setLoadError(`Failed to load preview module: ${normalizedName}`)
      })

    return () => {
      active = false
    }
  }, [PreviewComponent, loadError, normalizedName, visible])

  useEffect(() => {
    if (!visible || (component && PreviewComponent) || loadError) return
    const watchdog = window.setTimeout(() => {
      setLoadError(`Preview loading timeout: ${normalizedName}`)
    }, 15000)
    return () => window.clearTimeout(watchdog)
  }, [component, PreviewComponent, loadError, normalizedName, visible])

  return (
    <div
      ref={(node) => {
        containerRef.current = node
        setContainerEl(node)
      }}
      className="w-full"
    >
      {loadError ? (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 px-4 text-sm text-destructive">
          {loadError}
        </div>
      ) : visible && component && PreviewComponent ? (
        <PreviewComponent
          component={component}
          previewHints={previewHints}
          align={align}
          className={className}
        />
      ) : (
        <PreviewLoading className={className} />
      )}
    </div>
  )
}
