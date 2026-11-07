import { describe, expect, it } from 'vitest'

import { seedAgentThread, suggestAgentThreadNext, validateAgentThread } from './thread-coach'

describe('thread coach', () => {
  it('flags a tool that references a missing approval', () => {
    const result = validateAgentThread({
      id: 'broken',
      composer: '',
      composerStatus: 'ready',
      messages: [
        {
          id: 'assistant-1',
          role: 'assistant',
          parts: [
            {
              type: 'tool',
              id: 'refund',
              name: 'orders.refund',
              status: 'pending',
              approvalId: 'missing',
            },
          ],
        },
      ],
    })

    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.type === 'reference')).toBe(true)
  })

  it('accepts a pending approval as a legal thread', () => {
    const result = validateAgentThread(seedAgentThread('refund-support'))
    expect(result.valid).toBe(true)
    expect(result.issues).toEqual([])
  })

  it('suggests waiting when approval is pending', () => {
    const suggestions = suggestAgentThreadNext(seedAgentThread('refund-support'))
    expect(suggestions.some((item) => item.priority === 'blocker')).toBe(true)
    expect(suggestions.some((item) => item.reason.includes('refund-approval'))).toBe(true)
  })

  it('suggests tool.finish after approval', () => {
    const approved = seedAgentThread('refund-support')
    approved.messages[1]?.parts.forEach((part) => {
      if (part.type === 'approval') part.status = 'approved'
      if (part.type === 'tool') part.status = 'running'
    })
    const suggestions = suggestAgentThreadNext(approved)
    expect(suggestions.some((item) => item.action?.type === 'tool.finish')).toBe(true)
  })
})
