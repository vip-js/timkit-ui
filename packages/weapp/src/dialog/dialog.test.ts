import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { opened?: boolean; openStatus?: string; api?: { open?: boolean } }
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
  await import(pathToFileURL(path.join(__dirname, 'dialog.ts')).href)
  if (!captured) throw new Error('dialog was not registered')
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
    onCloseTap: () => void
    onCloseKey: (event?: { detail?: { key?: string } }) => void
    onBackdropTap: () => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { open?: boolean } }>
  }
}

describe('weapp dialog', () => {
  it('marks the open surface as a modal dialog', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'dialog.wxml'), 'utf8')
    expect(markup).toContain('id="{{id}}-content"')
    expect(markup).toContain('role="dialog"')
    expect(markup).toContain("aria-modal=\"{{modal ? 'true' : 'false'}}\"")
    expect(markup).toContain('wx:if="{{modal}}"')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain('tabindex="0"')
    expect(markup).toContain('role="button"')
    expect(markup).toContain('aria-label="Close"')
    expect(markup.match(/<text aria-hidden="true">✕<\/text>/g)).toHaveLength(2)
    expect(markup).toContain('aria-labelledby="{{titleId}}"')
    expect(markup).toContain('wx:if="{{titleId}}"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Dialog'}}\"")
    expect(markup).toContain('wx:if="{{title}}"')
    expect(markup).toContain('id="{{titleId}}"')
    expect(markup).toContain('role="heading"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('aria-level="2"')
  })

  it('follows a later open value and stays closed while disabled', async () => {
    const host = await hostFor({ disabled: true })
    host.onTriggerTap()
    expect(host.data.opened).toBe(false)
    host.setProperty('open', true)
    expect(host.data.opened).toBe(true)
    host.setProperty('open', false)
    expect(host.data.opened).toBe(false)
  })

  it('starts open from the default and stays shut when open is false', async () => {
    const preset = await hostFor({ defaultOpen: true })
    expect(preset.data.opened).toBe(true)
    preset.onCloseTap()
    expect(preset.data.opened).toBe(false)

    const held = await hostFor({ open: false, defaultOpen: true })
    expect(held.data.opened).toBe(false)
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: true } })
  })

  it('closes on the shared Escape key', async () => {
    const enabled = await hostFor({ defaultOpen: true })
    expect(enabled.data.opened).toBe(true)
    enabled.onKey({ detail: { key: 'Escape' } })
    expect(enabled.data.opened).toBe(false)

    const held = await hostFor({ open: true })
    expect(held.data.opened).toBe(true)
    held.onKey({ detail: { key: 'Escape' } })
    expect(held.data.opened).toBe(true)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: false } })
  })

  it('opens, closes, and stays closed while disabled', async () => {
    const held = await hostFor({ open: false })
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: true } })
    held.setProperty('open', true)
    expect(held.data.opened).toBe(true)
    held.onCloseTap()
    expect(held.data.opened).toBe(true)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: false } })

    const enabled = await hostFor()
    expect(enabled.data.opened).toBe(false)
    expect(enabled.data.openStatus).toBe('')
    enabled.onTriggerTap()
    expect(enabled.data.opened).toBe(true)
    expect(enabled.data.openStatus).toBe('Opened')
    expect(enabled.data.api?.open).toBe(true)
    enabled.onCloseTap()
    expect(enabled.data.opened).toBe(false)
    expect(enabled.data.openStatus).toBe('')

    const disabled = await hostFor({ disabled: true })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
  })

  it('keeps a non-modal dialog open when the backdrop is pressed', async () => {
    const host = await hostFor({ defaultOpen: true, modal: false })
    expect(host.data.opened).toBe(true)
    host.onBackdropTap()
    expect(host.data.opened).toBe(true)
    expect(host.events).toEqual([])

    const modal = await hostFor({ defaultOpen: true })
    expect(modal.data.opened).toBe(true)
    modal.onBackdropTap()
    expect(modal.data.opened).toBe(false)

    const held = await hostFor({ open: true })
    held.onBackdropTap()
    expect(held.data.opened).toBe(true)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: false } })
  })

  it('closes from the Close button keyboard', async () => {
    const host = await hostFor({ defaultOpen: true })
    host.onCloseKey({ detail: { key: 'Enter' } })
    expect(host.data.opened).toBe(false)
    const again = await hostFor({ defaultOpen: true })
    again.onCloseKey({ detail: { key: ' ' } })
    expect(again.data.opened).toBe(false)
  })

  it('names the dialog from a title and falls back to aria-label', async () => {
    const titled = await hostFor({ title: 'Details' })
    expect(titled.data.title).toBe('Details')
    expect(titled.data.titleId).toBe('dialog-title')
    expect(titled.data.ariaLabel).toBe('')
    const named = await hostFor({ 'aria-label': 'Notice' })
    expect(named.data.title).toBe('')
    expect(named.data.titleId).toBe('')
    expect(named.data.ariaLabel).toBe('Notice')
    const plain = await hostFor()
    expect(plain.data.title).toBe('')
    expect(plain.data.ariaLabel).toBe('')
    plain.setProperty('title', 'Saved')
    expect(plain.data.titleId).toBe('dialog-title')
    expect(plain.data.ariaLabel).toBe('')
  })
})
