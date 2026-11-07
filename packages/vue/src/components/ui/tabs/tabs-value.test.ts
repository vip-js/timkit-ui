import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Tabs from './tabs.vue'
import TabsContent from './tabs-content.vue'
import TabsList from './tabs-list.vue'
import TabsTrigger from './tabs-trigger.vue'

globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}

const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue tabs value', () => {
  it('follows a later value and ignores a disabled tab', async () => {
    const value = ref('account')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h(Tabs, { modelValue: value.value }, () => [
              h('button', { type: 'button', onClick: () => (value.value = 'billing') }, 'Next'),
              h('button', { type: 'button', onClick: () => (value.value = '') }, 'Clear'),
              h(TabsList, () => [
                h(TabsTrigger, { value: 'account' }, () => 'Account'),
                h(TabsTrigger, { value: 'billing' }, () => 'Billing'),
                h(TabsTrigger, { value: 'locked', disabled: true }, () => 'Locked'),
              ]),
              h(TabsContent, { value: 'account' }, () => 'Account panel'),
              h(TabsContent, { value: 'billing' }, () => 'Billing panel'),
              h(TabsContent, { value: 'locked' }, () => 'Locked panel'),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...host.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) => node.textContent?.includes(label)) as HTMLButtonElement
    expect(host.textContent).toContain('Account panel')
    expect(host.textContent).not.toContain('Billing panel')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Tab 1 of 3')
    trigger('Locked').click()
    await nextTick()
    expect(host.textContent).toContain('Account panel')
    expect(host.textContent).not.toContain('Locked panel')
    const next = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Next')
    next?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(host.textContent).toContain('Billing panel')
    expect(host.textContent).not.toContain('Account panel')
    expect(trigger('Billing').getAttribute('aria-selected')).toBe('true')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Tab 2 of 3')
    const clear = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Clear')
    clear?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(host.textContent).not.toContain('Billing panel')
    expect(host.textContent).not.toContain('Account panel')
    expect(trigger('Billing').getAttribute('aria-selected')).toBe('false')
    expect(host.querySelector('[role="status"]')).toBeNull()
  })

  it('selects a tab and ignores a disabled tab', async () => {
    const seen: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Tabs, { defaultValue: 'account', onChange: (value: string) => seen.push(value) }, () => [
          h(TabsList, () => [
            h(TabsTrigger, { value: 'account' }, () => 'Account'),
            h(TabsTrigger, { value: 'billing' }, () => 'Billing'),
            h(TabsTrigger, { value: 'locked', disabled: true }, () => 'Locked'),
          ]),
          h(TabsContent, { value: 'account' }, () => 'Account panel'),
          h(TabsContent, { value: 'billing' }, () => 'Billing panel'),
          h(TabsContent, { value: 'locked' }, () => 'Locked panel'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(host.textContent).toContain('Account panel')
    trigger('Billing').click()
    await nextTick()
    expect(host.textContent).toContain('Billing panel')
    expect(host.textContent).not.toContain('Account panel')
    expect(trigger('Billing').getAttribute('aria-selected')).toBe('true')
    const panel = document.querySelector('[role="tabpanel"]')
    expect(trigger('Billing').getAttribute('aria-controls')).toBe(panel?.id)
    expect(panel?.getAttribute('aria-labelledby')).toBe(trigger('Billing').id)
    trigger('Locked').click()
    await nextTick()
    expect(host.textContent).toContain('Billing panel')
    expect(host.textContent).not.toContain('Locked panel')
    expect(seen).toEqual(['billing'])
  })

  it('ignores tab changes while the group is disabled', async () => {
    const seen: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Tabs, { defaultValue: 'account', disabled: true, onChange: (value: string) => seen.push(value) }, () => [
          h(TabsList, () => [
            h(TabsTrigger, { value: 'account' }, () => 'Account'),
            h(TabsTrigger, { value: 'billing' }, () => 'Billing'),
          ]),
          h(TabsContent, { value: 'account' }, () => 'Account panel'),
          h(TabsContent, { value: 'billing' }, () => 'Billing panel'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(host.querySelector('[data-slot="tabs"]')?.getAttribute('aria-disabled')).toBe('true')
    trigger('Billing').click()
    await nextTick()
    expect(host.textContent).toContain('Account panel')
    expect(host.textContent).not.toContain('Billing panel')
    expect(trigger('Billing').disabled).toBe(true)
    expect(seen).toEqual([])
  })

  it('stays unselected when the model is null even if the default is account', async () => {
    const seen: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Tabs, { modelValue: null, defaultValue: 'account', onChange: (value: string) => seen.push(value) }, () => [
          h(TabsList, () => [
            h(TabsTrigger, { value: 'account' }, () => 'Account'),
            h(TabsTrigger, { value: 'billing' }, () => 'Billing'),
          ]),
          h(TabsContent, { value: 'account' }, () => 'Account panel'),
          h(TabsContent, { value: 'billing' }, () => 'Billing panel'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(host.textContent).not.toContain('Account panel')
    expect(trigger('Account').getAttribute('aria-selected')).toBe('false')
    trigger('Billing').click()
    await nextTick()
    expect(host.textContent).not.toContain('Billing panel')
    expect(trigger('Billing').getAttribute('aria-selected')).toBe('false')
    expect(seen).toEqual(['billing'])
  })

  it('reports the focused tab once', async () => {
    const seen: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Tabs, { defaultValue: 'account', onFocusChange: (value: string) => seen.push(value) }, () => [
          h(TabsList, () => [
            h(TabsTrigger, { value: 'account' }, () => 'Account'),
            h(TabsTrigger, { value: 'billing' }, () => 'Billing'),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    seen.length = 0
    const billing = [...document.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) =>
      node.textContent?.includes('Billing')
    ) as HTMLButtonElement
    billing.focus()
    await nextTick()
    expect(seen).toEqual(['billing'])
  })

  it('moves with Down when the tabs are vertical and ignores Right', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Tabs, { defaultValue: 'account', orientation: 'vertical' }, () => [
          h(TabsList, () => [
            h(TabsTrigger, { value: 'account' }, () => 'Account'),
            h(TabsTrigger, { value: 'billing' }, () => 'Billing'),
          ]),
          h(TabsContent, { value: 'account' }, () => 'Account panel'),
          h(TabsContent, { value: 'billing' }, () => 'Billing panel'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const list = host.querySelector('[role="tablist"]') as HTMLElement
    const selected = () =>
      [...host.querySelectorAll('[data-slot="tabs-trigger"]')].find(
        (node) => node.getAttribute('aria-selected') === 'true'
      )?.textContent
    expect(list.getAttribute('aria-orientation')).toBe('vertical')
    expect(list.getAttribute('data-orientation')).toBe('vertical')
    const instance = (list as HTMLElement & {
      __vueParentComponent?: { subTree?: { props?: Record<string, unknown> } }
    }).__vueParentComponent
    const bound = instance?.subTree?.props ?? {}
    const handler = bound.onKeydown ?? bound.onKeyDown ?? bound.onkeydown
    if (typeof handler !== 'function') throw new Error(Object.keys(bound).sort().join(','))
    const account = [...host.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) =>
      node.textContent?.includes('Account')
    ) as HTMLButtonElement
    account.focus()
    await nextTick()
    const press = async (key: string) => {
      handler({
        key,
        defaultPrevented: false,
        preventDefault() {},
        currentTarget: list,
        target: account,
      })
      await nextTick()
    }
    await press('ArrowRight')
    expect(selected()).toContain('Account')
    await press('ArrowDown')
    expect(selected()).toContain('Billing')
  })

  it('selects the first and last enabled tab with Home and End', async () => {
    const real = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
      callback(0)
      return 0
    }
    try {
      const host = document.createElement('div')
      document.body.append(host)
      const app = createApp({
        render: () =>
          h(Tabs, { defaultValue: 'billing' }, () => [
            h(TabsList, () => [
              h(TabsTrigger, { value: 'account' }, () => 'Account'),
              h(TabsTrigger, { value: 'locked', disabled: true }, () => 'Locked'),
              h(TabsTrigger, { value: 'billing' }, () => 'Billing'),
            ]),
            h(TabsContent, { value: 'account' }, () => 'Account panel'),
            h(TabsContent, { value: 'billing' }, () => 'Billing panel'),
          ]),
      })
      app.mount(host)
      mounted.push({ unmount: () => app.unmount(), host })
      await nextTick()
      const list = host.querySelector('[role="tablist"]') as HTMLElement
      const selected = () =>
        [...host.querySelectorAll('[data-slot="tabs-trigger"]')].find(
          (node) => node.getAttribute('aria-selected') === 'true'
        )?.textContent
      const instance = (list as HTMLElement & {
        __vueParentComponent?: { subTree?: { props?: Record<string, unknown> } }
      }).__vueParentComponent
      const bound = instance?.subTree?.props ?? {}
      const handler = bound.onKeydown ?? bound.onKeyDown ?? bound.onkeydown
      if (typeof handler !== 'function') throw new Error(Object.keys(bound).sort().join(','))
      const billing = [...host.querySelectorAll('[data-slot="tabs-trigger"]')].find((node) =>
        node.textContent?.includes('Billing')
      ) as HTMLButtonElement
      const press = async (key: string) => {
        handler({
          key,
          defaultPrevented: false,
          preventDefault() {},
          currentTarget: list,
          target: billing,
        })
        await nextTick()
      }
      expect(selected()).toContain('Billing')
      await press('Home')
      expect(selected()).toContain('Account')
      await press('End')
      expect(selected()).toContain('Billing')
    } finally {
      globalThis.requestAnimationFrame = real
    }
  })

  it('names the tab list from aria-label and uses Tabs when omitted', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Tabs, { defaultValue: 'account' }, () => [
            h(TabsList, { 'aria-label': 'Account sections' }, () =>
              h(TabsTrigger, { value: 'account' }, () => 'Account')
            ),
          ]),
          h(Tabs, { defaultValue: 'billing' }, () => [
            h(TabsList, () => h(TabsTrigger, { value: 'billing' }, () => 'Billing')),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const lists = host.querySelectorAll('[role="tablist"]')
    expect(lists[0]?.getAttribute('aria-label')).toBe('Account sections')
    expect(lists[1]?.getAttribute('aria-label')).toBe('Tabs')
  })
})
