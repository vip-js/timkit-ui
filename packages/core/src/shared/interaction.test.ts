import { describe, expect, it } from 'vitest'

import { canonicalContract, dateContractNames } from './canonical'
import { createControl, reduceControl } from './control'
import {
  cycleSort,
  allRowsSelected,
  filterRows,
  toggleExpanded,
  isTableEmpty,
  pageCount,
  pageRows,
  reduceTableKey,
  sortRows,
  toggleAllSelection,
  type TableRowData,
} from './data-table'
import { createForm, fieldA11y, fieldError, fieldPattern, fieldRequired, firstInvalidField, formErrorSummary, readFieldValue, setFieldValue, submitForm, type FieldSpec } from './form'
import { keyboardWidgets, reduceWidgetKey, restoreFocus, type WidgetState } from './keyboard'
import { ucsRegistry } from './registry'

const fields: FieldSpec[] = [
  { name: 'email', label: 'Email', rules: [{ kind: 'required', message: 'Email is required' }, { kind: 'email', message: 'Enter a valid email' }] },
  { name: 'name', label: 'Name', rules: [{ kind: 'required', message: 'Name is required' }, { kind: 'minLength', min: 2, message: 'Name is too short' }] },
]

const rows: TableRowData[] = [
  { id: 'b', cells: { name: 'Bea', score: '2' } },
  { id: 'a', cells: { name: 'Ada', score: '10' } },
]

const widget = (patch: Partial<WidgetState> = {}): WidgetState => ({
  open: true,
  index: 0,
  count: 3,
  checked: false,
  value: 20,
  min: 0,
  max: 100,
  step: 10,
  ...patch,
})

