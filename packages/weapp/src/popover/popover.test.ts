import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { opened?: boolean; openStatus?: string; api?: { open?: boolean; setOpen?: (open: boolean) => void } }
  methods?: Record<string, () => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void; detached?: () => void }
}

let definitionCache: ComponentDefinition | null = null

const loadDefinition = async () => {
  if (definitionCache) return definitionCache
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, 'popover.ts')).href)
  if (!captured) throw new Error('popover was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const host = {
    properties: { ...defaults, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    events: [] as Array<{ name: string; detail?: { open?: boolean } }>,
    triggerEvent(name: string, detail?: { open?: boolean }) {
      host.events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & {
    onTriggerTap: () => void
    onTriggerKey: (event?: { detail?: { key?: string } }) => void
    onCloseTap: () => void
    onCloseKey: (event?: { detail?: { key?: string } }) => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { open?: boolean } }>
  }
}

describe('weapp popover', () => {
  it('marks the open surface as a dialog', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'popover.wxml'), 'utf8')
    expect(markup).toContain('id="{{id}}-content"')
    expect(markup).toContain('role="button"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain('tabindex="0"')
    expect(markup).toContain('aria-haspopup="dialog"')
    expect(markup).toContain('wx:if="{{opened}}"')
    expect(markup).toContain('aria-controls="{{id}}-content"')
    expect(markup.split('wx:else')[1].split('popover-backdrop')[0]).not.toContain('aria-controls')
    expect(markup).toContain("aria-expanded=\"{{opened ? 'true' : 'false'}}\"")
    expect(markup).toContain('role="status"')
    expect(markup).toContain('role="dialog"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Popover'}}\"")
    expect(markup).toContain("aria-modal=\"{{modal ? 'true' : 'false'}}\"")
    expect(markup).toContain('wx:if="{{opened && modal}}"')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain('aria-label="Close"')
    expect(markup).toContain('<text aria-hidden="true">×</text>')
    expect(markup).toContain('bindkeydown="onCloseKey"')
  })

  it('starts open from the default and stays shut when open is false', async () => {
    const preset = await hostFor({ defaultOpen: true })
    expect(preset.data.opened).toBe(true)
    preset.onCloseKey({ detail: { key: 'Enter' } })
    expect(preset.data.opened).toBe(false)

    const held = await hostFor({ open: false, defaultOpen: true })
    expect(held.data.opened).toBe(false)
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: true } })
  })

  it('opens, closes, and ignores a disabled trigger', async () => {
    const enabled = await hostFor()
    expect(enabled.data.opened).toBe(false)
    expect(enabled.data.openStatus).toBe('')
    enabled.onTriggerTap()
    expect(enabled.data.opened).toBe(true)
    expect(enabled.data.openStatus).toBe('Opened')
    enabled.onTriggerTap()
    expect(enabled.data.opened).toBe(false)
    expect(enabled.data.openStatus).toBe('')

    const held = await hostFor({ open: false })
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: true } })
    held.setProperty('open', true)
    expect(held.data.opened).toBe(true)
    held.onCloseTap()
    expect(held.data.opened).toBe(true)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: false } })

    const escape = await hostFor({ defaultOpen: true })
    escape.onKey({ detail: { key: 'Escape' } })
    expect(escape.data.opened).toBe(false)
    const heldKey = await hostFor({ open: true })
    expect(heldKey.data.opened).toBe(true)
    heldKey.onKey({ detail: { key: 'Escape' } })
    expect(heldKey.data.opened).toBe(true)
    expect(heldKey.events.at(-1)).toEqual({ name: 'change', detail: { open: false } })

    const disabled = await hostFor({ disabled: true })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
    disabled.onTriggerKey({ detail: { key: 'Enter' } })
    expect(disabled.data.opened).toBe(false)
  })

  it('toggles from Enter and Space', async () => {
    const host = await hostFor()
    host.onTriggerKey({ detail: { key: 'Enter' } })
    expect(host.data.opened).toBe(true)
    host.onTriggerKey({ detail: { key: ' ' } })
    expect(host.data.opened).toBe(false)
  })
})
