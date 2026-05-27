'use client'

import * as React from 'react'
import type { ComponentType } from 'react'
import {
  DEFAULT_PREVIEW_ALLOWED_ORIGINS,
  isLoadPreviewMessage,
  isPreviewAllowedOrigin,
  isUpdatePropsMessage,
  parsePreviewAllowedOrigins,
  PREVIEW_PROTOCOL_VERSION,
  resolvePreviewParentOrigin,
  type LoadPreviewMessage,
  type PreviewData,
  type PreviewIncomingMessage,
} from '@timui/core/preview-protocol'

import { registryComponentManifest } from '@/registry/registry-manifest'

type RegistryComponentManifest = typeof registryComponentManifest
type RegistryComponentKey = keyof RegistryComponentManifest
type RegistryComponentLoader = RegistryComponentManifest[RegistryComponentKey]
type RegistryComponentLoaderModule = Awaited<ReturnType<RegistryComponentLoader>>

function hasManifestEntry(path: string): path is RegistryComponentKey {
  return Object.prototype.hasOwnProperty.call(registryComponentManifest, path)
}

export default function ReactPreviewRuntimePage() {
  const previewRootRef = React.useRef<HTMLDivElement | null>(null)
  const lastHeightRef = React.useRef(0)
  const [CurrentComponent, setCurrentComponent] = React.useState<ComponentType<
    Record<string, PreviewData>
  > | null>(null)
  const [componentProps, setComponentProps] = React.useState<Record<string, PreviewData>>({})
  const [loadMessage, setLoadMessage] = React.useState('Waiting for preview request...')
  const requestIdRef = React.useRef('')
  const allowedParentOrigins = React.useMemo(
    () => parsePreviewAllowedOrigins(process.env.NEXT_PUBLIC_PREVIEW_ALLOWED_ORIGINS),
    []
  )
  const parentOriginRef = React.useRef<string | null>(null)

  const resolveParentOrigin = React.useCallback(() => {
    if (parentOriginRef.current) return parentOriginRef.current
    const ancestorOrigin =
      typeof window !== 'undefined' ? window.location.ancestorOrigins?.[0] : undefined
    if (ancestorOrigin && isPreviewAllowedOrigin(ancestorOrigin, allowedParentOrigins)) {
      return ancestorOrigin
    }
    const sameOrigin = typeof window !== 'undefined' ? window.location.origin : ''
    if (sameOrigin && isPreviewAllowedOrigin(sameOrigin, allowedParentOrigins)) {
      return sameOrigin
    }
    return null
  }, [allowedParentOrigins])

  const postMessage = React.useCallback(
    (payload: Record<string, PreviewData>) => {
      const targetOrigin = resolveParentOrigin() || '*'
      window.parent.postMessage(payload, targetOrigin)
    },
    [resolveParentOrigin]
  )

  const emitResize = React.useCallback(() => {
    const height = Math.ceil(
      previewRootRef.current?.scrollHeight ||
        document.documentElement?.scrollHeight ||
        document.body?.scrollHeight ||
        0
    )
    if (!height || height === lastHeightRef.current) return
    lastHeightRef.current = height
    postMessage({ type: 'PREVIEW_RESIZE', height })
  }, [postMessage])

  const loadReactComponent = React.useCallback(
    async (message: LoadPreviewMessage) => {
      const componentPath = message.componentPath
      if (!componentPath || !hasManifestEntry(componentPath)) {
        const error = `No manifest entry for ${componentPath || 'unknown'}`
        setLoadMessage(error)
        postMessage({
          type: 'PREVIEW_FAILED',
          version: PREVIEW_PROTOCOL_VERSION,
          requestId: message.requestId,
          framework: 'react',
          componentName: message.componentName,
          componentPath,
          message: error,
        })
        return
      }

      try {
        const loader = registryComponentManifest[componentPath] as RegistryComponentLoader
        const mod = (await loader()) as RegistryComponentLoaderModule & {
          default?: ComponentType<Record<string, PreviewData>>
        }
        if (!mod.default) {
          throw new Error('Component module has no default export')
        }

        requestIdRef.current = message.requestId
        setComponentProps(message.props || {})
        setCurrentComponent(() => mod.default as ComponentType<Record<string, PreviewData>>)
        setLoadMessage('')

        postMessage({
          type: 'PREVIEW_RENDERED',
          version: PREVIEW_PROTOCOL_VERSION,
          requestId: message.requestId,
          framework: 'react',
          componentName: message.componentName,
          componentPath,
        })
        window.requestAnimationFrame(emitResize)
      } catch (error) {
        const messageText = String(error)
        setLoadMessage(`Failed to render React component: ${messageText}`)
        postMessage({
          type: 'PREVIEW_FAILED',
          version: PREVIEW_PROTOCOL_VERSION,
          requestId: message.requestId,
          framework: 'react',
          componentName: message.componentName,
          componentPath,
          message: messageText,
        })
      }
    },
    [emitResize, postMessage]
  )

  React.useEffect(() => {
    const referrerOrigin = resolvePreviewParentOrigin(document.referrer, allowedParentOrigins)
    const ancestorOrigin = window.location.ancestorOrigins?.[0]
    parentOriginRef.current =
      referrerOrigin ||
      (ancestorOrigin && isPreviewAllowedOrigin(ancestorOrigin, allowedParentOrigins)
        ? ancestorOrigin
        : null)

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return
      if (!isPreviewAllowedOrigin(event.origin, allowedParentOrigins)) return
      if (!parentOriginRef.current) {
        parentOriginRef.current = event.origin
      } else if (event.origin !== parentOriginRef.current) {
        return
      }

      const message = event.data as PreviewIncomingMessage | { type?: string }

      if (isLoadPreviewMessage(message)) {
        if (message.framework !== 'react') return
        loadReactComponent(message)
        return
      }

      if (isUpdatePropsMessage(message)) {
        if (requestIdRef.current && message.requestId !== requestIdRef.current) return
        setComponentProps(message.props || {})
      }
    }

    window.addEventListener('message', onMessage)
    const resizeObserver =
      'ResizeObserver' in window
        ? new ResizeObserver(() => window.requestAnimationFrame(emitResize))
        : null
    if (resizeObserver) {
      resizeObserver.observe(document.body)
    }

    postMessage({
      type: 'PREVIEW_READY',
      version: PREVIEW_PROTOCOL_VERSION,
      framework: 'react',
    })
    window.requestAnimationFrame(emitResize)

    return () => {
      window.removeEventListener('message', onMessage)
      resizeObserver?.disconnect()
    }
  }, [allowedParentOrigins, emitResize, loadReactComponent, postMessage])

  React.useEffect(() => {
    window.requestAnimationFrame(emitResize)
  }, [CurrentComponent, componentProps, emitResize])

  return (
    <div
      ref={previewRootRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {CurrentComponent ? (
        <CurrentComponent {...componentProps} />
      ) : (
        <p style={{ color: '#666' }}>{loadMessage}</p>
      )}
    </div>
  )
}
