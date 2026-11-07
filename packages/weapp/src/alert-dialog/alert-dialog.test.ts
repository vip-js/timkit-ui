import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { opened?: boolean; openStatus?: string; confirmed?: boolean }
  methods?: Record<string, () => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void }
}

let definitionCache: ComponentDefinition | null = null

const loadDefinition = async () => {
  if (definitionCache) return definitionCache
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, 'alert-dialog.ts')).href)
  if (!captured) throw new Error('alert dialog was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
    const events: string[] = []
    const payloads: Array<{ open?: boolean } | undefined> = []
    const host = {
    properties: { ...defaults, ...properties },
    data,
    events,
    payloads,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    triggerEvent(name: string, detail?: { open?: boolean }) {
      events.push(name)
      payloads.push(detail)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }) as typeof host & {
    onTriggerTap: () => void
    onTriggerKey: (event?: { detail?: { key?: string } }) => void
    onConfirmKey: (event?: { detail?: { key?: string } }) => void
    onBackdropTap: () => void
    onConfirmTap: () => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    payloads: Array<{ open?: boolean } | undefined>
  }
}

describe('weapp alert dialog', () => {
  it('marks the open surface as an alert dialog named by its title', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'alert-dialog.wxml'), 'utf8')
    expect(markup).toContain('role="button"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain('tabindex="0"')
    expect(markup).toContain('aria-haspopup="dialog"')
    expect(markup.match(/<text aria-hidden="true">×<\/text>/g)).toHaveLength(2)
    expect(markup).toContain('wx:if="{{showTrigger && (opened || api.open)}}"')
    expect(markup).toContain('wx:elif="{{showTrigger}}"')
    expect(markup.split('wx:elif="{{showTrigger}}"')[1].split('openStatus')[0]).not.toContain('aria-controls')
    expect(markup).toContain("aria-expanded=\"{{opened ? 'true' : 'false'}}\"")
    expect(markup).toContain('role="alertdialog"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('aria-modal="true"')
    expect(markup).toContain('wx:if="{{(opened || api.open) && title}}"')
    expect(markup).toContain('aria-labelledby="{{id}}-title"')
    expect(markup).toContain('aria-label="Alert dialog"')
    expect(markup).toContain('id="{{id}}-title"')
    expect(markup).toContain('role="heading"')
    expect(markup).toContain('aria-level="2"')
    expect(markup).toContain('aria-describedby="{{id}}-description"')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain("{{cancelText || 'Cancel'}}")
    expect(markup).toContain("{{confirmText || 'Confirm'}}")
  })

  it('starts open from the default and stays shut when open is false', async () => {
    const preset = await hostFor({ defaultOpen: true })
    expect(preset.data.opened).toBe(true)
    preset.onCancelTap()
    expect(preset.data.opened).toBe(false)

    const held = await hostFor({ open: false, defaultOpen: true })
    expect(held.data.opened).toBe(false)
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toBe('change')
    expect(held.payloads.at(-1)).toEqual({ open: true })
  })

  it('opens, confirms, and ignores a disabled dialog or the backdrop', async () => {
    const held = await hostFor({ open: false })
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toBe('change')
    expect(held.payloads.at(-1)).toEqual({ open: true })
    held.setProperty('open', true)
    expect(held.data.opened).toBe(true)
    held.onConfirmTap()
    expect(held.data.opened).toBe(true)
    expect(held.data.confirmed).toBe(true)
    expect(held.payloads.at(-1)).toEqual({ open: false })

    const host = await hostFor()
    expect(host.data.opened).toBe(false)
    expect(host.data.openStatus).toBe('')
    host.onTriggerTap()
    expect(host.data.opened).toBe(true)
    expect(host.data.openStatus).toBe('Opened')
    host.onBackdropTap()
    expect(host.data.opened).toBe(true)
    expect(host.data.confirmed).toBe(false)
    host.onConfirmTap()
    expect(host.data.opened).toBe(false)
    expect(host.data.openStatus).toBe('')
    expect(host.data.confirmed).toBe(true)
    expect(host.events).toContain('confirm')

    const escape = await hostFor({ defaultOpen: true })
    escape.onKey({ detail: { key: 'Escape' } })
    expect(escape.data.opened).toBe(false)
    const heldKey = await hostFor({ open: true })
    expect(heldKey.data.opened).toBe(true)
    heldKey.onKey({ detail: { key: 'Escape' } })
    expect(heldKey.data.opened).toBe(true)
    expect(heldKey.events.at(-1)).toBe('change')
    expect(heldKey.payloads.at(-1)).toEqual({ open: false })
    expect(heldKey.events).toContain('cancel')

    const disabled = await hostFor({ disabled: true })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
    disabled.onTriggerKey({ detail: { key: 'Enter' } })
    expect(disabled.data.opened).toBe(false)
    disabled.onConfirmTap()
    expect(disabled.data.confirmed).toBe(false)
    expect(disabled.events).toEqual([])
  })

  it('opens from Enter or Space and confirms from the keyboard', async () => {
    const host = await hostFor()
    host.onTriggerKey({ detail: { key: 'Enter' } })
    expect(host.data.opened).toBe(true)
    host.onConfirmKey({ detail: { key: ' ' } })
    expect(host.data.opened).toBe(false)
    expect(host.data.confirmed).toBe(true)
  })
})
