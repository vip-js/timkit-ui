import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Combobox from './combobox.vue'
import ComboboxContent from './combobox-content.vue'
import ComboboxInput from './combobox-input.vue'
import ComboboxItem from './combobox-item.vue'

const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}
Element.prototype.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

const apple = { label: 'Apple', value: 'apple' }
const pear = { label: 'Pear', value: 'pear' }
const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = async (loop?: boolean) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(Combobox, { ...(loop === undefined ? {} : { loop }), items: [apple, pear] }, () => [
        h(ComboboxInput),
        h(ComboboxContent, () => [h(ComboboxItem, { item: apple }, () => 'Apple'), h(ComboboxItem, { item: pear }, () => 'Pear')]),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

const press = async (key: string) => {
  const input = document.querySelector('[data-slot="combobox-input"]') as HTMLInputElement & {
    __vueParentComponent?: { vnode?: { props?: Record<string, unknown> } }
  }
  const instance = input.__vueParentComponent as { subTree?: { props?: Record<string, unknown> } } | undefined
  const props = instance?.subTree?.props ?? {}
  const handler = props.onKeydown ?? props.onKeyDown ?? props.onkeydown
  if (typeof handler !== 'function') throw new Error(Object.keys(props).sort().join(','))
  input.focus()
  const focus = props.onFocus
  if (typeof focus === 'function') focus(new FocusEvent('focus'))
  handler(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  await nextTick()
}

const highlighted = () => {
  const node = document.querySelector('[data-highlighted="true"]')
  if (node) return node.textContent ?? ''
  return ''
}

describe('vue combobox loop', () => {
  it('wraps from the first item to the last by default', async () => {
    await show()
    await press('ArrowDown')
    expect(highlighted()).toContain('Apple')
    await press('ArrowUp')
    expect(highlighted()).toContain('Pear')
  })

  it('stays on the first item when loop is off', async () => {
    await show(false)
    await press('ArrowDown')
    expect(highlighted()).toContain('Apple')
    await press('ArrowUp')
    expect(highlighted()).toContain('Apple')
    expect(highlighted()).not.toContain('Pear')
  })
})
