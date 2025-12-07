import { describe, it, expect } from 'vitest'
import { cn, formatDate } from './utils'

describe('cn', () => {
    it('should merge class names', () => {
        expect(cn('w-4', 'h-4')).toBe('w-4 h-4')
    })

    it('should handle conditional classes', () => {
        expect(cn('w-4', true && 'h-4', false && 'p-4')).toBe('w-4 h-4')
    })

    it('should resolve conflicting tailwind classes', () => {
        expect(cn('p-4', 'p-2')).toBe('p-2')
    })
})

describe('formatDate', () => {
    it('should format date string correctly', () => {
        const date = '2023-01-01'
        expect(formatDate(date)).toMatch(/January 1, 2023/)
    })
})
