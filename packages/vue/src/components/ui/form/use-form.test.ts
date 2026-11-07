import { createApp, defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import NumberField from '../number-field/number-field.vue'
import NumberFieldIncrement from '../number-field/number-field-increment.vue'
import NumberFieldInput from '../number-field/number-field-input.vue'
import SelectNative from '../select/select-native.vue'
import Switch from '../switch/switch.vue'
import Textarea from '../textarea/textarea.vue'
import Form from './form.vue'
import { useForm } from './use-form'
import type { FieldSpec } from '@timui/core'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

const mounted: Array<() => void> = []

afterEach(() => {
  for (const unmount of mounted) unmount()
  mounted.length = 0
  document.body.innerHTML = ''
})

const FormView = defineComponent({
  setup() {
    const fields = [
      {
        name: 'email',
        label: 'Email',
        rules: [
          { kind: 'required' as const, message: 'Email is required' },
          { kind: 'email' as const, message: 'Enter a valid email' },
        ],
      },
      {
        name: 'terms',
        label: 'Terms',
        rules: [{ kind: 'checked' as const, message: 'Accept terms' }],
      },
    ]
    const form = useForm(fields)
    const onSubmit = () => {
      form.submit()
    }
    return () => {
      const email = form.field('email')
      return h('form', { onSubmit }, [
        h('input', {
          id: email.id,
          type: 'email',
          'aria-label': 'Email',
          'aria-invalid': email['aria-invalid'],
          'aria-describedby': email['aria-describedby'],
          onInput: (event: Event) => form.assign('email', event),
        }),
        form.snapshot.value.errors.email
          ? h('p', { id: 'email-error', role: 'alert' }, form.snapshot.value.errors.email)
          : null,
        h('input', {
          id: form.field('terms').id,
          type: 'checkbox',
          'aria-label': 'Accept terms',
          'aria-invalid': form.field('terms')['aria-invalid'],
          'aria-describedby': form.field('terms')['aria-describedby'],
          onChange: (event: Event) => form.assign('terms', event),
        }),
        form.snapshot.value.errors.terms
          ? h('p', { id: 'terms-error', role: 'alert' }, form.snapshot.value.errors.terms)
          : null,
        h('button', { type: 'submit' }, 'Create account'),
      ])
    }
  },
})

describe('vue form', () => {
  it('blocks submit until the fields are valid, then keeps the values', async () => {
    const el = document.createElement('div')
    document.body.append(el)
    const app = createApp(FormView)
    app.mount(el)
    mounted.push(() => app.unmount())

    const form = document.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(document.body.textContent).toContain('Email is required')
    expect(document.body.textContent).toContain('Accept terms')
    const invalid = document.querySelector('input[type="email"]') as HTMLInputElement
    expect(invalid.getAttribute('aria-invalid')).toBe('true')
    expect(invalid.getAttribute('aria-describedby')).toBe('email-error')
    expect(document.getElementById('email-error')?.textContent).toBe('Email is required')
    const termsBox = document.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(termsBox.getAttribute('aria-invalid')).toBe('true')
    expect(termsBox.getAttribute('aria-describedby')).toBe('terms-error')

    const email = document.querySelector('input[type="email"]') as HTMLInputElement
    const terms = document.querySelector('input[type="checkbox"]') as HTMLInputElement
    email.value = 'ada@example.com'
    email.dispatchEvent(new Event('input', { bubbles: true }))
    terms.checked = true
    terms.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(email.getAttribute('aria-invalid')).toBeNull()
    expect(terms.getAttribute('aria-invalid')).toBeNull()
    expect(document.body.textContent).not.toContain('Email is required')
    expect(document.body.textContent).not.toContain('Accept terms')
    expect(email.value).toBe('ada@example.com')
  })

  it('blocks a short name and submits once it has two characters', async () => {
    const seen: boolean[] = []
    const View = defineComponent({
      setup() {
        const form = useForm([
          {
            name: 'name',
            label: 'Name',
            rules: [
              { kind: 'required' as const, message: 'Name is required' },
              { kind: 'minLength' as const, min: 2, message: 'Use at least 2 characters' },
            ],
          },
        ])
        return () => {
          const name = form.field('name')
          return h('form', { onSubmit: () => seen.push(form.submit().ok) }, [
            h('input', {
              id: name.id,
              'aria-label': 'Name',
              'aria-invalid': name['aria-invalid'],
              'aria-describedby': name['aria-describedby'],
              onInput: (event: Event) => form.assign('name', event),
            }),
            form.snapshot.value.errors.name
              ? h('p', { id: 'name-error', role: 'alert' }, form.snapshot.value.errors.name)
              : null,
            h('button', { type: 'submit' }, 'Save'),
          ])
        }
      },
    })
    const el = document.createElement('div')
    document.body.append(el)
    const app = createApp(View)
    app.mount(el)
    mounted.push(() => app.unmount())
    const input = document.querySelector('input') as HTMLInputElement
    const form = document.querySelector('form') as HTMLFormElement
    input.value = 'A'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen.at(-1)).toBe(false)
    expect(document.getElementById('name-error')?.textContent).toBe('Use at least 2 characters')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('name-error')
    input.value = 'Ada'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen.at(-1)).toBe(true)
    expect(input.getAttribute('aria-invalid')).toBeNull()
    expect(document.getElementById('name-error')).toBeNull()
  })

  it('blocks a number outside min and max and submits a number inside', async () => {
    const seen: boolean[] = []
    const View = defineComponent({
      setup() {
        const form = useForm([
          {
            name: 'count',
            label: 'Count',
            rules: [
              { kind: 'min' as const, min: 1, message: 'At least 1' },
              { kind: 'max' as const, max: 10, message: 'At most 10' },
            ],
          },
        ])
        return () => {
          const count = form.field('count')
          return h('form', { onSubmit: () => seen.push(form.submit().ok) }, [
            h('input', {
              'aria-label': 'Count',
              'aria-invalid': count['aria-invalid'],
              onInput: (event: Event) => form.assign('count', event),
            }),
            form.snapshot.value.errors.count
              ? h('p', { role: 'alert' }, form.snapshot.value.errors.count)
              : null,
            h('button', { type: 'submit' }, 'Save'),
          ])
        }
      },
    })
    const el = document.createElement('div')
    document.body.append(el)
    const app = createApp(View)
    app.mount(el)
    mounted.push(() => app.unmount())
    await nextTick()
    const form = el.querySelector('form') as HTMLFormElement
    const input = el.querySelector('input') as HTMLInputElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([true])
    input.value = '0'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(el.textContent).toContain('At least 1')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    input.value = '11'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(el.textContent).toContain('At most 10')
    input.value = '4'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen.at(-1)).toBe(true)
    expect(input.getAttribute('aria-invalid')).toBeNull()
  })

  it('ignores changes and submit while disabled', async () => {
    const seen: boolean[] = []
    const View = defineComponent({
      setup() {
        const form = useForm(
          [{ name: 'name', label: 'Name', rules: [{ kind: 'required', message: 'Name is required' }] }],
          { disabled: true }
        )
        return () => {
          const name = form.field('name')
          return h('form', { onSubmit: () => seen.push(form.submit().ok) }, [
            h('input', {
              'aria-label': 'Name',
              disabled: name.disabled,
              value: name.value,
              onInput: (event: Event) => form.assign('name', event),
            }),
            h('p', name.value || 'Empty'),
            h('button', { type: 'submit' }, 'Save'),
          ])
        }
      },
    })
    const el = document.createElement('div')
    document.body.append(el)
    const app = createApp(View)
    app.mount(el)
    mounted.push(() => app.unmount())
    const input = document.querySelector('input') as HTMLInputElement
    const form = document.querySelector('form') as HTMLFormElement
    expect(input.disabled).toBe(true)
    input.value = 'Ada'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([false])
    expect(document.querySelector('p')?.textContent).toBe('Empty')
  })

  it('links textarea, select, switch, and number errors, then submits', async () => {
    const seen: Array<{ ok: boolean; errors: Record<string, string>; values?: Record<string, string> }> = []
    const View = defineComponent({
      setup() {
        const form = useForm([
          { name: 'note', label: 'Note', rules: [{ kind: 'required', message: 'Note is required' }] },
          { name: 'fruit', label: 'Fruit', rules: [{ kind: 'required', message: 'Fruit is required' }] },
          { name: 'alerts', label: 'Alerts', rules: [{ kind: 'checked', message: 'Enable alerts' }] },
          { name: 'count', label: 'Count', rules: [{ kind: 'required', message: 'Count is required' }] },
        ])
        return () =>
          h('form', { onSubmit: () => {
            const result = form.submit()
            seen.push(result.ok ? { ok: true, errors: {}, values: result.values } : { ok: false, errors: result.snapshot.errors })
          } }, [
            h(Textarea, {
              modelValue: form.field('note').value,
              'aria-label': 'Note',
              'aria-invalid': form.field('note')['aria-invalid'],
              'aria-describedby': form.field('note')['aria-describedby'],
              onValueChange: (event: { detail: { value: string } }) => form.update('note', event.detail.value),
            }),
            form.snapshot.value.errors.note ? h('p', { id: 'note-error', role: 'alert' }, form.snapshot.value.errors.note) : null,
            h(SelectNative, {
              modelValue: form.field('fruit').value,
              'aria-label': 'Fruit',
              'aria-invalid': form.field('fruit')['aria-invalid'],
              'aria-describedby': form.field('fruit')['aria-describedby'],
              onChange: (value: string) => form.update('fruit', String(value)),
            }, () => [h('option', { value: '' }, 'Choose'), h('option', { value: 'apple' }, 'Apple')]),
            form.snapshot.value.errors.fruit ? h('p', { id: 'fruit-error', role: 'alert' }, form.snapshot.value.errors.fruit) : null,
            h(Switch, {
              checked: form.field('alerts').value === 'true',
              'aria-label': 'Alerts',
              'aria-invalid': form.field('alerts')['aria-invalid'],
              'aria-describedby': form.field('alerts')['aria-describedby'],
              onChange: (value: boolean) => form.update('alerts', value ? 'true' : ''),
            }),
            form.snapshot.value.errors.alerts ? h('p', { id: 'alerts-error', role: 'alert' }, form.snapshot.value.errors.alerts) : null,
            h(NumberField, {
              modelValue: form.field('count').value,
              spinOnPress: false,
              onChange: (value?: number) => form.update('count', value == null ? '' : String(value)),
            }, () => [
              h(NumberFieldInput, {
                'aria-label': 'Count',
                'aria-invalid': form.field('count')['aria-invalid'],
                'aria-describedby': form.field('count')['aria-describedby'],
              }),
              h(NumberFieldIncrement, {}, () => '+'),
            ]),
            form.snapshot.value.errors.count ? h('p', { id: 'count-error', role: 'alert' }, form.snapshot.value.errors.count) : null,
            h('button', { type: 'submit' }, 'Save'),
          ])
      },
    })
    const el = document.createElement('div')
    document.body.append(el)
    const app = createApp(View)
    app.mount(el)
    mounted.push(() => app.unmount())
    const form = document.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    const note = document.querySelector('textarea') as HTMLTextAreaElement
    const fruit = document.querySelector('select') as HTMLSelectElement
    const alerts = document.querySelector('[data-slot="switch"]') as HTMLButtonElement
    const count = document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    expect(note.getAttribute('aria-invalid')).toBe('true')
    expect(note.getAttribute('aria-describedby')).toBe('note-error')
    expect(fruit.getAttribute('aria-invalid')).toBe('true')
    expect(fruit.getAttribute('aria-describedby')).toBe('fruit-error')
    expect(alerts.getAttribute('aria-invalid')).toBe('true')
    expect(alerts.getAttribute('aria-describedby')).toBe('alerts-error')
    expect(count.getAttribute('aria-invalid')).toBe('true')
    expect(count.getAttribute('aria-describedby')).toBe('count-error')
    expect(document.getElementById('note-error')?.textContent).toBe('Note is required')
    const write = (field: HTMLTextAreaElement | HTMLSelectElement, value: string) => {
      const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLSelectElement.prototype
      Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(field, value)
    }
    write(note, 'hello')
    note.dispatchEvent(new Event('input', { bubbles: true }))
    write(fruit, 'apple')
    fruit.dispatchEvent(new Event('change', { bubbles: true }))
    alerts.click()
    const increment = document.querySelector('[data-slot="number-field-increment"]') as HTMLElement
    increment.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }))
    increment.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen.at(-1)).toEqual({
      ok: true,
      errors: {},
      values: { note: 'hello', fruit: 'apple', alerts: 'true', count: '1' },
    })
    expect(note.getAttribute('aria-invalid')).toBeNull()
    expect(count.getAttribute('aria-invalid')).toBeNull()
  })

  it('renders textarea, select, switch, and number fields', async () => {
    const seen: Array<Record<string, string>> = []
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
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: (values: Record<string, string>) => seen.push(values) }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    expect(host.querySelector('textarea')).not.toBeNull()
    expect(host.querySelector('select')).not.toBeNull()
    expect(host.querySelector('[role="switch"]')).not.toBeNull()
    expect(host.querySelector('input[type="number"]')).not.toBeNull()
    const form = host.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(host.querySelector('textarea')?.getAttribute('aria-required')).toBe('true')
    expect(host.querySelector('select')?.getAttribute('aria-required')).toBe('true')
    expect(host.querySelector('[role="switch"]')?.getAttribute('aria-required')).toBe('true')
    expect(host.querySelector('input[type="number"]')?.getAttribute('aria-required')).toBe('true')
    expect(host.querySelector('textarea')?.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(host.querySelector('textarea'))
    const setValue = (selector: string, value: string) => {
      const node = host.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      const prototype =
        node instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : node instanceof HTMLSelectElement
            ? HTMLSelectElement.prototype
            : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(node, value)
      node.dispatchEvent(new Event(node instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }))
    }
    setValue('textarea', 'hello')
    setValue('select', 'apple')
    setValue('input[type="number"]', '3')
    ;(host.querySelector('[role="switch"]') as HTMLInputElement).click()
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen.at(-1)).toEqual({ note: 'hello', fruit: 'apple', alerts: 'true', count: '3' })
  })

  it('keeps a required radio empty until one option is chosen', async () => {
    const seen: Array<Record<string, string>> = []
    const fields = [
      {
        name: 'plan',
        label: 'Plan',
        control: 'radio',
        options: [
          { label: 'Free', value: 'free' },
          { label: 'Pro', value: 'pro' },
        ],
        rules: [{ kind: 'required', message: 'Choose a plan' }],
      },
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: (values: Record<string, string>) => seen.push(values) }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const form = host.querySelector('form') as HTMLFormElement
    const group = host.querySelector('[role="radiogroup"]') as HTMLElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([])
    expect(host.textContent).toContain('Choose a plan')
    expect(group.getAttribute('aria-invalid')).toBe('true')
    expect(group.getAttribute('aria-labelledby')).toBe('plan-label')
    expect(group.getAttribute('aria-label')).toBeNull()
    expect(host.querySelector('#plan-label')?.textContent).toBe('Plan')
    expect(document.activeElement).toBe(group)
    const pro = host.querySelector('input[value="pro"]') as HTMLInputElement
    pro.checked = true
    pro.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ plan: 'pro' }])
  })

  it('uses an email input for an email rule and a password input for a password', async () => {
    const seen: Array<Record<string, string>> = []
    const fields = [
      { name: 'email', label: 'Email', rules: [{ kind: 'email', message: 'Enter a valid email' }] },
      {
        name: 'secret',
        label: 'Secret',
        control: 'password',
        rules: [{ kind: 'required', message: 'Secret is required' }],
      },
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: (values: Record<string, string>) => seen.push(values) }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const email = host.querySelector('input[type="email"]') as HTMLInputElement
    const secret = host.querySelector('input[type="password"]') as HTMLInputElement
    expect(email).toBeTruthy()
    expect(secret).toBeTruthy()
    const form = host.querySelector('form') as HTMLFormElement
    const type = async (input: HTMLInputElement, value: string) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await nextTick()
    }
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([])
    expect(document.activeElement).toBe(secret)
    await type(email, 'ada@example.com')
    await type(secret, 's3cret')
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ email: 'ada@example.com', secret: 's3cret' }])
  })

  it('reveals a password field and masks it again', async () => {
    const fields = [{ name: 'secret', label: 'Secret', control: 'password' }] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: () => undefined }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const secret = host.querySelector('input') as HTMLInputElement
    const show = host.querySelector('[aria-label="Show password"]') as HTMLButtonElement
    expect(show.textContent?.trim()).toBe('Show password')
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(secret, 's3cret')
    secret.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    show.click()
    await nextTick()
    expect(secret.type).toBe('text')
    expect(secret.value).toBe('s3cret')
    expect(document.activeElement).toBe(secret)
    const hide = host.querySelector('[aria-label="Hide password"]') as HTMLButtonElement
    expect(hide.textContent?.trim()).toBe('Hide password')
    hide.click()
    await nextTick()
    expect(secret.type).toBe('password')
    const lockedHost = document.createElement('div')
    document.body.append(lockedHost)
    const locked = createApp({
      render: () => h(Form, { fields, disabled: true, onSubmit: () => undefined }),
    })
    locked.mount(lockedHost)
    mounted.push(() => locked.unmount())
    await nextTick()
    expect(lockedHost.querySelector('[aria-label="Show password"]')).toBeNull()
  })

  it('keeps a required date empty until a day is chosen', async () => {
    const seen: Array<Record<string, string>> = []
    const fields = [
      {
        name: 'day',
        label: 'Day',
        control: 'date',
        rules: [{ kind: 'required', message: 'Choose a day' }],
      },
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: (values: Record<string, string>) => seen.push(values) }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const day = host.querySelector('input[type="date"]') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([])
    expect(day.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(day)
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(day, '2026-11-07')
    day.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ day: '2026-11-07' }])
  })

  it('keeps a required time empty until a time is chosen', async () => {
    const seen: Array<Record<string, string>> = []
    const fields = [
      {
        name: 'when',
        label: 'When',
        control: 'time',
        rules: [{ kind: 'required', message: 'Choose a time' }],
      },
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: (values: Record<string, string>) => seen.push(values) }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const when = host.querySelector('input[type="time"]') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([])
    expect(when.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(when)
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(when, '09:30')
    when.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ when: '09:30' }])
  })

  it('blocks a day or time outside its bounds and allows an empty optional value', async () => {
    const seen: Array<Record<string, string>> = []
    const fields = [
      {
        name: 'day',
        label: 'Day',
        control: 'date',
        rules: [{ kind: 'dateMin', min: '2026-11-07', message: 'Too early' }],
      },
      {
        name: 'when',
        label: 'When',
        control: 'time',
        rules: [{ kind: 'timeMax', max: '17:00', message: 'Too late' }],
      },
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: (values: Record<string, string>) => seen.push(values) }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const day = host.querySelector('input[type="date"]') as HTMLInputElement
    const when = host.querySelector('input[type="time"]') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    expect(day.min).toBe('2026-11-07')
    expect(when.max).toBe('17:00')
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ day: '', when: '' }])
    const fill = (node: HTMLInputElement, value: string) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(node, value)
      node.dispatchEvent(new Event('input', { bubbles: true }))
    }
    fill(day, '2026-11-06')
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ day: '', when: '' }])
    expect(day.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(day)
    fill(day, '2026-11-07')
    fill(when, '17:30')
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(when.getAttribute('aria-invalid')).toBe('true')
    fill(when, '17:00')
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([
      { day: '', when: '' },
      { day: '2026-11-07', when: '17:00' },
    ])
  })

  it('blocks a value that misses its pattern and allows an empty optional pattern', async () => {
    const seen: Array<Record<string, string>> = []
    const fields = [
      {
        name: 'code',
        label: 'Code',
        rules: [{ kind: 'pattern', pattern: '^[A-Z]{3}$', message: 'Use three letters' }],
      },
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: (values: Record<string, string>) => seen.push(values) }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const code = host.querySelector('input') as HTMLInputElement
    expect(code.getAttribute('pattern')).toBe('^[A-Z]{3}$')
    const form = host.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ code: '' }])
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(code, 'ab')
    code.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ code: '' }])
    expect(code.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(code)
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(code, 'ABC')
    code.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ code: '' }, { code: 'ABC' }])
  })

  it('blocks a confirmation that differs and checks it again when the other field changes', async () => {
    const seen: Array<Record<string, string>> = []
    const fields = [
      { name: 'secret', label: 'Secret' },
      {
        name: 'confirm',
        label: 'Confirm',
        rules: [{ kind: 'same', field: 'secret', message: 'Must match' }],
      },
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: (values: Record<string, string>) => seen.push(values) }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const secret = host.querySelector('#secret') as HTMLInputElement
    const confirm = host.querySelector('#confirm') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    const type = async (input: HTMLInputElement, value: string) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await nextTick()
    }
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ secret: '', confirm: '' }])
    await type(confirm, 'no')
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ secret: '', confirm: '' }])
    expect(confirm.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(confirm)
    await type(secret, 's3cret')
    await type(confirm, 's3cret')
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([
      { secret: '', confirm: '' },
      { secret: 's3cret', confirm: 's3cret' },
    ])
    await type(secret, 'other')
    expect(confirm.getAttribute('aria-invalid')).toBe('true')
  })

  it('describes a hint while the field is valid and keeps it with the error', async () => {
    const fields = [
      {
        name: 'note',
        label: 'Note',
        hint: 'Use letters',
        rules: [
          { kind: 'required', message: 'Required' },
          { kind: 'maxLength', max: 4, message: 'Too long' },
        ],
      },
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: () => undefined }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const note = host.querySelector('input') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    expect(host.querySelector('#note-hint')?.textContent).toBe('Use letters')
    expect(note.getAttribute('aria-describedby')).toBe('note-hint note-count')
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(note.getAttribute('aria-invalid')).toBe('true')
    expect(note.getAttribute('aria-describedby')).toBe('note-error note-hint note-count')
    expect(host.querySelector('#note-hint')?.textContent).toBe('Use letters')
    expect(host.querySelector('#note-error')?.textContent).toBe('Required')
  })

  it('cuts a form field to maxLength and reads the character count', async () => {
    const seen: Array<Record<string, string>> = []
    const fields = [
      { name: 'note', label: 'Note', rules: [{ kind: 'maxLength', max: 4, message: 'Too long' }] },
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: (values: Record<string, string>) => seen.push(values) }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const note = host.querySelector('input') as HTMLInputElement
    const form = host.querySelector('form') as HTMLFormElement
    expect(host.querySelector('[role="status"]')?.textContent).toBe('0 of 4')
    expect(note.getAttribute('aria-describedby')).toBe('note-count')
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(note, 'pineapple')
    note.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(note.value).toBe('pine')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('4 of 4')
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ note: 'pine' }])
  })

  it('announces how many fields need attention after a failed submit', async () => {
    const seen: Array<Record<string, string>> = []
    const fields = [
      { name: 'email', label: 'Email', rules: [{ kind: 'required', message: 'Email is required' }] },
      { name: 'name', label: 'Name', rules: [{ kind: 'required', message: 'Name is required' }] },
    ] as FieldSpec[]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Form, { fields, onSubmit: (values: Record<string, string>) => seen.push(values) }),
    })
    app.mount(host)
    mounted.push(() => app.unmount())
    await nextTick()
    const form = host.querySelector('form') as HTMLFormElement
    expect(host.querySelector('[role="alert"]')).toBeNull()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(host.querySelector('[role="alert"]')?.textContent).toBe('2 fields need attention: Email, Name')
    const name = host.querySelector('#name') as HTMLInputElement
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(name, 'Ada')
    name.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(host.querySelector('[role="alert"]')?.textContent).toBe('1 field needs attention: Email')
    const email = host.querySelector('#email') as HTMLInputElement
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(email, 'ada@example.com')
    email.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual([{ email: 'ada@example.com', name: 'Ada' }])
    expect(host.querySelector('[role="alert"]')).toBeNull()
  })
})