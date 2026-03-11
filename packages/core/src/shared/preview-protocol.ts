export const PREVIEW_PROTOCOL_VERSION = '1.0.0'

export type PreviewFramework = 'react' | 'vue' | 'html'
export type PreviewData =
  | string
  | number
  | boolean
  | null
  | undefined
  | PreviewData[]
  | { [key: string]: PreviewData }

export type LoadPreviewMessage = {
  type: 'LOAD_PREVIEW'
  version: typeof PREVIEW_PROTOCOL_VERSION
  requestId: string
  framework: PreviewFramework
  componentName?: string
  componentPath?: string
  props?: Record<string, PreviewData>
  code?: string
}

export type UpdatePropsMessage = {
  type: 'UPDATE_PROPS'
  version: typeof PREVIEW_PROTOCOL_VERSION
  requestId: string
  props?: Record<string, PreviewData>
}

export type PreviewReadyMessage = {
  type: 'PREVIEW_READY'
  version: typeof PREVIEW_PROTOCOL_VERSION
  framework: PreviewFramework
}

export type PreviewRenderedMessage = {
  type: 'PREVIEW_RENDERED'
  version: typeof PREVIEW_PROTOCOL_VERSION
  requestId: string
  framework: PreviewFramework
  componentName?: string
  componentPath?: string
}

export type PreviewFailedMessage = {
  type: 'PREVIEW_FAILED'
  version: typeof PREVIEW_PROTOCOL_VERSION
  requestId: string
  framework: PreviewFramework
  componentName?: string
  componentPath?: string
  message: string
}

export type LegacyComponentLoadedMessage = {
  type: 'COMPONENT_LOADED'
  componentName?: string
}

export type LegacyComponentFailedMessage = {
  type: 'COMPONENT_LOAD_FAILED'
  componentName?: string
}

export type PreviewIncomingMessage = LoadPreviewMessage | UpdatePropsMessage

export type PreviewOutgoingMessage =
  | PreviewReadyMessage
  | PreviewRenderedMessage
  | PreviewFailedMessage
  | LegacyComponentLoadedMessage
  | LegacyComponentFailedMessage

export const DEFAULT_PREVIEW_ALLOWED_ORIGINS = [
  'https://ui.timkit.cn',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3001',
  'http://localhost:3001',
  'http://127.0.0.1:3002',
  'http://localhost:3002',
] as const

type PreviewGuardInput = PreviewData | object | null | undefined

function isRecord(value: PreviewGuardInput): value is Record<string, PreviewData> {
  return typeof value === 'object' && value !== null
}

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

function isStringRecord(value: PreviewGuardInput): value is Record<string, PreviewData> {
  if (!isRecord(value)) return false
  return true
}

export function isPreviewFramework(value: PreviewData): value is PreviewFramework {
  return value === 'react' || value === 'vue' || value === 'html'
}

export function parsePreviewAllowedOrigins(
  value?: string | null,
  defaults: readonly string[] = DEFAULT_PREVIEW_ALLOWED_ORIGINS
): string[] {
  const fromEnv = (value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
  const merged = [...defaults, ...fromEnv]
  const normalized = merged
    .map((origin) => normalizeOrigin(origin))
    .filter((origin): origin is string => Boolean(origin))
  return Array.from(new Set(normalized))
}

export function isPreviewAllowedOrigin(origin: string, allowlist: readonly string[]): boolean {
  return allowlist.includes(origin)
}

export function resolvePreviewParentOrigin(
  referrer: string,
  allowlist: readonly string[]
): string | null {
  const parentOrigin = normalizeOrigin(referrer)
  if (!parentOrigin) return null
  if (!isPreviewAllowedOrigin(parentOrigin, allowlist)) return null
  return parentOrigin
}

export function isLoadPreviewMessage(
  value: object | null | undefined
): value is LoadPreviewMessage {
  if (!isRecord(value)) return false
  if (value.type !== 'LOAD_PREVIEW') return false
  if (value.version !== PREVIEW_PROTOCOL_VERSION) return false
  if (typeof value.requestId !== 'string' || !value.requestId) return false
  if (!isPreviewFramework(value.framework)) return false
  if (value.componentName !== undefined && typeof value.componentName !== 'string') return false
  if (value.componentPath !== undefined && typeof value.componentPath !== 'string') return false
  if (value.props !== undefined && !isStringRecord(value.props)) return false
  if (value.code !== undefined && typeof value.code !== 'string') return false
  return true
}

export function isUpdatePropsMessage(
  value: object | null | undefined
): value is UpdatePropsMessage {
  if (!isRecord(value)) return false
  if (value.type !== 'UPDATE_PROPS') return false
  if (value.version !== PREVIEW_PROTOCOL_VERSION) return false
  if (typeof value.requestId !== 'string' || !value.requestId) return false
  if (value.props !== undefined && !isStringRecord(value.props)) return false
  return true
}

export function isPreviewIncomingMessage(
  value: object | null | undefined
): value is PreviewIncomingMessage {
  return isLoadPreviewMessage(value) || isUpdatePropsMessage(value)
}

export function isPreviewOutgoingMessage(
  value: object | null | undefined
): value is PreviewOutgoingMessage {
  if (!isRecord(value) || typeof value.type !== 'string') return false

  if (value.type === 'COMPONENT_LOADED' || value.type === 'COMPONENT_LOAD_FAILED') {
    return value.componentName === undefined || typeof value.componentName === 'string'
  }

  if (value.version !== PREVIEW_PROTOCOL_VERSION) return false
  if (!isPreviewFramework(value.framework)) return false

  if (value.type === 'PREVIEW_READY') {
    return true
  }

  if (value.type === 'PREVIEW_RENDERED') {
    if (typeof value.requestId !== 'string' || !value.requestId) return false
    if (value.componentName !== undefined && typeof value.componentName !== 'string') return false
    if (value.componentPath !== undefined && typeof value.componentPath !== 'string') return false
    return true
  }

  if (value.type === 'PREVIEW_FAILED') {
    if (typeof value.requestId !== 'string' || !value.requestId) return false
    if (value.componentName !== undefined && typeof value.componentName !== 'string') return false
    if (value.componentPath !== undefined && typeof value.componentPath !== 'string') return false
    return typeof value.message === 'string'
  }

  return false
}
