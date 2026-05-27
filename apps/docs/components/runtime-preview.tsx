'use client'

import * as React from 'react'
import {
  isPreviewOutgoingMessage,
  PREVIEW_PROTOCOL_VERSION,
  type PreviewData,
  type PreviewFramework,
  type PreviewOutgoingMessage,
} from '@timui/core/preview-protocol'

interface RuntimePreviewProps {
  framework: PreviewFramework
  componentName?: string
  componentPath?: string
  code?: string
  props?: Record<string, PreviewData>
  className?: string
}

type PreviewResizeMessage = {
  type: 'PREVIEW_RESIZE'
  height: number
}

const isPreviewResizeMessage = (
  value: object | null | undefined
): value is PreviewResizeMessage => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as { type?: string; height?: number }
  return candidate.type === 'PREVIEW_RESIZE' && typeof candidate.height === 'number'
}

export default function RuntimePreview({
  framework,
  componentName,
  componentPath,
  code,
  props,
  className,
}: RuntimePreviewProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [isReady, setIsReady] = React.useState(false)
  const [isRendered, setIsRendered] = React.useState(false)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [iframeHeight, setIframeHeight] = React.useState<number | string>(400)
  const vuePreviewBase = process.env.NEXT_PUBLIC_VUE_PREVIEW_URL || '/preview/vue'
  const reactPreviewBase =
    process.env.NEXT_PUBLIC_REACT_PREVIEW_URL ||
    (typeof window !== 'undefined' ? `${window.location.origin}/preview/react` : '/preview/react')
  const requestIdRef = React.useRef(0)
  const [requestId, setRequestId] = React.useState('')

  const previewSrc = React.useMemo(() => {
    const base = framework === 'react' ? reactPreviewBase : vuePreviewBase
    const url = new URL(
      base,
      typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1'
    )
    url.searchParams.set('framework', framework)
    if (framework === 'vue') {
      url.searchParams.set('component', componentName || 'button')
    }
    if (framework === 'react' && componentPath) {
      url.searchParams.set('path', componentPath)
    }
    return url.toString()
  }, [componentName, componentPath, framework, reactPreviewBase, vuePreviewBase])
  const previewOrigin = React.useMemo(() => new URL(previewSrc).origin, [previewSrc])

  const postLoadRequest = React.useCallback(() => {
    if (!iframeRef.current?.contentWindow) return
    const currentRequestId = requestId || `req-${Date.now()}-${requestIdRef.current++}`
    if (!requestId) setRequestId(currentRequestId)

    iframeRef.current.contentWindow.postMessage(
      {
        type: 'LOAD_PREVIEW',
        version: PREVIEW_PROTOCOL_VERSION,
        requestId: currentRequestId,
        framework,
        componentName:
          framework === 'vue' || framework === 'html' ? componentName || 'button' : undefined,
        componentPath: framework === 'react' ? componentPath : undefined,
        props: framework === 'vue' || framework === 'react' ? props || {} : undefined,
        code: framework === 'html' ? code || '' : undefined,
      },
      previewOrigin
    )
  }, [code, componentName, componentPath, framework, previewOrigin, props, requestId])

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!iframeRef.current?.contentWindow) return
      if (event.source !== iframeRef.current.contentWindow) return
      if (event.origin !== previewOrigin) return

      const payload = event.data as object | null | undefined

      if (isPreviewResizeMessage(payload)) {
        setIframeHeight(payload.height)
        return
      }

      if (!isPreviewOutgoingMessage(payload)) return
      const message: PreviewOutgoingMessage = payload

      if (message.type === 'PREVIEW_READY') {
        setIsReady(true)
        setLoadError(null)
        return
      }

      if (message.type === 'PREVIEW_RENDERED') {
        if (requestId && message.requestId !== requestId) return
        if (message.framework && message.framework !== framework) return
        if (framework === 'vue' && message.componentName && message.componentName !== componentName)
          return
        if (
          framework === 'react' &&
          componentPath &&
          message.componentPath &&
          message.componentPath !== componentPath
        )
          return
        setIsRendered(true)
        setLoadError(null)
        return
      }

      if (message.type === 'PREVIEW_FAILED') {
        if (requestId && message.requestId !== requestId) return
        if (message.framework && message.framework !== framework) return
        setLoadError(message.message || 'Preview render failed')
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [componentName, componentPath, framework, previewOrigin, requestId])

  React.useEffect(() => {
    setIsReady(false)
    setIsRendered(false)
    setLoadError(null)
    setRequestId(`req-${Date.now()}-${requestIdRef.current++}`)
  }, [previewSrc])

  React.useEffect(() => {
    setIsRendered(false)
    setRequestId(`req-${Date.now()}-${requestIdRef.current++}`)
  }, [code, componentName, componentPath, framework])

  React.useEffect(() => {
    if (!isReady) return

    postLoadRequest()
    const retryTimer = window.setInterval(() => {
      if (!isRendered) postLoadRequest()
    }, 800)

    const stopTimer = window.setTimeout(() => {
      window.clearInterval(retryTimer)
      if (!isRendered) {
        setLoadError(`Preview did not respond in time (${framework})`)
      }
    }, 6000)

    return () => {
      window.clearInterval(retryTimer)
      window.clearTimeout(stopTimer)
    }
  }, [framework, isReady, isRendered, postLoadRequest])

  React.useEffect(() => {
    if (isReady) return

    const timer = window.setTimeout(() => {
      setLoadError(`Preview server is not ready: ${previewSrc}`)
    }, 6000)

    return () => window.clearTimeout(timer)
  }, [isReady, previewSrc])

  return (
    <div
      className={
        className || 'relative w-full min-h-[300px] rounded-lg border bg-background overflow-hidden'
      }
    >
      <iframe
        ref={iframeRef}
        src={previewSrc}
        className="w-full border-0"
        style={{ height: iframeHeight, minHeight: 200 }}
        sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
        title={`${framework} component preview`}
        onLoad={() => {
          if (isReady) postLoadRequest()
        }}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              {loadError || `Loading ${framework.toUpperCase()} preview...`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
