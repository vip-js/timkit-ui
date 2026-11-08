// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { TagsInput, TagsInputControl, TagsInputInput, TagsInputItem } from './tags-input'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (node: ReactNode) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() => root.render(node))
  mounted.push({ root, host })
}

function Editor({ disabled = false }: { disabled?: boolean }) {
  const [tags, setTags] = useState<string[]>([])
  return (
    <TagsInput disabled={disabled} onValueChange={(event) => setTags(event.detail.value)}>
      <TagsInputControl>
        {tags.map((tag, index) => (
          <TagsInputItem key={tag} index={index} value={tag} />
        ))}
        <TagsInputInput />
      </TagsInputControl>
    </TagsInput>
  )
}

const commit = async (input: HTMLInputElement, text: string) => {
  input.value = text
  const key = Object.keys(input).find((name) => name.startsWith('__reactProps'))
  const props = key
    ? (input as unknown as Record<string, Record<string, (event: object) => void>>)[key]
    : undefined
  if (!props?.onInput || !props.onKeyDown) throw new Error('missing tags input handlers')
  await act(async () => {
    props.onFocus?.({})
    await Promise.resolve()
  })
  await act(async () => {
    props.onInput({ currentTarget: input, target: input, nativeEvent: { inputType: 'insertText' } })
    await Promise.resolve()
  })
  await act(async () => {
    props.onKeyDown({
      key: 'Enter',
      defaultPrevented: false,
      preventDefault() {},
      currentTarget: input,
      target: input,
      nativeEvent: { isComposing: false },
    })
    await Promise.resolve()
  })
}

describe('tags input value', () => {
  it('follows a later value', async () => {
    function Harness() {
      const [tags, setTags] = useState(['apple'])
      return (
        <>
          <button type="button" onClick={() => setTags(['apple', 'pear'])}>
            Both
          </button>
          <button type="button" onClick={() => setTags(['pear'])}>
            Replace
          </button>
          <button type="button" onClick={() => setTags([])}>
            Clear
          </button>
          <TagsInput value={tags} onValueChange={(event) => setTags(event.detail.value)}>
            <TagsInputControl>
              {tags.map((tag, index) => (
                <TagsInputItem key={`${tag}-${index}`} index={index} value={tag} />
              ))}
              <TagsInputInput />
            </TagsInputControl>
          </TagsInput>
        </>
      )
    }
    show(<Harness />)
    expect(
      (document.querySelector('[data-slot="tags-input"] [data-part="input"]') as HTMLInputElement).getAttribute(
        'aria-label'
      )
    ).toBe('Add a tag')
    expect(document.body.textContent).toContain('apple')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('1 tag')
    const both = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Both')
    await act(async () => {
      both?.click()
    })
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2 tags')
    const replace = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Replace')
    await act(async () => {
      replace?.click()
    })
    expect(document.body.textContent).toContain('pear')
    expect(document.body.textContent).not.toContain('apple')
    const clear = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Clear')
    await act(async () => {
      clear?.click()
    })
    expect([...document.querySelectorAll('[data-slot="tags-input"] [data-part="item-preview"]')].map((node) => node.textContent)).not.toContain('pear')
    expect(document.querySelector('[role="status"]')).toBeNull()
    const input = document.querySelector('[data-slot="tags-input"] [data-part="input"]') as HTMLInputElement
    await commit(input, 'plum')
    expect(document.body.textContent).toContain('plum')
    expect(document.body.textContent).not.toContain('pear')
    expect(document.body.textContent).not.toContain('apple')
  })

  it('adds a tag on enter and ignores a disabled input', async () => {
    show(
      <>
        <Editor />
        <Editor disabled />
      </>
    )
    const input = (index: number) =>
      document.querySelectorAll('[data-slot="tags-input"]')[index]?.querySelector('[data-part="input"]') as HTMLInputElement
    await commit(input(0), 'pear')
    expect(document.querySelector('[data-slot="tags-input"]')?.textContent).toContain('pear')
    expect((input(1) as HTMLInputElement).disabled).toBe(true)
    await commit(input(1), 'apple')
    expect(document.body.textContent).not.toContain('apple')
  })

  it('highlights the last tag before Backspace removes it', async () => {
    show(<Editor />)
    const input = document.querySelector('[data-slot="tags-input"] [data-part="input"]') as HTMLInputElement
    await commit(input, 'pear')
    const backspace = () => {
      const field = document.querySelector('[data-slot="tags-input"] [data-part="input"]') as HTMLInputElement
      const key = Object.keys(field).find((name) => name.startsWith('__reactProps'))
      const props = (field as unknown as Record<string, Record<string, (event: object) => void>>)[key ?? '']
      return act(async () => {
        field.focus()
        props.onFocus?.({})
        await Promise.resolve()
        field.value = ''
        field.setSelectionRange(0, 0)
        props.onKeyDown({
          key: 'Backspace',
          defaultPrevented: false,
          preventDefault() {},
          currentTarget: field,
          target: field,
          nativeEvent: { isComposing: false },
        })
        await Promise.resolve()
      })
    }
    const field = document.querySelector('[data-slot="tags-input"] [data-part="input"]') as HTMLInputElement
    const key = Object.keys(field).find((name) => name.startsWith('__reactProps'))
    const props = (field as unknown as Record<string, Record<string, (event: object) => void>>)[key ?? '']
    await act(async () => {
      field.focus()
      props.onFocus?.({})
      await Promise.resolve()
      field.value = 'a'
      field.setSelectionRange(1, 1)
      props.onKeyDown({
        key: 'Backspace',
        defaultPrevented: false,
        preventDefault() {},
        currentTarget: field,
        target: field,
        nativeEvent: { isComposing: false },
      })
      await Promise.resolve()
    })
    expect(document.body.textContent).toContain('pear')
    expect(document.querySelector('[data-highlighted]')).toBeNull()
    await backspace()
    expect(document.body.textContent).toContain('pear')
    expect(document.querySelector('[data-highlighted]')).toBeTruthy()
    await backspace()
    expect(document.body.textContent).not.toContain('pear')
  })
})
