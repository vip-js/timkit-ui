import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: Record<string, unknown>
  methods?: Record<string, (event?: { currentTarget?: { dataset?: { value?: string } } }) => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void }
}

const caches = new Map<string, ComponentDefinition>()

const loadDefinition = async (file: string) => {
  const cached = caches.get(file)
  if (cached) return cached
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, file)).href)
  if (!captured) throw new Error(`${file} was not registered`)
  caches.set(file, captured)
  return captured
}

const hostFor = async (file: string, properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition(file)
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
    triggerEvent() {},
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & Record<string, (event?: { currentTarget?: { dataset?: { value?: string } } }) => void>
}

describe('weapp open and select', () => {
  it('popover opens from the trigger and closes again', async () => {
    const host = await hostFor('popover/popover.ts')
    expect(host.data.opened).toBe(false)
    host.onTriggerTap()
    expect(host.data.opened).toBe(true)
    host.onCloseTap()
    expect(host.data.opened).toBe(false)
  })

  it('tooltip opens on press and ignores the press while disabled', async () => {
    const enabled = await hostFor('tooltip/index.ts', { openDelay: 0 })
    enabled.onTriggerLongPress()
    expect(enabled.data.opened).toBe(true)
    enabled.onTriggerTouchEnd()
    expect(enabled.data.opened).toBe(false)

    const disabled = await hostFor('tooltip/index.ts', { disabled: true, openDelay: 0 })
    disabled.onTriggerLongPress()
    expect(disabled.data.opened).toBe(false)
  })

  it('collapsible opens and closes, and ignores the trigger while disabled', async () => {
    const enabled = await hostFor('collapsible/collapsible.ts')
    enabled.onTriggerTap()
    expect(enabled.data.opened).toBe(true)
    enabled.onTriggerTap()
    expect(enabled.data.opened).toBe(false)

    const disabled = await hostFor('collapsible/collapsible.ts', { disabled: true })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
  })

  it('toggle group keeps one value, or both when multiple, and ignores a disabled press', async () => {
    const single = await hostFor('toggle-group/toggle-group.ts')
    single.onItemTap({ currentTarget: { dataset: { value: 'bold' } } })
    expect(single.data.selected).toEqual(['bold'])
    single.onItemTap({ currentTarget: { dataset: { value: 'italic' } } })
    expect(single.data.selected).toEqual(['italic'])

    const multiple = await hostFor('toggle-group/toggle-group.ts', { multiple: true })
    multiple.onItemTap({ currentTarget: { dataset: { value: 'bold' } } })
    multiple.onItemTap({ currentTarget: { dataset: { value: 'italic' } } })
    expect(multiple.data.selected).toEqual(['bold', 'italic'])

    const disabled = await hostFor('toggle-group/toggle-group.ts', { disabled: true })
    disabled.onItemTap({ currentTarget: { dataset: { value: 'bold' } } })
    expect(disabled.data.selected).toEqual([])
  })
})
