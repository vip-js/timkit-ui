import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import type { ControlState } from '@timui/core'

type ComponentDefinition = {
  data?: { control?: ControlState }
  methods?: Record<string, (event?: { mark?: { value?: string } }) => void>
  properties?: Record<string, { value?: unknown }>
}

const loaded = new Map<string, ComponentDefinition>()

const load = async (relativePath: string) => {
  const cached = loaded.get(relativePath)
  if (cached) return cached
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  const href = pathToFileURL(path.join(__dirname, relativePath)).href
  await import(href)
  if (!captured) throw new Error(`Component() was not called in ${relativePath}`)
  loaded.set(relativePath, captured)
  return captured
}

const hostFor = (definition: ComponentDefinition, properties: Record<string, unknown> = {}) => {
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) {
    defaults[key] = spec?.value
  }
  const host = {
    properties: { ...defaults, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      const observers = definition.observers ?? {}
      for (const key of Object.keys(update)) observers[key]?.call(host, update[key])
    },
    triggerEvent() {},
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & Record<string, (event?: Record<string, unknown>) => void>
}

describe('weapp open select disable', () => {
  it('select ignores open and select while disabled', async () => {
    const definition = await load('select/select.ts')
    const host = hostFor(definition, { disabled: true })
    host.onTriggerTap()
    expect(host.data.control?.open).toBe(false)
    host.onItemTap({ mark: { value: 'apple' } })
    expect(host.data.control?.selected).toBe('')
  })

  it('select opens and selects when enabled', async () => {
    const definition = await load('select/select.ts')
    const host = hostFor(definition, {
      disabled: false,
      items: [{ label: 'Apple', value: 'apple' }],
    })
    host.onTriggerTap()
    expect(host.data.control?.open).toBe(true)
    expect(host.data.api?.open).toBe(true)
    host.onItemTap({ mark: { value: 'apple' } })
    expect(host.data.control?.selected).toBe('apple')
    expect(host.data.api?.value).toEqual(['apple'])
  })

  it('dialog machine opens from the trigger and closes from the shared control', async () => {
    const definition = await load('dialog/dialog.ts')
    const host = hostFor(definition)
    const api = host.data.api as { open?: boolean; setOpen?: (open: boolean) => void }
    expect(api?.open).toBe(false)
    api?.setOpen?.(true)
    expect(host.data.api?.open).toBe(true)
    host.onCloseTap()
    expect(host.data.control?.open).toBe(false)
    expect(host.data.api?.open).toBe(false)
  })

  it('checkbox does not select while disabled', async () => {
    const definition = await load('checkbox/checkbox.ts')
    const host = hostFor(definition, { disabled: true })
    host.onTap()
    expect(host.data.control?.selected).toBe('')
    expect(host.data.api?.checked).toBe(false)
  })

  it('checkbox selects when enabled', async () => {
    const definition = await load('checkbox/checkbox.ts')
    const host = hostFor(definition, { disabled: false })
    host.onTap()
    expect(host.data.control?.selected).toBe('on')
    expect(host.data.api?.checked).toBe(true)
  })

  it('sheet close is ignored while disabled and closes when enabled', async () => {
    const definition = await load('sheet/sheet.ts')
    const disabled = hostFor(definition, { disabled: true })
    disabled.data.control = { open: true, selected: '', disabled: true }
    disabled.onCloseTap()
    expect(disabled.data.control?.open).toBe(true)
    const enabled = hostFor(definition, { disabled: false })
    const api = enabled.data.api as { open?: boolean; setOpen?: (open: boolean) => void }
    api.setOpen?.(true)
    expect(enabled.data.api?.open).toBe(true)
    enabled.onCloseTap()
    expect(enabled.data.control?.open).toBe(false)
    expect(enabled.data.api?.open).toBe(false)
  })

  it('menu ignores open and select while disabled', async () => {
    const definition = await load('dropdown-menu/dropdown-menu.ts')
    const host = hostFor(definition, { disabled: true })
    host.onTriggerTap()
    expect(host.data.control?.open).toBe(false)
    host.onItemTap({ currentTarget: { dataset: { value: 'item1' } } })
    expect(host.data.control?.selected).toBe('')
  })

  it('menu opens and selects when enabled', async () => {
    const definition = await load('dropdown-menu/dropdown-menu.ts')
    const host = hostFor(definition, { disabled: false })
    host.onTriggerTap()
    expect(host.data.control?.open).toBe(true)
    expect(host.data.api?.open).toBe(true)
    host.onItemTap({ currentTarget: { dataset: { value: 'item1' } } })
    expect(host.data.control?.selected).toBe('item1')
  })

  it('tabs and accordion select when enabled and ignore selection while disabled', async () => {
    const tabs = await load('tabs/index.ts')
    const enabledTabs = hostFor(tabs, { disabled: false })
    enabledTabs.handleTabClick({ currentTarget: { dataset: { value: 'account' } } })
    expect(enabledTabs.data.control?.selected).toBe('account')
    expect(enabledTabs.data.api?.value).toBe('account')
    const disabledTabs = hostFor(tabs, { disabled: true })
    disabledTabs.handleTabClick({ currentTarget: { dataset: { value: 'account' } } })
    expect(disabledTabs.data.control?.selected).toBe('')
    expect(disabledTabs.data.api?.value).toBeFalsy()

    const accordion = await load('accordion/accordion.ts')
    const enabledAccordion = hostFor(accordion, { disabled: false })
    enabledAccordion.onItemTap({ currentTarget: { dataset: { value: 'billing' } } })
    expect(enabledAccordion.data.control?.selected).toBe('billing')
    expect(enabledAccordion.data.api?.value).toEqual(['billing'])
    const disabledAccordion = hostFor(accordion, { disabled: true })
    disabledAccordion.onItemTap({ currentTarget: { dataset: { value: 'billing' } } })
    expect(disabledAccordion.data.control?.selected).toBe('')
    expect(disabledAccordion.data.api?.value ?? []).toEqual([])
  })

  it('switch and slider select when enabled and ignore changes while disabled', async () => {
    const switchDefinition = await load('switch/switch.ts')
    const enabledSwitch = hostFor(switchDefinition, { disabled: false })
    enabledSwitch.onSwitchChange({ detail: { value: true } })
    expect(enabledSwitch.data.control?.selected).toBe('true')
    const disabledSwitch = hostFor(switchDefinition, { disabled: true })
    disabledSwitch.onSwitchChange({ detail: { value: true } })
    expect(disabledSwitch.data.control?.selected).toBe('')

    const slider = await load('slider/slider.ts')
    const enabledSlider = hostFor(slider, { disabled: false })
    enabledSlider.onSliderChange({ detail: { value: 40 } })
    expect(enabledSlider.data.control?.selected).toBe('40')
    const disabledSlider = hostFor(slider, { disabled: true })
    disabledSlider.onSliderChange({ detail: { value: 40 } })
    expect(disabledSlider.data.control?.selected).toBe('')
  })
})
