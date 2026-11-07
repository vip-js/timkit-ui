import { createApp, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import { DateField, DateInput } from './datefield-rac.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const typeDate = async (value: string) => {
  const input = document.querySelector('input') as HTMLInputElement
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await nextTick()
}

describe('vue date field value', () => {
  it('reports the typed date through onValueChange', async () => {
    const changes: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(DateField, { onValueChange: (value: string) => changes.push(value) }, () => h(DateInput)),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    await typeDate('2026-11-07')
    expect(changes).toEqual(['2026-11-07'])
  })

  it('follows a later value and disables the input', async () => {
    const value = ref('2026-11-01')
    const disabled = ref(false)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(DateField, { value: value.value, disabled: disabled.value }, () => h(DateInput)),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = document.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('2026-11-01')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('2026-11-01')
    value.value = '2026-11-07'
    await nextTick()
    expect(input.value).toBe('2026-11-07')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('2026-11-07')
    value.value = ''
    await nextTick()
    expect(input.value).toBe('')
    expect(host.querySelector('[role="status"]')).toBeNull()
    disabled.value = true
    await nextTick()
    expect(input.disabled).toBe(true)
  })

  it('ignores typing while disabled', async () => {
    const changes: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(DateField, { disabled: true, onValueChange: (value: string) => changes.push(value) }, () =>
          h(DateInput)
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect((document.querySelector('input') as HTMLInputElement).disabled).toBe(true)
    await typeDate('2026-11-07')
    expect(changes).toEqual([])
  })

  it('stays empty when the input model is null even if the field has a date', async () => {
    const changes: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(DateField, { value: '2026-11-01' }, () =>
          h(DateInput, { modelValue: null, onChange: (value: string) => changes.push(value) })
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = document.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')
    await typeDate('2026-11-07')
    expect(input.value).toBe('')
    expect(changes).toEqual(['2026-11-07'])
  })

  it('ignores typing while read-only and stays focusable', async () => {
    const changes: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          DateField,
          { value: '2026-11-01', readOnly: true, onValueChange: (value: string) => changes.push(value) },
          () => h(DateInput)
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = document.querySelector('input') as HTMLInputElement
    expect(input.readOnly).toBe(true)
    expect(input.disabled).toBe(false)
    await typeDate('2026-11-07')
    expect(changes).toEqual([])
    expect(input.value).toBe('2026-11-01')
  })

  it('ignores a date outside min and max', async () => {
    const changes: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          DateField,
          { min: '2026-11-05', max: '2026-11-10', onValueChange: (value: string) => changes.push(value) },
          () => h(DateInput)
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = document.querySelector('input') as HTMLInputElement
    expect(input.min).toBe('2026-11-05')
    expect(input.max).toBe('2026-11-10')
    await typeDate('2026-11-01')
    expect(changes).toEqual([])
    await typeDate('2026-11-07')
    expect(changes).toEqual(['2026-11-07'])
  })
})
