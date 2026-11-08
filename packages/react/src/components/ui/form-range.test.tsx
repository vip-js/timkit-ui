// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Form } from './form'
import type { FieldSpec } from '@timui/core'

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

describe('form number range', () => {
  it('blocks a number outside min and max and submits a number inside', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            {
              name: 'count',
              label: 'Count',
              rules: [
                { kind: 'min', min: 1, message: 'At least 1' },
                { kind: 'max', max: 10, message: 'At most 10' },
              ],
            },
          ]}
          onSubmit={(values) => seen.push(values)}
        >
          {(api) => (
            <>
              <input
                aria-label="Count"
                aria-invalid={api.number('count')['aria-invalid']}
                value={api.values.count}
                onChange={(event) => api.number('count').onValueChange(event)}
              />
              {api.error('count') ? <p role="alert">{api.error('count')}</p> : null}
              <button type="submit">Save</button>
            </>
          )}
        </Form>
      )
    )
    mounted.push({ root, host })
    const form = host.querySelector('form') as HTMLFormElement
    const input = host.querySelector('input') as HTMLInputElement
    const submit = async () => {
      await act(async () => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })
    }
    const type = async (value: string) => {
      await act(async () => {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
        setter?.call(input, value)
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      })
    }
    await submit()
    expect(seen).toEqual([{ count: '' }])
    await type('0')
    await submit()
    expect(host.textContent).toContain('At least 1')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    await type('11')
    await submit()
    expect(host.textContent).toContain('At most 10')
    await type('4')
    await submit()
    expect(seen.at(-1)).toEqual({ count: '4' })
    expect(input.getAttribute('aria-invalid')).toBeNull()
  })

  it('renders textarea, select, switch, and number fields', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const fields = [
      { name: 'note', label: 'Note', control: 'textarea', rules: [{ kind: 'required', message: 'Note is required' }] },
      {
        name: 'fruit',
        label: 'Fruit',
        control: 'select',
        options: [{ label: 'Apple', value: 'apple' }],
        rules: [{ kind: 'required', message: 'Fruit is required' }],
      },
      { name: 'alerts', label: 'Alerts', control: 'switch', rules: [{ kind: 'checked', message: 'Enable alerts' }] },
      { name: 'count', label: 'Count', control: 'number', rules: [{ kind: 'required', message: 'Count is required' }] },
    ] as unknown as FieldSpec[]
    act(() => {
      root.render(<Form fields={fields} onSubmit={(values) => seen.push(values)} />)
    })
    mounted.push({ root, host })
    expect(host.querySelector('textarea')).not.toBeNull()
    expect(host.querySelector('select')).not.toBeNull()
    expect(host.querySelector('[role="switch"]')).not.toBeNull()
    expect(host.querySelector('input[type="number"]')).not.toBeNull()
    const form = host.querySelector('form') as HTMLFormElement
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(host.querySelector('textarea')?.getAttribute('aria-required')).toBe('true')
    expect(host.querySelector('select')?.getAttribute('aria-required')).toBe('true')
    expect(host.querySelector('[role="switch"]')?.getAttribute('aria-required')).toBe('true')
    expect(host.querySelector('input[type="number"]')?.getAttribute('aria-required')).toBe('true')
    expect(host.querySelector('textarea')?.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(host.querySelector('textarea'))
    expect(host.querySelector('select')?.getAttribute('aria-describedby')).toBe('fruit-error')
    const setValue = async (selector: string, value: string) => {
      const node = host.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      await act(async () => {
        const prototype =
          node instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : node instanceof HTMLSelectElement
              ? HTMLSelectElement.prototype
              : HTMLInputElement.prototype
        const tracker = (node as HTMLElement & { _valueTracker?: { setValue: (value: string) => void } })._valueTracker
        tracker?.setValue('')
        Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(node, value)
        node.dispatchEvent(new Event('input', { bubbles: true }))
        node.dispatchEvent(new Event('change', { bubbles: true }))
      })
    }
    await setValue('textarea', 'hello')
    await setValue('select', 'apple')
    await setValue('input[type="number"]', '3')
    const alerts = host.querySelector('[role="switch"]') as HTMLInputElement
    await act(async () => {
      alerts.click()
    })
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen.at(-1)).toEqual({ note: 'hello', fruit: 'apple', alerts: 'true', count: '3' })
  })

  it('keeps a required radio empty until one option is chosen', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            {
              name: 'plan',
              label: 'Plan',
              control: 'radio',
              options: [
                { label: 'Free', value: 'free' },
                { label: 'Pro', value: 'pro' },
              ],
              rules: [{ kind: 'required', message: 'Choose a plan' }],
            } as FieldSpec,
          ]}
          onSubmit={(values) => seen.push(values)}
        />
      )
    )
    mounted.push({ root, host })
    const form = host.querySelector('form') as HTMLFormElement
    const group = host.querySelector('[role="radiogroup"]') as HTMLElement
    const submit = async () => {
      await act(async () => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })
    }
    await submit()
    expect(seen).toEqual([])
    expect(host.textContent).toContain('Choose a plan')
    expect(group.getAttribute('aria-invalid')).toBe('true')
    expect(group.getAttribute('aria-labelledby')).toBe('plan-label')
    expect(group.getAttribute('aria-label')).toBeNull()
    expect(host.querySelector('#plan-label')?.textContent).toBe('Plan')
    expect(document.activeElement).toBe(group)
    const pro = host.querySelector('input[value="pro"]') as HTMLInputElement
    await act(async () => {
      pro.click()
    })
    expect(pro.checked).toBe(true)
    await submit()
    expect(seen).toEqual([{ plan: 'pro' }])
  })

  it('uses an email input for an email rule and a password input for a password', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            {
              name: 'email',
              label: 'Email',
              rules: [{ kind: 'email', message: 'Enter a valid email' }],
            },
            {
              name: 'secret',
              label: 'Secret',
              control: 'password',
              rules: [{ kind: 'required', message: 'Secret is required' }],
            } as FieldSpec,
          ]}
          onSubmit={(values) => seen.push(values)}
        />
      )
    )
    mounted.push({ root, host })
    const email = host.querySelector('input[type="email"]') as HTMLInputElement
    const secret = host.querySelector('input[type="password"]') as HTMLInputElement
    expect(email).toBeTruthy()
    expect(secret).toBeTruthy()
    const form = host.querySelector('form') as HTMLFormElement
    const type = async (input: HTMLInputElement, value: string) => {
      await act(async () => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, value)
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      })
    }
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([])
    expect(document.activeElement).toBe(secret)
    await type(email, 'ada@example.com')
    await type(secret, 's3cret')
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ email: 'ada@example.com', secret: 's3cret' }])
  })

  it('reveals a password field and masks it again', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[{ name: 'secret', label: 'Secret', control: 'password' } as FieldSpec]}
          onSubmit={() => undefined}
        />
      )
    )
    mounted.push({ root, host })
    const secret = host.querySelector('input') as HTMLInputElement
    const show = host.querySelector('[aria-label="Show password"]') as HTMLButtonElement
    expect(show.textContent).toBe('Show password')
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(secret, 's3cret')
      secret.dispatchEvent(new Event('input', { bubbles: true }))
      secret.dispatchEvent(new Event('change', { bubbles: true }))
    })
    act(() => show.click())
    expect(secret.type).toBe('text')
    expect(secret.value).toBe('s3cret')
    expect(document.activeElement).toBe(secret)
    const hide = host.querySelector('[aria-label="Hide password"]') as HTMLButtonElement
    act(() => hide.click())
    expect(secret.type).toBe('password')
    const locked = document.createElement('div')
    document.body.append(locked)
    const lockedRoot = createRoot(locked)
    act(() =>
      lockedRoot.render(
        <Form fields={[{ name: 'secret', label: 'Secret', control: 'password' } as FieldSpec]} disabled onSubmit={() => undefined} />
      )
    )
    mounted.push({ root: lockedRoot, host: locked })
    expect(locked.querySelector('[aria-label="Show password"]')).toBeNull()
  })

  it('keeps a required date empty until a day is chosen', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            {
              name: 'day',
              label: 'Day',
              control: 'date',
              rules: [{ kind: 'required', message: 'Choose a day' }],
            } as FieldSpec,
          ]}
          onSubmit={(values) => seen.push(values)}
        />
      )
    )
    mounted.push({ root, host })
    const day = host.querySelector('input[type="date"]') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([])
    expect(day.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(day)
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(day, '2026-11-07')
      day.dispatchEvent(new Event('input', { bubbles: true }))
      day.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ day: '2026-11-07' }])
  })

  it('keeps a required time empty until a time is chosen', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            {
              name: 'when',
              label: 'When',
              control: 'time',
              rules: [{ kind: 'required', message: 'Choose a time' }],
            } as FieldSpec,
          ]}
          onSubmit={(values) => seen.push(values)}
        />
      )
    )
    mounted.push({ root, host })
    const when = host.querySelector('input[type="time"]') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([])
    expect(when.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(when)
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(when, '09:30')
      when.dispatchEvent(new Event('input', { bubbles: true }))
      when.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ when: '09:30' }])
  })

  it('blocks a day or time outside its bounds and allows an empty optional value', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            {
              name: 'day',
              label: 'Day',
              control: 'date',
              rules: [{ kind: 'dateMin', min: '2026-11-07', message: 'Too early' }],
            } as FieldSpec,
            {
              name: 'when',
              label: 'When',
              control: 'time',
              rules: [{ kind: 'timeMax', max: '17:00', message: 'Too late' }],
            } as FieldSpec,
          ]}
          onSubmit={(values) => seen.push(values)}
        />
      )
    )
    mounted.push({ root, host })
    const day = host.querySelector('input[type="date"]') as HTMLInputElement
    const when = host.querySelector('input[type="time"]') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    expect(day.min).toBe('2026-11-07')
    expect(when.max).toBe('17:00')
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ day: '', when: '' }])
    const fill = async (node: HTMLInputElement, value: string) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(node, value)
      node.dispatchEvent(new Event('input', { bubbles: true }))
      node.dispatchEvent(new Event('change', { bubbles: true }))
    }
    await act(async () => {
      await fill(day, '2026-11-06')
    })
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ day: '', when: '' }])
    expect(day.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(day)
    await act(async () => {
      await fill(day, '2026-11-07')
      await fill(when, '17:30')
    })
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(when.getAttribute('aria-invalid')).toBe('true')
    await act(async () => {
      await fill(when, '17:00')
    })
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([
      { day: '', when: '' },
      { day: '2026-11-07', when: '17:00' },
    ])
  })

  it('blocks a value that misses its pattern and allows an empty optional pattern', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            {
              name: 'code',
              label: 'Code',
              rules: [{ kind: 'pattern', pattern: '^[A-Z]{3}$', message: 'Use three letters' }],
            },
          ]}
          onSubmit={(values) => seen.push(values)}
        />
      )
    )
    mounted.push({ root, host })
    const code = host.querySelector('input') as HTMLInputElement
    expect(code.getAttribute('pattern')).toBe('^[A-Z]{3}$')
    const form = host.querySelector('form') as HTMLFormElement
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ code: '' }])
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(code, 'ab')
      code.dispatchEvent(new Event('input', { bubbles: true }))
      code.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ code: '' }])
    expect(code.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(code)
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(code, 'ABC')
      code.dispatchEvent(new Event('input', { bubbles: true }))
      code.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ code: '' }, { code: 'ABC' }])
  })

  it('blocks a confirmation that differs and checks it again when the other field changes', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            { name: 'secret', label: 'Secret' },
            {
              name: 'confirm',
              label: 'Confirm',
              rules: [{ kind: 'same', field: 'secret', message: 'Must match' }],
            },
          ]}
          onSubmit={(values) => seen.push(values)}
        />
      )
    )
    mounted.push({ root, host })
    const secret = host.querySelector('#secret') as HTMLInputElement
    const confirm = host.querySelector('#confirm') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    const type = async (input: HTMLInputElement, value: string) => {
      await act(async () => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, value)
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      })
    }
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ secret: '', confirm: '' }])
    await type(confirm, 'no')
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ secret: '', confirm: '' }])
    expect(confirm.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(confirm)
    await type(secret, 's3cret')
    await type(confirm, 's3cret')
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([
      { secret: '', confirm: '' },
      { secret: 's3cret', confirm: 's3cret' },
    ])
    await type(secret, 'other')
    expect(confirm.getAttribute('aria-invalid')).toBe('true')
  })

  it('describes a hint while the field is valid and keeps it with the error', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            {
              name: 'note',
              label: 'Note',
              hint: 'Use letters',
              rules: [
                { kind: 'required', message: 'Required' },
                { kind: 'maxLength', max: 4, message: 'Too long' },
              ],
            },
          ]}
          onSubmit={() => undefined}
        />
      )
    )
    mounted.push({ root, host })
    const note = host.querySelector('input') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    expect(host.querySelector('#note-hint')?.textContent).toBe('Use letters')
    expect(note.getAttribute('aria-describedby')).toBe('note-hint note-count')
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(note.getAttribute('aria-invalid')).toBe('true')
    expect(note.getAttribute('aria-describedby')).toBe('note-error note-hint note-count')
    expect(host.querySelector('#note-hint')?.textContent).toBe('Use letters')
    expect(host.querySelector('#note-error')?.textContent).toBe('Required')
  })

  it('cuts a form field to maxLength and reads the character count', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            { name: 'note', label: 'Note', rules: [{ kind: 'maxLength', max: 4, message: 'Too long' }] },
          ]}
          onSubmit={(values) => seen.push(values)}
        />
      )
    )
    mounted.push({ root, host })
    const note = host.querySelector('input') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    expect(host.querySelector('[role="status"]')?.textContent).toBe('0 of 4')
    expect(note.getAttribute('aria-describedby')).toBe('note-count')
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(note, 'pineapple')
      note.dispatchEvent(new Event('input', { bubbles: true }))
      note.dispatchEvent(new Event('change', { bubbles: true }))
    })
    expect(note.value).toBe('pine')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('4 of 4')
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ note: 'pine' }])
  })

  it('announces how many fields need attention after a failed submit', async () => {
    const seen: Array<Record<string, string>> = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Form
          fields={[
            { name: 'email', label: 'Email', rules: [{ kind: 'required', message: 'Email is required' }] },
            { name: 'name', label: 'Name', rules: [{ kind: 'required', message: 'Name is required' }] },
          ]}
          onSubmit={(values) => seen.push(values)}
        />
      )
    )
    mounted.push({ root, host })
    const form = host.querySelector('form') as HTMLFormElement
    expect(host.querySelector('[role="alert"]')).toBeNull()
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(host.querySelector('[role="alert"]')?.textContent).toBe('2 fields need attention: Email, Name')
    const name = host.querySelector('#name') as HTMLInputElement
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(name, 'Ada')
      name.dispatchEvent(new Event('input', { bubbles: true }))
      name.dispatchEvent(new Event('change', { bubbles: true }))
    })
    expect(host.querySelector('[role="alert"]')?.textContent).toBe('1 field needs attention: Email')
    const email = host.querySelector('#email') as HTMLInputElement
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(email, 'ada@example.com')
      email.dispatchEvent(new Event('input', { bubbles: true }))
      email.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(seen).toEqual([{ email: 'ada@example.com', name: 'Ada' }])
    expect(host.querySelector('[role="alert"]')).toBeNull()
  })
})
