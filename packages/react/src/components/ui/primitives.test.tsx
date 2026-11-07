// @vitest-environment jsdom

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { restoreFocus } from '@timui/core'

import { DataTable } from './data-table'
import { Form } from './form'
import { Alert, AlertTitle } from './alert'
import { Badge } from './badge'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Textarea } from './textarea'
import { compatibilityAliases, preferredReactEntries } from './preferred-entries'

describe('react primitives', () => {
  it('renders a button and keeps an accessible name', () => {
    const html = renderToStaticMarkup(
      createElement(Button, { 'aria-label': 'Close' }, 'Close')
    )
    expect(html).toContain('<button')
    expect(html).toContain('aria-label="Close"')
    expect(html).toContain('data-slot="button"')
  })

  it('associates a label with an input', () => {
    const html = renderToStaticMarkup(
      createElement(
        'div',
        null,
        createElement(Label, { htmlFor: 'email' }, 'Email'),
        createElement(Input, { id: 'email', type: 'email', placeholder: 'you@example.com' })
      )
    )
    expect(html).toContain('for="email"')
    expect(html).toContain('id="email"')
    expect(html).toContain('type="email"')
  })

  it('keeps a textarea id for its label', () => {
    const html = renderToStaticMarkup(
      createElement(Textarea, { id: 'note', 'aria-label': 'Note' })
    )
    expect(html).toContain('id="note"')
    expect(html).toContain('aria-label="Note"')
  })

  it('exposes alert semantics', () => {
    const html = renderToStaticMarkup(
      createElement(Alert, null, createElement(AlertTitle, null, 'Saved'))
    )
    expect(html).toContain('role="alert"')
    expect(html).toContain('Saved')
  })

  it('renders a badge as visible text', () => {
    const html = renderToStaticMarkup(createElement(Badge, null, 'New'))
    expect(html).toContain('New')
    expect(html).toContain('data-slot="badge"')
  })

  it('renders a form error and an empty data table', () => {
    const form = renderToStaticMarkup(
      createElement(Form, {
        fields: [{ name: 'email', label: 'Email', rules: [{ kind: 'required', message: 'Email is required' }] }],
        onSubmit: () => undefined,
      })
    )
    expect(form).toContain('for="email"')
    expect(form).toContain('id="email"')
    expect(form).toContain('type="submit"')

    const table = renderToStaticMarkup(
      createElement(DataTable, {
        caption: 'Scores',
        columns: [{ id: 'name', header: 'Name' }],
        rows: [],
      })
    )
    expect(table).toContain('role="status"')
    expect(table).toContain('No results')
    expect(table).toContain('aria-label="Select all rows"')
  })

  it('returns focus to the trigger that opened a layer', () => {
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()
    ;(document.activeElement as HTMLElement | null)?.blur()
    expect(restoreFocus(trigger)).toBe(true)
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
    expect(restoreFocus(trigger)).toBe(false)
  })

  it('points every compatibility alias at one preferred entry', () => {
    const preferred = new Set(Object.values(preferredReactEntries))
    for (const target of Object.values(compatibilityAliases)) {
      expect(preferred.has(target as (typeof preferredReactEntries)[keyof typeof preferredReactEntries])).toBe(
        true
      )
    }
    expect(new Set(Object.values(preferredReactEntries)).size).toBe(
      Object.keys(preferredReactEntries).length
    )
  })
})
