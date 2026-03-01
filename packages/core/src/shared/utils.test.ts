import { describe, expect, it, vi } from 'vitest'

import { cn, createTimEvent, formatDate } from './utils'

describe('shared utils smoke', () => {
  it('createTimEvent returns stable event payload', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-02-14T12:00:00.000Z'))

    const event = createTimEvent('select.change', 'city', { value: 'hangzhou' })

    expect(event.type).toBe('select.change')
    expect(event.target.id).toBe('city')
    expect(event.detail).toEqual({ value: 'hangzhou' })
    expect(event.timestamp).toBe(new Date('2026-02-14T12:00:00.000Z').getTime())

    vi.useRealTimers()
  })

  it('cn merges conflict classes and keeps last class', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('formatDate formats in English month/day/year', () => {
    const localTime = new Date(2026, 1, 14, 10, 30, 0).getTime()
    expect(formatDate(localTime)).toBe('February 14, 2026')
  })
})
