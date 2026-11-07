import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import SelectNative from './select-native.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (props: Record<string, unknown> = {}) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(SelectNative, props, {
        default: () => [h('option', { value: 'apple' }, 'Apple'), h('option', { value: 'pear' }, 'Pear')],
      }),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  return host
}

const change = (select: HTMLSelectElement, value: string) => {
  select.value = value
  select.dispatchEvent(new Event('change', { bubbles: true }))
}

describe('vue native select', () => {
  it('follows a later value and ignores changes while disabled', async () => {
    const value = ref('apple')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = 'pear') }, 'Pear'),
              h('button', { type: 'button', onClick: () => (value.value = '') }, 'Clear'),
              h(
                SelectNative,
                { modelValue: value.value, disabled: true },
                {
                  default: () => [
                    h('option', { value: 'apple' }, 'Apple'),
                    h('option', { value: 'pear' }, 'Pear'),
                  ],
                }
              ),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const select = host.querySelector('select')
    if (!select) throw new Error('missing select')
    expect(select.value).toBe('apple')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Option 1 of 2')
    change(select, 'pear')
    await nextTick()
    expect(select.value).toBe('apple')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Pear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(select.value).toBe('pear')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Option 2 of 2')
    press('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(select.value).toBe('')
    expect(host.querySelector('[role="status"]')).toBeNull()
  })

  it('replaces the selected value and ignores changes while disabled', async () => {
    const seen: Array<string | string[]> = []
    const enabled = show({
      defaultValue: 'apple',
      onChange: (value: string | string[]) => seen.push(value),
    })
    await nextTick()
    const select = enabled.querySelector('select')
    if (!select) throw new Error('missing select')
    expect(select.value).toBe('apple')
    change(select, 'pear')
    await nextTick()
    expect(select.value).toBe('pear')
    expect(seen).toEqual(['pear'])

    const disabledSeen: Array<string | string[]> = []
    const disabledHost = show({
      defaultValue: 'apple',
      disabled: true,
      onChange: (value: string | string[]) => disabledSeen.push(value),
    })
    await nextTick()
    const disabledSelect = disabledHost.querySelector('select')
    if (!disabledSelect) throw new Error('missing disabled select')
    expect(disabledSelect.disabled).toBe(true)
    change(disabledSelect, 'pear')
    await nextTick()
    expect(disabledSelect.value).toBe('apple')
    expect(disabledSeen).toEqual([])
  })

  it('stays empty when the model is null even if the default is apple', async () => {
    const seen: Array<string | string[]> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          SelectNative,
          {
            modelValue: null,
            defaultValue: 'apple',
            onChange: (value: string | string[]) => seen.push(value),
          },
          {
            default: () => [
              h('option', { value: '' }, 'None'),
              h('option', { value: 'apple' }, 'Apple'),
              h('option', { value: 'pear' }, 'Pear'),
            ],
          }
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const select = host.querySelector('select')
    if (!select) throw new Error('missing select')
    expect(select.value).toBe('')
    change(select, 'pear')
    await nextTick()
    expect(select.value).toBe('')
    expect(seen).toEqual(['pear'])
  })

  it('reads one selected option and how many are selected', async () => {
    const value = ref<string[]>(['apple'])
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = ['apple', 'pear']) }, 'Both'),
              h('button', { type: 'button', onClick: () => (value.value = []) }, 'Clear'),
              h(
                SelectNative,
                { multiple: true, modelValue: value.value },
                {
                  default: () => [
                    h('option', { value: 'apple' }, 'Apple'),
                    h('option', { value: 'pear' }, 'Pear'),
                  ],
                }
              ),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Option 1 of 2')
    press('Both')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(host.querySelector('[role="status"]')?.textContent).toBe('2 options selected')
    press('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(host.querySelector('[role="status"]')).toBeNull()
  })
})
