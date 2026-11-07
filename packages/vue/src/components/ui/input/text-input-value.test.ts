import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Input from './input.vue'
import Textarea from '../textarea/textarea.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (component: object, props: Record<string, unknown>) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: () => h(component, props) })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  return host
}

const typeInto = (field: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
  setter?.call(field, value)
  field.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('vue text input value', () => {
  it('keeps typed text and ignores disabled or read-only changes', async () => {
    const seen: string[] = []
    const enabled = show(Input, {
      defaultValue: 'apple',
      onValueChange: (event: { detail: { value: string } }) => seen.push(event.detail.value),
    })
    await nextTick()
    const input = enabled.querySelector('input')
    if (!input) throw new Error('missing input')
    typeInto(input, 'pear')
    await nextTick()
    expect(input.value).toBe('pear')
    expect(seen).toEqual(['pear'])

    const blocked: string[] = []
    const disabledHost = show(Input, {
      defaultValue: 'apple',
      disabled: true,
      onValueChange: (event: { detail: { value: string } }) => blocked.push(event.detail.value),
    })
    await nextTick()
    const disabledInput = disabledHost.querySelector('input')
    if (!disabledInput) throw new Error('missing disabled input')
    typeInto(disabledInput, 'pear')
    await nextTick()
    expect(disabledInput.disabled).toBe(true)
    expect(disabledInput.value).toBe('apple')
    expect(blocked).toEqual([])

    const readOnlySeen: string[] = []
    const readOnlyHost = show(Textarea, {
      defaultValue: 'note',
      readOnly: true,
      onValueChange: (event: { detail: { value: string } }) => readOnlySeen.push(event.detail.value),
    })
    await nextTick()
    const textarea = readOnlyHost.querySelector('textarea')
    if (!textarea) throw new Error('missing textarea')
    typeInto(textarea, 'changed')
    await nextTick()
    expect(textarea.readOnly).toBe(true)
    expect(textarea.disabled).toBe(false)
    expect(textarea.value).toBe('note')
    expect(readOnlySeen).toEqual([])

    const frozen: string[] = []
    const frozenHost = show(Input, {
      defaultValue: 'apple',
      readOnly: true,
      onValueChange: (event: { detail: { value: string } }) => frozen.push(event.detail.value),
    })
    await nextTick()
    const frozenInput = frozenHost.querySelector('input')
    if (!frozenInput) throw new Error('missing read-only input')
    typeInto(frozenInput, 'pear')
    await nextTick()
    expect(frozenInput.readOnly).toBe(true)
    expect(frozenInput.disabled).toBe(false)
    expect(frozenInput.value).toBe('apple')
    expect(frozen).toEqual([])
  })

  it('stays empty when the model is null even if the default has text', async () => {
    const seen: string[] = []
    const host = show(Input, {
      modelValue: null,
      defaultValue: 'apple',
      onValueChange: (event: { detail: { value: string } }) => seen.push(event.detail.value),
    })
    await nextTick()
    const input = host.querySelector('input')
    if (!input) throw new Error('missing input')
    expect(input.value).toBe('')
    typeInto(input, 'pear')
    await nextTick()
    expect(input.value).toBe('')
    expect(seen).toEqual(['pear'])

    const areaSeen: string[] = []
    const areaHost = show(Textarea, {
      modelValue: null,
      defaultValue: 'note',
      onValueChange: (event: { detail: { value: string } }) => areaSeen.push(event.detail.value),
    })
    await nextTick()
    const textarea = areaHost.querySelector('textarea')
    if (!textarea) throw new Error('missing textarea')
    expect(textarea.value).toBe('')
    typeInto(textarea, 'changed')
    await nextTick()
    expect(textarea.value).toBe('')
    expect(areaSeen).toEqual(['changed'])
  })

  it('cuts typed text to maxLength and leaves an omitted max length alone', async () => {
    const seen: string[] = []
    const host = show(Input, {
      maxLength: 4,
      onValueChange: (event: { detail: { value: string } }) => seen.push(event.detail.value),
    })
    await nextTick()
    const input = host.querySelector('input')
    if (!input) throw new Error('missing input')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('0 of 4')
    expect(input.getAttribute('aria-describedby')).toBe(host.querySelector('[role="status"]')?.id)
    typeInto(input, 'pineapple')
    await nextTick()
    expect(input.value).toBe('pine')
    expect(seen).toEqual(['pine'])
    expect(host.querySelector('[role="status"]')?.textContent).toBe('4 of 4')

    const open = show(Input, { defaultValue: 'pineapple' })
    await nextTick()
    const openInput = open.querySelector('input')
    if (!openInput) throw new Error('missing open input')
    expect(openInput.value).toBe('pineapple')
    expect(openInput.maxLength).toBe(-1)
    expect(open.querySelector('[role="status"]')).toBeNull()
    expect(openInput.getAttribute('aria-describedby')).toBeNull()
  })

  it('keeps a password field masked and a number field numeric', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Input, { type: 'password', defaultValue: 'secret' }),
          h(Input, { type: 'number', defaultValue: '4' }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const fields = host.querySelectorAll('input')
    expect(fields[0]?.type).toBe('password')
    expect(fields[1]?.type).toBe('number')
  })

  it('reveals a password and masks it again', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Input, { type: 'password', defaultValue: 'secret' }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const field = host.querySelector('input') as HTMLInputElement
    const button = host.querySelector('[aria-label="Show password"]') as HTMLButtonElement
    expect(button.textContent?.trim()).toBe('Show password')
    expect(host.querySelector('[role="status"]')).toBeNull()
    button.click()
    await nextTick()
    expect(field.type).toBe('text')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Visible')
    expect(document.activeElement).toBe(field)
    const hide = host.querySelector('[aria-label="Hide password"]') as HTMLButtonElement
    expect(hide.textContent?.trim()).toBe('Hide password')
    hide.click()
    await nextTick()
    expect(field.type).toBe('password')
    expect(host.querySelector('[role="status"]')).toBeNull()
    expect(field.value).toBe('secret')
    const lockedHost = document.createElement('div')
    document.body.append(lockedHost)
    const lockedApp = createApp({
      render: () => h(Input, { type: 'password', defaultValue: 'secret', disabled: true }),
    })
    lockedApp.mount(lockedHost)
    mounted.push({ unmount: () => lockedApp.unmount(), host: lockedHost })
    await nextTick()
    expect(lockedHost.querySelector('[aria-label="Show password"]')).toBeNull()
  })

  it('announces a required field and leaves an omitted field optional', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [h(Input, { required: true }), h(Input), h(Textarea, { required: true }), h(Textarea)]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const fields = host.querySelectorAll('input, textarea')
    expect(fields[0]?.required).toBe(true)
    expect(fields[0]?.getAttribute('aria-required')).toBe('true')
    expect(fields[1]?.required).toBe(false)
    expect(fields[1]?.getAttribute('aria-required')).toBeNull()
    expect(fields[2]?.required).toBe(true)
    expect(fields[2]?.getAttribute('aria-required')).toBe('true')
    expect(fields[3]?.getAttribute('aria-required')).toBeNull()
  })

  it('cuts an existing value when maxLength becomes shorter', async () => {
    const seen: string[] = []
    const View = defineComponent({
      setup() {
        const max = ref<number | undefined>(undefined)
        return () =>
          h('div', [
            h(Input, {
              defaultValue: 'apple',
              maxLength: max.value,
              onValueChange: (event: { detail: { value: string } }) => seen.push(event.detail.value),
            }),
            h('button', { type: 'button', onClick: () => (max.value = 3) }, 'Limit'),
          ])
      },
    })
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(View)
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = host.querySelector('input')
    if (!input) throw new Error('missing input')
    expect(input.value).toBe('apple')
    ;[...host.querySelectorAll('button')]
      .find((button) => button.textContent === 'Limit')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(input.value).toBe('app')
    expect(seen).toEqual(['app'])
  })

  it('cuts textarea text to maxLength and leaves an omitted max length alone', async () => {
    const seen: string[] = []
    const host = show(Textarea, {
      maxLength: 4,
      onValueChange: (event: { detail: { value: string } }) => seen.push(event.detail.value),
    })
    await nextTick()
    const area = host.querySelector('textarea')
    if (!area) throw new Error('missing textarea')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('0 of 4')
    expect(area.getAttribute('aria-describedby')).toBe(host.querySelector('[role="status"]')?.id)
    typeInto(area, 'pineapple')
    await nextTick()
    expect(area.value).toBe('pine')
    expect(seen).toEqual(['pine'])
    expect(host.querySelector('[role="status"]')?.textContent).toBe('4 of 4')

    const open = show(Textarea, { defaultValue: 'pineapple' })
    await nextTick()
    const openArea = open.querySelector('textarea')
    if (!openArea) throw new Error('missing open textarea')
    expect(openArea.value).toBe('pineapple')
    expect(openArea.maxLength).toBe(-1)
    expect(open.querySelector('[role="status"]')).toBeNull()
    expect(openArea.getAttribute('aria-describedby')).toBeNull()
  })

  it('clears text and returns focus, and hides Clear when the field cannot change', async () => {
    const seen: string[] = []
    const host = show(Input, {
      defaultValue: 'apple',
      onValueChange: (event: { detail: { value: string } }) => seen.push(event.detail.value),
    })
    await nextTick()
    const input = host.querySelector('input') as HTMLInputElement
    const button = host.querySelector('[aria-label="Clear"]') as HTMLButtonElement
    expect(button.textContent?.trim()).toBe('Clear')
    button.click()
    await nextTick()
    expect(input.value).toBe('')
    expect(seen).toEqual([''])
    expect(document.activeElement).toBe(input)
    expect(host.querySelector('[aria-label="Clear"]')).toBeNull()
    const locked = show(Input, { defaultValue: 'apple', disabled: true })
    await nextTick()
    expect(locked.querySelector('[aria-label="Clear"]')).toBeNull()
    const frozen = show(Input, { defaultValue: 'apple', readOnly: true })
    await nextTick()
    expect(frozen.querySelector('[aria-label="Clear"]')).toBeNull()
    const file = show(Input, { type: 'file' })
    await nextTick()
    expect(file.querySelector('[aria-label="Clear"]')).toBeNull()
  })

  it('clears a textarea and returns focus', async () => {
    const seen: string[] = []
    const host = show(Textarea, {
      defaultValue: 'note',
      onValueChange: (event: { detail: { value: string } }) => seen.push(event.detail.value),
    })
    await nextTick()
    const area = host.querySelector('textarea') as HTMLTextAreaElement
    const button = host.querySelector('[aria-label="Clear"]') as HTMLButtonElement
    button.click()
    await nextTick()
    expect(area.value).toBe('')
    expect(seen).toEqual([''])
    expect(document.activeElement).toBe(area)
    expect(host.querySelector('[aria-label="Clear"]')).toBeNull()
    const locked = show(Textarea, { defaultValue: 'note', readOnly: true })
    await nextTick()
    expect(locked.querySelector('[aria-label="Clear"]')).toBeNull()
  })
})
