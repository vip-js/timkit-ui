'use client'

import * as React from 'react'

interface VuePreviewProps {
  componentName?: string
}

export default function VuePreview({ componentName }: VuePreviewProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [isReady, setIsReady] = React.useState(false)
  const [isComponentLoaded, setIsComponentLoaded] = React.useState(false)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const previewBase = process.env.NEXT_PUBLIC_VUE_PREVIEW_URL || 'http://127.0.0.1:3002'
  const previewSrc = React.useMemo(() => {
    const name = componentName || 'button'
    const encoded = encodeURIComponent(name)
    return `${previewBase}?component=${encoded}`
  }, [componentName, previewBase])

  const postLoadComponent = React.useCallback(() => {
    if (!iframeRef.current?.contentWindow || !componentName) return
    iframeRef.current.contentWindow.postMessage(
      {
        type: 'LOAD_COMPONENT',
        componentName,
        props: {},
      },
      '*'
    )
  }, [componentName])

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!iframeRef.current?.contentWindow) return
      if (event.source !== iframeRef.current.contentWindow) return

      const message = event.data as { type?: string; componentName?: string } | undefined
      if (!message?.type) return

      if (event.data.type === 'PREVIEW_READY') {
        setLoadError(null)
        setIsReady(true)
      }
      if (
        message.type === 'COMPONENT_LOADED' &&
        (!message.componentName || message.componentName === componentName)
      ) {
        setIsComponentLoaded(true)
        setLoadError(null)
      }
      if (
        message.type === 'COMPONENT_LOAD_FAILED' &&
        (!message.componentName || message.componentName === componentName)
      ) {
        setLoadError(`Component preview failed: ${componentName || 'object'}`)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [componentName])

  React.useEffect(() => {
    if (!componentName) return
    setIsComponentLoaded(false)
  }, [componentName])

  React.useEffect(() => {
    setIsReady(false)
    setIsComponentLoaded(false)
    setLoadError(null)
  }, [previewSrc])

  React.useEffect(() => {
    if (!isReady || !componentName) return

    postLoadComponent()
    const retryTimer = window.setInterval(() => {
      if (!isComponentLoaded) postLoadComponent()
    }, 800)

    const stopTimer = window.setTimeout(() => {
      window.clearInterval(retryTimer)
      if (!isComponentLoaded) {
        setLoadError(`Component did not respond in time: ${componentName}`)
      }
    }, 6000)

    return () => {
      window.clearInterval(retryTimer)
      window.clearTimeout(stopTimer)
    }
  }, [componentName, isComponentLoaded, isReady, postLoadComponent])

  React.useEffect(() => {
    if (isReady) return

    const timer = window.setTimeout(() => {
      setLoadError(`Vue preview server is not ready: ${previewSrc}`)
    }, 6000)

    return () => window.clearTimeout(timer)
  }, [isReady, previewSrc])

  return (
    <div className="relative w-full min-h-[300px] rounded-lg border bg-background overflow-hidden">
      <iframe
        ref={iframeRef}
        src={previewSrc}
        className="w-full h-[400px] border-0"
        title="Vue Component Preview"
        onLoad={() => {
          if (isReady) postLoadComponent()
        }}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">{loadError || 'Loading Vue preview...'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
