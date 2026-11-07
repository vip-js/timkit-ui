import { describe, expect, it } from 'vitest'

import { progressPercent } from './percent'

describe('progress percent', () => {
  it('maps a value into the min and max range and treats an empty value as indeterminate', () => {
    expect(progressPercent(40, 0, 100)).toBe(40)
    expect(progressPercent(150, 0, 100)).toBe(100)
    expect(progressPercent(-10, 0, 100)).toBe(0)
    expect(progressPercent(null)).toBeNull()
    expect(progressPercent(undefined)).toBeNull()
  })
})
