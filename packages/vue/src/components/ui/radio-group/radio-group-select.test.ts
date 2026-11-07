import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import RadioGroup from './radio-group.vue'
import RadioGroupItem from './radio-group-item.vue'

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

const show = async (disabled = false) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(RadioGroup, { disabled }, () => [
        h(RadioGroupItem, { value: 'apple' }),
        h(RadioGroupItem, { value: 'pear' }),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

const checkedValues = () =>
  [...document.querySelectorAll<HTMLElement>('[data-slot="radio-group-item"]')]
    .filter((item) => item.getAttribute('data-state') === 'checked')
    .map((item) => item.querySelector('input')?.getAttribute('value'))

const clickValue = async (value: string) => {
  const input = document.querySelector(`input[value="${value}"]`) as HTMLInputElement
  input.click()
  await nextTick()
  await nextTick()
}

describe('vue radio group selection', () => {
  it('follows a later value and ignores a disabled selection', async () => {
    const value = ref('')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = 'pear') }, 'Pear'),
              h('button', { type: 'button', onClick: () => (value.value = '') }, 'Clear'),
              h(RadioGroup, { value: value.value, disabled: true }, () => [
                h(RadioGroupItem, { value: 'apple' }),
                h(RadioGroupItem, { value: 'pear' }),
              ]),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    await clickValue('apple')
    expect(checkedValues()).toEqual([])
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Pear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(checkedValues()).toEqual(['pear'])
    expect(document.querySelector('[data-state="checked"] svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Option 2 of 2')
    press('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(checkedValues()).toEqual([])
    expect(host.querySelector('[role="status"]')).toBeNull()
  })

  it('clears when the model is set to null', async () => {
    const value = ref<string | null>('pear')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = null) }, 'Clear'),
              h(
                RadioGroup,
                {
                  modelValue: value.value,
                  'onUpdate:modelValue': (next: string | null) => {
                    value.value = next
                  },
                },
                () => [
                h(RadioGroupItem, { value: 'apple' }),
                h(RadioGroupItem, { value: 'pear' }),
              ]),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(checkedValues()).toEqual(['pear'])
    const press = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Clear')
    press?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(checkedValues()).toEqual([])
    await clickValue('apple')
    expect(checkedValues()).toEqual(['apple'])
  })

  it('keeps one selected value', async () => {
    await show()
    await clickValue('apple')
    expect(checkedValues()).toEqual(['apple'])
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Option 1 of 2')
    await clickValue('pear')
    expect(checkedValues()).toEqual(['pear'])
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Option 2 of 2')
  })

  it('ignores selection while disabled', async () => {
    await show(true)
    await clickValue('apple')
    expect(checkedValues()).toEqual([])
  })

  it('ignores selection while read-only', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(RadioGroup, { readOnly: true, value: 'apple' }, () => [
          h(RadioGroupItem, { value: 'apple' }),
          h(RadioGroupItem, { value: 'pear' }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(checkedValues()).toEqual(['apple'])
    await clickValue('pear')
    expect(checkedValues()).toEqual(['apple'])
  })

  it('stays empty when the model is null even if the default is apple', async () => {
    const seen: Array<string | null> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          RadioGroup,
          {
            modelValue: null,
            defaultValue: 'apple',
            onChange: (value: string | null) => seen.push(value),
          },
          () => [h(RadioGroupItem, { value: 'apple' }), h(RadioGroupItem, { value: 'pear' })]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(checkedValues()).toEqual([])
    await clickValue('pear')
    expect(checkedValues()).toEqual([])
    expect(seen).toEqual(['pear'])
  })

  it('is vertical unless orientation is horizontal', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(RadioGroup, () => h(RadioGroupItem, { value: 'apple' })),
          h(RadioGroup, { orientation: 'horizontal' }, () => h(RadioGroupItem, { value: 'pear' })),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const groups = host.querySelectorAll('[role="radiogroup"]')
    expect(groups[0]?.getAttribute('aria-orientation')).toBe('vertical')
    expect(groups[1]?.getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('announces a required group and leaves an omitted group optional', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(RadioGroup, { required: true }, () => h(RadioGroupItem, { value: 'apple' })),
          h(RadioGroup, () => h(RadioGroupItem, { value: 'pear' })),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const groups = host.querySelectorAll('[role="radiogroup"]')
    expect(groups[0]?.getAttribute('aria-required')).toBe('true')
    expect(groups[1]?.getAttribute('aria-required')).toBeNull()
  })

  it('names the group from aria-label and uses Radio group when omitted', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(RadioGroup, { 'aria-label': 'Fruit' }, () => h(RadioGroupItem, { value: 'apple' })),
          h(RadioGroup, () => h(RadioGroupItem, { value: 'pear' })),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const groups = host.querySelectorAll('[role="radiogroup"]')
    expect(groups[0]?.getAttribute('aria-label')).toBe('Fruit')
    expect(groups[1]?.getAttribute('aria-label')).toBe('Radio group')
  })

  it('selects the next enabled item whose label starts with a letter', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(RadioGroup, () => [
            h(RadioGroupItem, { value: 'apple', disabled: true }, () => 'Apple'),
            h(RadioGroupItem, { value: 'pear' }, () => 'Pear'),
            h(RadioGroupItem, { value: 'plum' }, () => 'Plum'),
            h(RadioGroupItem, { value: 'peach' }, () => 'Peach'),
          ]),
          h(RadioGroup, { readOnly: true }, () => [h(RadioGroupItem, { value: 'pear' }, () => 'Pear')]),
          h(RadioGroup, { disabled: true }, () => [h(RadioGroupItem, { value: 'pear' }, () => 'Pear')]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const groups = () => host.querySelectorAll('[role="radiogroup"]')
    const press = async (index: number, key: string) => {
      const group = groups()[index] as HTMLElement & {
        __vueParentComponent?: { subTree?: { props?: Record<string, unknown> } }
      }
      const vnodeProps = group.__vueParentComponent?.subTree?.props ?? {}
      const handler = vnodeProps.onKeydown ?? vnodeProps.onKeyDown
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      Object.defineProperty(event, 'currentTarget', { value: group })
      if (typeof handler === 'function') handler(event)
      else group.dispatchEvent(event)
      await nextTick()
      await Promise.resolve()
    }
    await press(0, 'p')
    expect(checkedValues()).toEqual(['pear'])
    await press(0, 'p')
    expect(checkedValues()).toEqual(['plum'])
    await press(0, 'p')
    expect(checkedValues()).toEqual(['peach'])
    await press(0, 'z')
    expect(checkedValues()).toEqual(['peach'])
    await press(1, 'p')
    await press(2, 'p')
    expect(checkedValues()).toEqual(['peach'])
  })
})