describe('form', () => {
  it('blocks submit until required fields are valid, then returns the values', () => {
    let snapshot = createForm(fields)
    const blocked = submitForm(snapshot, fields)
    expect(blocked.ok).toBe(false)
    if (blocked.ok) return
    expect(formErrorSummary(fields, blocked.snapshot.errors, 0)).toBe('')
    expect(formErrorSummary(fields, blocked.snapshot.errors, blocked.snapshot.submitCount)).toBe(
      '2 fields need attention: Email, Name'
    )
    expect(blocked.snapshot.errors.email).toBe('Email is required')
    expect(firstInvalidField(fields, blocked.snapshot.errors)).toBe('email')
    snapshot = setFieldValue(blocked.snapshot, 'email', 'not-an-email', fields)
    expect(snapshot.errors.email).toBe('Enter a valid email')
    snapshot = setFieldValue(snapshot, 'email', 'ada@example.com', fields)
    snapshot = setFieldValue(snapshot, 'name', 'A', fields)
    expect(snapshot.errors.name).toBe('Name is too short')
    expect(submitForm(snapshot, fields).ok).toBe(false)
    snapshot = setFieldValue(snapshot, 'name', 'Ada', fields)
    const sent = submitForm(snapshot, fields)
    expect(sent.ok).toBe(true)
    if (!sent.ok) return
    expect(sent.values).toEqual({ email: 'ada@example.com', name: 'Ada' })
    expect(fieldA11y('email', 'bad')['aria-describedby']).toBe('email-error')
    expect(fieldA11y('email', undefined, 'Work address')['aria-describedby']).toBe('email-hint')
    expect(fieldA11y('email', 'bad', 'Work address')['aria-describedby']).toBe('email-error email-hint')
    expect(fieldA11y('email', undefined, '  ')['aria-describedby']).toBeUndefined()
    expect(fieldRequired([{ kind: 'required', message: 'Required' }])).toBe(true)
    expect(fieldRequired([{ kind: 'checked', message: 'Accept' }])).toBe(true)
    expect(fieldRequired([{ kind: 'min', min: 1, message: 'At least 1' }])).toBe(false)
    const codeRule = [{ kind: 'pattern' as const, pattern: '^[A-Z]{3}$', message: 'Use three letters' }]
    expect(fieldPattern(codeRule)).toBe('^[A-Z]{3}$')
    expect(fieldError('', codeRule)).toBe('')
    expect(fieldError('ab', codeRule)).toBe('Use three letters')
    expect(fieldError('ABC', codeRule)).toBe('')
    expect(fieldError('ABC', [{ kind: 'pattern', pattern: '[', message: 'Bad pattern' }])).toBe('Bad pattern')
    const sameRule = [{ kind: 'same' as const, field: 'secret', message: 'Must match' }]
    expect(fieldError('', sameRule, { secret: '' })).toBe('')
    expect(fieldError('no', sameRule, { secret: 's3cret' })).toBe('Must match')
    expect(fieldError('s3cret', sameRule, { secret: 's3cret' })).toBe('')
    const agreed = submitForm(
      setFieldValue(createForm([{ name: 'terms', label: 'Terms', rules: [{ kind: 'checked', message: 'Accept terms' }] }]), 'terms', '', [{ name: 'terms', label: 'Terms', rules: [{ kind: 'checked', message: 'Accept terms' }] }]),
      [{ name: 'terms', label: 'Terms', rules: [{ kind: 'checked', message: 'Accept terms' }] }]
    )
    expect(agreed.ok).toBe(false)
    expect(readFieldValue({ detail: { value: 'ada@example.com' } })).toBe('ada@example.com')
    expect(readFieldValue({ detail: { value: ['pro'] } })).toBe('pro')
    expect(readFieldValue({ detail: { checked: true } })).toBe('true')
    expect(readFieldValue({ target: { type: 'checkbox', checked: true, value: 'on' } })).toBe('true')
    expect(readFieldValue({ target: { type: 'checkbox', checked: false, value: 'on' } })).toBe('')
    expect(readFieldValue({ target: { type: 'radio', checked: true, value: 'pro' } })).toBe('pro')
    expect(readFieldValue({ target: { type: 'radio', checked: false, value: 'pro' } })).toBe('')
    expect(readFieldValue({ target: { type: 'email', checked: false, value: 'ada@example.com' } })).toBe(
      'ada@example.com'
    )
    expect(readFieldValue(12)).toBe('12')
    expect(readFieldValue({ detail: { value: 0 }, target: { value: '4' } })).toBe('0')
    expect(readFieldValue({ detail: { value: null }, target: { value: 'old@example.com' } })).toBe('')
  })

  it('blocks a number outside min and max and allows an empty optional number', () => {
    const count: FieldSpec[] = [
      {
        name: 'count',
        label: 'Count',
        rules: [
          { kind: 'min', min: 1, message: 'At least 1' },
          { kind: 'max', max: 10, message: 'At most 10' },
        ],
      },
    ]
    expect(submitForm(createForm(count), count).ok).toBe(true)
    const low = setFieldValue(createForm(count), 'count', '0', count)
    expect(low.errors.count).toBe('At least 1')
    expect(submitForm(low, count).ok).toBe(false)
    const high = setFieldValue(createForm(count), 'count', '11', count)
    expect(high.errors.count).toBe('At most 10')
    const word = setFieldValue(createForm(count), 'count', 'abc', count)
    expect(word.errors.count).toBe('At least 1')
    const sent = submitForm(setFieldValue(createForm(count), 'count', '4', count), count)
    expect(sent.ok).toBe(true)
    if (!sent.ok) return
    expect(sent.values.count).toBe('4')
  })

  it('compares a calendar day and a clock time and leaves an empty value valid', () => {
    const when: FieldSpec[] = [
      {
        name: 'day',
        label: 'Day',
        rules: [
          { kind: 'dateMin', min: '2026-11-07', message: 'Too early' },
          { kind: 'dateMax', max: '2026-11-09', message: 'Too late' },
        ],
      },
      {
        name: 'hour',
        label: 'Hour',
        rules: [
          { kind: 'timeMin', min: '09:00', message: 'Too early' },
          { kind: 'timeMax', max: '17:00', message: 'Too late' },
        ],
      },
    ]
    expect(submitForm(createForm(when), when).ok).toBe(true)
    expect(setFieldValue(createForm(when), 'day', '2026-11-06', when).errors.day).toBe('Too early')
    expect(setFieldValue(createForm(when), 'day', '2026-11-10', when).errors.day).toBe('Too late')
    expect(setFieldValue(createForm(when), 'day', '2026-02-31', when).errors.day).toBe('Too early')
    expect(setFieldValue(createForm(when), 'hour', '08:59', when).errors.hour).toBe('Too early')
    expect(setFieldValue(createForm(when), 'hour', '17:01', when).errors.hour).toBe('Too late')
    expect(setFieldValue(createForm(when), 'hour', '9:00', when).errors.hour).toBe('Too early')
    const sent = submitForm(
      setFieldValue(setFieldValue(createForm(when), 'day', '2026-11-07', when), 'hour', '09:00', when),
      when
    )
    expect(sent.ok).toBe(true)
    if (!sent.ok) return
    expect(sent.values).toEqual({ day: '2026-11-07', hour: '09:00' })
  })

  it('cuts text to maxLength and still rejects a stored value that is too long', () => {
    const note: FieldSpec[] = [
      { name: 'note', label: 'Note', rules: [{ kind: 'maxLength', max: 4, message: 'Too long' }] },
    ]
    expect(submitForm(createForm(note), note).ok).toBe(true)
    const cut = setFieldValue(createForm(note), 'note', 'pineapple', note)
    expect(cut.values.note).toBe('pine')
    expect(cut.errors.note).toBeUndefined()
    const seeded = createForm(note, { note: 'pineapple' })
    const blocked = submitForm(seeded, note)
    expect(blocked.ok).toBe(false)
    if (blocked.ok) return
    expect(blocked.snapshot.errors.note).toBe('Too long')
  })
})

