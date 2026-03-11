import { describe, expect, it } from 'vitest'

import {
  DEFAULT_PREVIEW_ALLOWED_ORIGINS,
  isLoadPreviewMessage,
  isPreviewAllowedOrigin,
  isPreviewIncomingMessage,
  isPreviewOutgoingMessage,
  isUpdatePropsMessage,
  parsePreviewAllowedOrigins,
  PREVIEW_PROTOCOL_VERSION,
  resolvePreviewParentOrigin,
} from './preview-protocol'

describe('preview protocol runtime guards', () => {
  it('accepts valid LOAD_PREVIEW message', () => {
    const payload = {
      type: 'LOAD_PREVIEW',
      version: PREVIEW_PROTOCOL_VERSION,
      requestId: 'req-1',
      framework: 'vue',
      componentName: 'accordion-01',
      props: { size: 'sm' },
    }

    expect(isLoadPreviewMessage(payload)).toBe(true)
    expect(isPreviewIncomingMessage(payload)).toBe(true)
  })

  it('rejects LOAD_PREVIEW with invalid version', () => {
    const payload = {
      type: 'LOAD_PREVIEW',
      version: '0.0.0',
      requestId: 'req-1',
      framework: 'vue',
    }

    expect(isLoadPreviewMessage(payload)).toBe(false)
    expect(isPreviewIncomingMessage(payload)).toBe(false)
  })

  it('accepts valid UPDATE_PROPS message', () => {
    const payload = {
      type: 'UPDATE_PROPS',
      version: PREVIEW_PROTOCOL_VERSION,
      requestId: 'req-2',
      props: { disabled: true },
    }

    expect(isUpdatePropsMessage(payload)).toBe(true)
    expect(isPreviewIncomingMessage(payload)).toBe(true)
  })

  it('accepts valid PREVIEW_RENDERED response', () => {
    const payload = {
      type: 'PREVIEW_RENDERED',
      version: PREVIEW_PROTOCOL_VERSION,
      requestId: 'req-3',
      framework: 'react',
      componentPath: 'components/button',
    }

    expect(isPreviewOutgoingMessage(payload)).toBe(true)
  })

  it('rejects PREVIEW_FAILED response without message', () => {
    const payload = {
      type: 'PREVIEW_FAILED',
      version: PREVIEW_PROTOCOL_VERSION,
      requestId: 'req-3',
      framework: 'react',
    }

    expect(isPreviewOutgoingMessage(payload)).toBe(false)
  })

  it('parses origin allowlist with defaults and env overrides', () => {
    const allowlist = parsePreviewAllowedOrigins('http://example.com,http://localhost:3001')
    expect(allowlist).toContain('http://example.com')
    expect(allowlist).toContain('http://localhost:3001')
    expect(allowlist).toContain(DEFAULT_PREVIEW_ALLOWED_ORIGINS[0])
  })

  it('resolves parent origin only when allowlisted', () => {
    const allowlist = parsePreviewAllowedOrigins('http://example.com')
    expect(isPreviewAllowedOrigin('http://example.com', allowlist)).toBe(true)
    expect(resolvePreviewParentOrigin('http://example.com/path', allowlist)).toBe(
      'http://example.com'
    )
    expect(resolvePreviewParentOrigin('http://evil.com/path', allowlist)).toBeNull()
  })
})
