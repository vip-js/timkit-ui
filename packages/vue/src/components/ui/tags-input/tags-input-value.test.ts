import { createApp, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import TagsInput from './tags-input.vue'
import TagsInputControl from './tags-input-control.vue'
import TagsInputInput from './tags-input-input.vue'
import TagsInputItem from './tags-input-item.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const commit = async (input: HTMLInputElement, text: string) => {
  input.focus()
  await Promise.resolve()
  await nextTick()
  input.value = text
  input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }))
  await nextTick()
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  await nextTick()
}

describe('vue tags input value', () => {
  it('follows a later value', async () => {
    const tags = ref(['apple'])
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      setup: () => ({ tags }),
      render: () =>
        h('div', [
          h(
            'button',
            {
              type: 'button',
              onClick: () => {
                tags.value = ['apple', 'pear']
              },
            },
            'Both'
          ),
          h(
            'button',
            {
              type: 'button',
              onClick: () => {
                tags.value = ['pear']
              },
            },
            'Replace'
          ),
          h('button', { type: 'button', onClick: () => (tags.value = []) }, 'Clear'),
          h(
            TagsInput,
            {
              value: tags.value,
              onChange: (value: string[]) => {
                tags.value = value
              },
            },
            () =>
              h(TagsInputControl, () => [
                ...tags.value.map((tag, index) => h(TagsInputItem, { key: `${tag}-${index}`, value: tag, index })),
                h(TagsInputInput),
              ])
          ),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[data-slot="tags-input-input"]')?.getAttribute('aria-label')).toBe('Add a tag')
    expect(host.textContent).toContain('apple')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('1 tag')
    document.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(host.querySelector('[role="status"]')?.textContent).toBe('2 tags')
    const replace = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Replace')
    replace?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(host.textContent).toContain('pear')
    expect(host.textContent).not.toContain('apple')
    const clear = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Clear')
    clear?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(host.textContent).not.toContain('pear')
    expect(host.querySelector('[role="status"]')).toBeNull()
    const input = host.querySelector('[data-part="input"]') as HTMLInputElement
    await commit(input, 'plum')
    expect(host.textContent).toContain('plum')
    expect(host.textContent).not.toContain('pear')
    expect(host.textContent).not.toContain('apple')
  })

  it('adds a tag on enter and ignores a disabled input', async () => {
    const tags = ref<string[]>([])
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      setup: () => ({ tags }),
      render: () =>
        h('div', [
          h(
            TagsInput,
            { onChange: (value: string[]) => (tags.value = value) },
            () =>
              h(TagsInputControl, () => [
                ...tags.value.map((tag, index) => h(TagsInputItem, { key: tag, value: tag, index })),
                h(TagsInputInput),
              ])
          ),
          h(TagsInput, { disabled: true }, () => h(TagsInputControl, () => h(TagsInputInput))),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = (index: number) =>
      document.querySelectorAll('[data-slot="tags-input"]')[index]?.querySelector('[data-part="input"]') as HTMLInputElement
    await commit(input(0), 'pear')
    await nextTick()
    expect(host.textContent).toContain('pear')
    expect(input(1).disabled).toBe(true)
    await commit(input(1), 'apple')
    expect(host.textContent).not.toContain('apple')
  })

  it('highlights the last tag before Backspace removes it', async () => {
    const tags = ref<string[]>([])
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      setup: () => ({ tags }),
      render: () =>
        h(
          TagsInput,
          { onChange: (value: string[]) => (tags.value = value) },
          () =>
            h(TagsInputControl, () => [
              ...tags.value.map((tag, index) => h(TagsInputItem, { key: tag, value: tag, index })),
              h(TagsInputInput),
            ])
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = host.querySelector('[data-part="input"]') as HTMLInputElement
    await commit(input, 'pear')
    await nextTick()
    const press = async () => {
      const field = host.querySelector('[data-part="input"]') as HTMLInputElement
      field.focus()
      await Promise.resolve()
      field.value = ''
      field.setSelectionRange(0, 0)
      field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }))
      await nextTick()
    }
    const typed = host.querySelector('[data-part="input"]') as HTMLInputElement
    typed.focus()
    await Promise.resolve()
    typed.value = 'a'
    typed.setSelectionRange(1, 1)
    typed.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }))
    await nextTick()
    expect(host.textContent).toContain('pear')
    expect(host.querySelector('[data-highlighted]')).toBeNull()
    await press()
    expect(host.textContent).toContain('pear')
    expect(host.querySelector('[data-highlighted]')).toBeTruthy()
    await press()
    expect(host.textContent).not.toContain('pear')
  })
})
