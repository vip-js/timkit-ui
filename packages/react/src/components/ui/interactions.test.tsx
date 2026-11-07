// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Checkbox } from './checkbox'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './dialog'
import { Form } from './form'
import { Input } from './input'
import { Label } from './label'
import { NumberField, NumberFieldInput } from './number-field'
import { SelectNative } from './select-native'
import { Switch } from './switch'
import { Textarea } from './textarea'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const mounted: Array<{ root: Root; host: HTMLElement }> = []

const mount = (node: ReactNode) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() => {
    root.render(node)
  })
  mounted.push({ root, host })
  return host
}

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
})

const flush = async () => {
  await act(async () => {
    await Promise.resolve()
    await Promise.resolve()
  })
}

const setInputValue = (input: HTMLInputElement, value: string) => {
  const tracker = (input as HTMLInputElement & { _valueTracker?: { setValue: (next: string) => void } })
    ._valueTracker
  tracker?.setValue('')
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('form controls', () => {
  it('validates an Input and a Checkbox before submit', async () => {
    const submitted: Array<Record<string, string>> = []
    mount(
      <Form
        fields={[
          {
            name: 'email',
            label: 'Email',
            rules: [
              { kind: 'required', message: 'Email is required' },
              { kind: 'email', message: 'Enter a valid email' },
            ],
          },
          {
            name: 'terms',
            label: 'Terms',
            rules: [{ kind: 'checked', message: 'Accept terms' }],
          },
        ]}
        onSubmit={(values) => submitted.push(values)}
      >
        {(api) => (
          <>
            <Label htmlFor="email">Email</Label>
            <Input type="email" {...api.text('email')} />
            {api.error('email') ? (
              <p id="email-error" role="alert">
                {api.error('email')}
              </p>
            ) : null}
            <Checkbox {...api.checked('terms')} aria-label="Terms" />
            {api.error('terms') ? (
              <p id="terms-error" role="alert">
                {api.error('terms')}
              </p>
            ) : null}
          </>
        )}
      </Form>
    )

    const form = document.querySelector('form')
    const email = document.querySelector('input[type="email"]') as HTMLInputElement
    act(() => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(document.body.textContent).toContain('Email is required')
    expect(document.body.textContent).toContain('Accept terms')
    expect(email.getAttribute('aria-invalid')).toBe('true')
    expect(email.getAttribute('aria-describedby')).toBe('email-error')
    const termsBox = document.querySelector('[data-slot="checkbox"]')
    expect(termsBox?.getAttribute('aria-invalid')).toBe('true')
    expect(termsBox?.getAttribute('aria-describedby')).toBe('terms-error')
    expect(submitted).toEqual([])

    await act(async () => {
      setInputValue(email, 'ada@example.com')
    })
    await flush()
    const terms = document.querySelector('[aria-label="Terms"]') as HTMLElement
    await act(async () => {
      terms.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      terms.click()
    })
    await flush()
    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(submitted, document.body.textContent ?? '').toEqual([
      { email: 'ada@example.com', terms: 'true' },
    ])
    expect(email.getAttribute('aria-invalid')).toBeNull()
    expect(document.querySelector('[data-slot="checkbox"]')?.getAttribute('aria-invalid')).toBeNull()
  })

  it('blocks a short name and submits once it has two characters', async () => {
    const submitted: Array<Record<string, string>> = []
    mount(
      <Form
        fields={[
          {
            name: 'name',
            label: 'Name',
            rules: [
              { kind: 'required', message: 'Name is required' },
              { kind: 'minLength', min: 2, message: 'Use at least 2 characters' },
            ],
          },
        ]}
        onSubmit={(values) => submitted.push(values)}
      >
        {(api) => (
          <>
            <Label htmlFor="name">Name</Label>
            <Input aria-label="Name" {...api.text('name')} />
            {api.error('name') ? (
              <p id="name-error" role="alert">
                {api.error('name')}
              </p>
            ) : null}
          </>
        )}
      </Form>
    )
    const form = document.querySelector('form')
    const name = document.querySelector('input') as HTMLInputElement
    await act(async () => {
      setInputValue(name, 'A')
    })
    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(submitted).toEqual([])
    expect(document.getElementById('name-error')?.textContent).toBe('Use at least 2 characters')
    expect(name.getAttribute('aria-invalid')).toBe('true')
    expect(name.getAttribute('aria-describedby')).toBe('name-error')
    await act(async () => {
      setInputValue(name, 'Ada')
    })
    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(submitted).toEqual([{ name: 'Ada' }])
    expect(name.getAttribute('aria-invalid')).toBeNull()
    expect(document.getElementById('name-error')).toBeNull()
  })

  it('ignores changes and submit while disabled', async () => {
    const submitted: Array<Record<string, string>> = []
    mount(
      <Form
        disabled
        fields={[{ name: 'name', label: 'Name', rules: [{ kind: 'required', message: 'Name is required' }] }]}
        onSubmit={(values) => submitted.push(values)}
      >
        {(api) => <Input aria-label="Name" {...api.text('name')} />}
      </Form>
    )
    const form = document.querySelector('form')
    const name = document.querySelector('input') as HTMLInputElement
    expect(name.disabled).toBe(true)
    await act(async () => {
      setInputValue(name, 'Ada')
    })
    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(name.value).toBe('')
    expect(submitted).toEqual([])
  })

  it('binds textarea, select, switch, and number field', async () => {
    const submitted: Array<Record<string, string>> = []
    mount(
      <Form
        fields={[
          { name: 'note', label: 'Note', rules: [{ kind: 'required', message: 'Note is required' }] },
          { name: 'fruit', label: 'Fruit', rules: [{ kind: 'required', message: 'Fruit is required' }] },
          { name: 'alerts', label: 'Alerts', rules: [{ kind: 'checked', message: 'Enable alerts' }] },
          { name: 'count', label: 'Count', rules: [{ kind: 'required', message: 'Count is required' }] },
        ]}
        onSubmit={(values) => submitted.push(values)}
      >
        {(api) => (
          <>
            <Textarea aria-label="Note" {...api.text('note')} />
            <SelectNative aria-label="Fruit" {...api.text('fruit')}>
              <option value="">Choose</option>
              <option value="apple">Apple</option>
            </SelectNative>
            <Switch aria-label="Alerts" {...api.checked('alerts')} />
            <NumberField id="count" aria-label="Count" value={api.number('count').value} onValueChange={api.number('count').onValueChange}>
              <NumberFieldInput
                aria-invalid={api.number('count')['aria-invalid']}
                aria-describedby={api.number('count')['aria-describedby']}
              />
            </NumberField>
            {api.error('note') ? (
              <p id="note-error" role="alert">
                {api.error('note')}
              </p>
            ) : null}
            {api.error('fruit') ? (
              <p id="fruit-error" role="alert">
                {api.error('fruit')}
              </p>
            ) : null}
            {api.error('alerts') ? (
              <p id="alerts-error" role="alert">
                {api.error('alerts')}
              </p>
            ) : null}
            {api.error('count') ? (
              <p id="count-error" role="alert">
                {api.error('count')}
              </p>
            ) : null}
          </>
        )}
      </Form>
    )

    const form = document.querySelector('form')
    act(() => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(document.body.textContent).toContain('Note is required')
    expect(document.body.textContent).toContain('Fruit is required')
    expect(document.body.textContent).toContain('Enable alerts')
    expect(document.body.textContent).toContain('Count is required')
    const note = document.querySelector('textarea') as HTMLTextAreaElement
    const fruit = document.querySelector('select') as HTMLSelectElement
    const alerts = document.querySelector('[data-slot="switch"]') as HTMLElement
    const count = document.querySelector('[data-slot="number-field"] input') as HTMLInputElement
    expect(note.getAttribute('aria-invalid')).toBe('true')
    expect(note.getAttribute('aria-describedby')).toBe('note-error')
    expect(fruit.getAttribute('aria-invalid')).toBe('true')
    expect(fruit.getAttribute('aria-describedby')).toBe('fruit-error')
    expect(alerts.getAttribute('aria-invalid')).toBe('true')
    expect(alerts.getAttribute('aria-describedby')).toBe('alerts-error')
    expect(count.getAttribute('aria-invalid')).toBe('true')
    expect(count.getAttribute('aria-describedby')).toBe('count-error')

    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set
      setter?.call(note, 'hello')
      note.dispatchEvent(new Event('input', { bubbles: true }))
      note.dispatchEvent(new Event('change', { bubbles: true }))
      fruit.value = 'apple'
      fruit.dispatchEvent(new Event('change', { bubbles: true }))
      alerts.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      alerts.click()
      count.focus()
    })
    await flush()
    await act(async () => {
      setInputValue(count, '3')
    })
    await flush()
    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(submitted, document.body.textContent ?? '').toEqual([
      { note: 'hello', fruit: 'apple', alerts: 'true', count: '3' },
    ])
    expect(note.getAttribute('aria-invalid')).toBeNull()
    expect(fruit.getAttribute('aria-invalid')).toBeNull()
    expect(alerts.getAttribute('aria-invalid')).toBeNull()
    expect(count.getAttribute('aria-invalid')).toBeNull()
  })
})

describe('dialog focus', () => {
  it('closes on Escape and returns focus to the trigger', async () => {
    mount(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Delete project</DialogTitle>
          <button type="button">Confirm</button>
        </DialogContent>
      </Dialog>
    )

    const trigger = document.querySelector('[data-slot="dialog-trigger"]') as HTMLButtonElement
    await act(async () => {
      trigger.focus()
      trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    await flush()
    expect(document.body.textContent, document.body.innerHTML).toContain('Delete project')

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    await flush()
    expect(document.body.textContent).not.toContain('Delete project')
    expect(document.activeElement).toBe(trigger)
  })
})