describe('data table', () => {
  it('sorts, selects, reports empty, and moves with the keyboard', () => {
    expect(sortRows(rows, { columnId: 'score', direction: 'asc' }).map((row) => row.id)).toEqual(['b', 'a'])
    expect(cycleSort({ columnId: 'name', direction: 'asc' }, 'name')).toEqual({
      columnId: 'name',
      direction: 'desc',
    })
    expect(cycleSort({ columnId: 'name', direction: 'desc' }, 'name')).toBeNull()
    expect(toggleAllSelection(rows, [])).toEqual(['b', 'a'])
    expect(toggleAllSelection(rows, ['b', 'a'])).toEqual([])
    expect(filterRows(rows, ' ada ').map((row) => row.id)).toEqual(['a'])
    expect(filterRows(rows, '').map((row) => row.id)).toEqual(['b', 'a'])
    expect(allRowsSelected(rows, ['b', 'a'])).toBe(true)
    expect(allRowsSelected([rows[0]], ['b', 'a'])).toBe(true)
    expect(pageCount(2, 1)).toBe(2)
    expect(pageRows(rows, 1, 1).map((row) => row.id)).toEqual(['a'])
    expect(pageRows(rows, 0, 0).map((row) => row.id)).toEqual(['b', 'a'])
    expect(toggleExpanded(['b'], 'a')).toEqual(['b', 'a'])
    expect(toggleExpanded(['b', 'a'], 'b')).toEqual(['a'])
    expect(isTableEmpty([])).toBe(true)
    const moved = reduceTableKey('ArrowDown', rows, { activeIndex: 0, selectedIds: [] })
    expect(moved.activeIndex).toBe(1)
    const selected = reduceTableKey(' ', rows, moved)
    expect(selected.selectedIds).toEqual(['a'])
  })
})

describe('keyboard and focus', () => {
  it('covers every required widget with the same reducer', () => {
    expect(keyboardWidgets).toEqual([
      'dialog',
      'sheet',
      'select',
      'menu',
      'tabs',
      'accordion',
      'checkbox',
      'switch',
      'slider',
    ])
    expect(reduceWidgetKey('dialog', widget(), 'Escape').open).toBe(false)
    expect(reduceWidgetKey('sheet', widget({ index: 2 }), 'Tab').index).toBe(0)
    expect(reduceWidgetKey('select', widget({ open: false }), 'ArrowDown').open).toBe(true)
    expect(reduceWidgetKey('menu', widget({ index: 0 }), 'ArrowDown').index).toBe(1)
    expect(reduceWidgetKey('menu', widget(), 'Enter').open).toBe(false)
    expect(reduceWidgetKey('tabs', widget({ index: 2 }), 'ArrowRight').index).toBe(0)
    expect(reduceWidgetKey('accordion', widget(), 'Home').index).toBe(0)
    expect(reduceWidgetKey('accordion', widget(), ' ').checked).toBe(true)
    expect(reduceWidgetKey('checkbox', widget(), ' ').checked).toBe(true)
    expect(reduceWidgetKey('checkbox', widget(), 'Enter').handled).toBe(false)
    expect(reduceWidgetKey('switch', widget({ checked: true }), ' ').checked).toBe(false)
    expect(reduceWidgetKey('slider', widget(), 'ArrowRight').value).toBe(30)
    expect(reduceWidgetKey('slider', widget(), 'Home').value).toBe(0)
    expect(reduceWidgetKey('slider', widget(), 'End').value).toBe(100)
  })

  it('restores focus only while the trigger is connected', () => {
    let focused = false
    expect(restoreFocus({ focus: () => (focused = true), isConnected: true })).toBe(true)
    expect(focused).toBe(true)
    expect(restoreFocus({ focus: () => undefined, isConnected: false })).toBe(false)
    expect(restoreFocus(null)).toBe(false)
  })
})

describe('shared control and contracts', () => {
  it('keeps open, select, and disable on one reducer', () => {
    let state = createControl()
    state = reduceControl(state, 'open')
    state = reduceControl(state, 'select', 'monthly')
    expect(state).toMatchObject({ open: true, selected: 'monthly', disabled: false })
    state = reduceControl(state, 'disable')
    expect(reduceControl(state, 'close')).toEqual(state)
    expect(reduceControl(state, 'enable').disabled).toBe(false)
  })

  it('publishes one toast contract and three date contracts', () => {
    expect(canonicalContract('sonner')).toBe('toast')
    expect(canonicalContract('date-field')).toBe('datefield')
    expect(canonicalContract('datefield-rac')).toBe('datefield')
    expect(canonicalContract('calendar-rac')).toBe('calendar')
    expect(dateContractNames).toEqual(['calendar', 'datefield', 'date-picker'])
    expect(ucsRegistry.toast?.props?.length ?? 0).toBeGreaterThan(0)
    expect(ucsRegistry.form?.props?.map((prop) => prop.name)).toEqual(['submitLabel', 'disabled'])
    expect(ucsRegistry.table?.props?.map((prop) => prop.name)).toEqual([
      'sortColumn',
      'sortDirection',
      'selectedIds',
      'emptyLabel',
      'onSortChange',
      'onSelectionChange',
    ])
    expect(ucsRegistry.table?.props?.find((prop) => prop.name === 'selectedIds')?.type).toBe('array')
    for (const name of Object.keys(ucsRegistry)) {
      const schema = ucsRegistry[name as keyof typeof ucsRegistry]
      const props = schema?.props ?? []
      expect(props.length || schema?.parts.length).toBeGreaterThan(0)
      expect(new Set(props.map((prop) => prop.name)).size).toBe(props.length)
    }
  })
})
