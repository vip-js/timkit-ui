import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Select from './select.vue'
import SelectTrigger from './select-trigger.vue'
import SelectValue from './select-value.vue'

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

const show = async (placeholder: string, valuePlaceholder?: string) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(Select, { placeholder }, () =>
        h(SelectValue, valuePlaceholder ? { placeholder: valuePlaceholder } : {})
      ),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

describe('vue select placeholder', () => {
  it('announces a required select', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Select, { required: true }, () => h(SelectTrigger, () => h(SelectValue))),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[role="combobox"]')?.getAttribute('aria-required')).toBe('true')
  })

  it('names the trigger from aria-label and leaves an omitted name empty', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Select, () => h(SelectTrigger, { 'aria-label': 'Fruit' }, () => h(SelectValue))),
          h(Select, () => h(SelectTrigger, () => h(SelectValue))),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const triggers = host.querySelectorAll('[data-slot="select-trigger"]')
    expect(triggers[0]?.getAttribute('aria-label')).toBe('Fruit')
    expect(triggers[1]?.getAttribute('aria-label')).toBeNull()
  })

  it('shows the placeholder from the select root when nothing is selected', async () => {
    await show('Choose a fruit')
    expect(document.body.textContent).toContain('Choose a fruit')
  })

  it('lets the value placeholder override the root', async () => {
    await show('Choose a fruit', 'Pick one')
    expect(document.body.textContent).toContain('Pick one')
    expect(document.body.textContent).not.toContain('Choose a fruit')
  })
})
