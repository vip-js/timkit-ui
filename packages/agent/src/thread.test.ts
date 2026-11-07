import {
  agentThreadGates,
  createAgentThread,
  describeAgentThread,
  reduceAgentThread,
  type AgentThread,
} from '@timui/core/agent-thread'
import { describe, expect, it } from 'vitest'

const refundThread = (): AgentThread => ({
  id: 'refund',
  composer: 'thanks',
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
          approvalId: 'refund-approval',
        },
        {
          type: 'approval',
          id: 'refund-approval',
          title: 'Refund $48',
          status: 'pending',
        },
      ],
    },
  ],
})

describe('agent thread', () => {
  it('sends a user message and locks the composer', () => {
    const result = reduceAgentThread(createAgentThread(), {
      type: 'composer.submit',
      text: 'Refund order 1842',
    })

    expect(result.accepted).toBe(true)
    expect(result.thread.composer).toBe('')
    expect(result.thread.composerStatus).toBe('running')
    expect(result.thread.messages[0]?.parts).toEqual([{ type: 'text', text: 'Refund order 1842' }])
    expect(
      reduceAgentThread(result.thread, { type: 'composer.submit', text: 'again' }).accepted
    ).toBe(false)
  })

  it('keeps a gated tool blocked until a person approves it', () => {
    const blocked = agentThreadGates(refundThread())
    expect(blocked.blockedToolIds).toEqual(['refund'])
    expect(blocked.runnableToolIds).toEqual([])
    expect(
      reduceAgentThread(refundThread(), {
        type: 'tool.finish',
        id: 'refund',
        status: 'succeeded',
      }).reason
    ).toBe('This tool is waiting for approval.')

    const approved = reduceAgentThread(refundThread(), {
      type: 'approval.decide',
      id: 'refund-approval',
      decision: 'approved',
    })
    expect(approved.accepted).toBe(true)
    expect(agentThreadGates(approved.thread).runnableToolIds).toEqual(['refund'])
    expect(
      reduceAgentThread(approved.thread, {
        type: 'approval.decide',
        id: 'refund-approval',
        decision: 'rejected',
      }).reason
    ).toBe('This decision already has a receipt.')

    expect(describeAgentThread(approved.thread)).toContain('Runnable tools: refund')
    const finished = reduceAgentThread(approved.thread, {
      type: 'tool.finish',
      id: 'refund',
      status: 'succeeded',
      output: 'Refund sent.',
    })
    expect(finished.accepted).toBe(true)
    expect(agentThreadGates(finished.thread).blockedToolIds).toEqual([])
  })

  it('fails the tool when a person rejects it', () => {
    const rejected = reduceAgentThread(refundThread(), {
      type: 'approval.decide',
      id: 'refund-approval',
      decision: 'rejected',
    })
    const tool = rejected.thread.messages[0]?.parts.find((part) => part.type === 'tool')
    expect(tool).toMatchObject({
      status: 'failed',
      output: 'A person rejected this action.',
    })
    expect(agentThreadGates(rejected.thread).runnableToolIds).toEqual([])
  })
})
