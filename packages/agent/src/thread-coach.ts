import {
  agentThreadGates,
  createAgentThread,
  describeAgentThread,
  type AgentThread,
  type AgentUiAction,
} from '@timui/core/agent-thread'

export interface AgentThreadIssue {
  type: 'structure' | 'gate' | 'reference' | 'accessibility'
  message: string
  path?: string
  fix?: string
}

export interface AgentThreadValidation {
  valid: boolean
  issues: AgentThreadIssue[]
  summary: string
}

export interface AgentThreadSuggestion {
  priority: 'blocker' | 'next' | 'optional'
  reason: string
  action?: AgentUiAction
  hint: string
}

export const agentThreadProtocol = {
  version: '1.0.0',
  package: '@timui/core/agent-thread',
  view: '@timui/react/agent#AgentThreadView',
  reducer: 'reduceAgentThread',
  partTypes: ['text', 'plan', 'tool', 'approval', 'citations'] as const,
  actions: [
    'composer.change',
    'composer.submit',
    'composer.settle',
    'assistant.append',
    'approval.decide',
    'tool.finish',
  ] as const,
  gates: {
    approvalBlocksTool:
      'A tool with approvalId stays pending until that approval is approved. Rejection marks the tool failed.',
    receiptImmutable: 'approval.decide on a non-pending approval is rejected.',
  },
} as const

export const validateAgentThread = (thread: AgentThread): AgentThreadValidation => {
  const issues: AgentThreadIssue[] = []
  const declaredApprovals = new Set<string>()
  const seenTools = new Set<string>()
  const seenApprovals = new Set<string>()

  thread.messages.forEach((message) => {
    message.parts.forEach((part) => {
      if (part.type === 'approval') declaredApprovals.add(part.id)
    })
  })

  thread.messages.forEach((message, messageIndex) => {
    if (!message.parts.length) {
      issues.push({
        type: 'structure',
        path: `messages[${messageIndex}]`,
        message: 'Every message needs at least one part.',
        fix: 'Add a text, plan, tool, approval, or citations part.',
      })
    }
    message.parts.forEach((part, partIndex) => {
      const path = `messages[${messageIndex}].parts[${partIndex}]`
      if (part.type === 'text' && !part.text.trim()) {
        issues.push({
          type: 'structure',
          path,
          message: 'Text parts cannot be empty.',
          fix: 'Remove the part or write visible copy.',
        })
      }
      if (part.type === 'tool') {
        if (seenTools.has(part.id)) {
          issues.push({
            type: 'structure',
            path,
            message: `Duplicate tool id "${part.id}".`,
            fix: 'Use a unique id for every tool part.',
          })
        }
        seenTools.add(part.id)
        if (part.approvalId && !declaredApprovals.has(part.approvalId)) {
          issues.push({
            type: 'reference',
            path,
            message: `Tool "${part.id}" references missing approval "${part.approvalId}".`,
            fix: 'Add an approval part with the same id before the tool runs.',
          })
        }
      }
      if (part.type === 'approval') {
        if (seenApprovals.has(part.id)) {
          issues.push({
            type: 'structure',
            path,
            message: `Duplicate approval id "${part.id}".`,
            fix: 'Use a unique id for every approval part.',
          })
        }
        seenApprovals.add(part.id)
        if (!part.title.trim()) {
          issues.push({
            type: 'accessibility',
            path,
            message: 'Approval cards need a title.',
            fix: 'Describe the decision in plain language.',
          })
        }
      }
      if (part.type === 'citations' && !part.items.length) {
        issues.push({
          type: 'structure',
          path,
          message: 'Citation lists need at least one source.',
          fix: 'Remove the part or add a titled link.',
        })
      }
    })
  })

  const summary = describeAgentThread(thread)
  return {
    valid: issues.length === 0,
    issues,
    summary,
  }
}

export const suggestAgentThreadNext = (thread: AgentThread): AgentThreadSuggestion[] => {
  const suggestions: AgentThreadSuggestion[] = []
  const gates = agentThreadGates(thread)
  const validation = validateAgentThread(thread)

  validation.issues
    .filter((issue) => issue.type === 'reference' || issue.type === 'structure')
    .forEach((issue) => {
      suggestions.push({
        priority: 'blocker',
        reason: issue.message,
        hint: issue.fix || 'Fix the thread structure before continuing.',
      })
    })

  gates.pendingApprovalIds.forEach((id) => {
    suggestions.push({
      priority: 'blocker',
      reason: `Approval "${id}" is waiting for a person.`,
      hint: 'Do not call tool.finish for gated tools. Render ApprovalCard and wait for approval.decide.',
    })
  })

  gates.runnableToolIds.forEach((id) => {
    suggestions.push({
      priority: 'next',
      reason: `Tool "${id}" can run now.`,
      action: { type: 'tool.finish', id, status: 'succeeded' },
      hint: 'Run the backend tool, then apply tool.finish with the real output.',
    })
  })

  if (thread.composerStatus === 'running') {
    const last = thread.messages[thread.messages.length - 1]
    if (last?.role === 'user') {
      suggestions.push({
        priority: 'next',
        reason: 'The user message is in the thread but no assistant turn followed.',
        action: {
          type: 'assistant.append',
          message: {
            id: `assistant-${thread.messages.length + 1}`,
            role: 'assistant',
            status: 'streaming',
            parts: [{ type: 'text', text: 'Working on it.' }],
          },
        },
        hint: 'Append a structured assistant message, then call composer.settle when the turn is complete.',
      })
    } else {
      suggestions.push({
        priority: 'optional',
        reason: 'Composer is still marked running.',
        action: { type: 'composer.settle' },
        hint: 'Call composer.settle after the assistant turn is written.',
      })
    }
  }

  if (
    thread.composerStatus === 'ready' &&
    !gates.pendingApprovalIds.length &&
    !gates.runnableToolIds.length
  ) {
    suggestions.push({
      priority: 'optional',
      reason: 'The thread is idle and ready for the next user message.',
      hint: 'Wait for composer.submit or append another assistant turn if the model still has work.',
    })
  }

  return suggestions
}

export type AgentThreadSeedId = 'empty' | 'refund-support'

export const seedAgentThread = (seed: AgentThreadSeedId): AgentThread => {
  if (seed === 'empty') return createAgentThread()

  return {
    id: 'refund-support',
    composer: '',
    composerStatus: 'ready',
    messages: [
      {
        id: 'user-1',
        role: 'user',
        parts: [{ type: 'text', text: 'Refund order 1842. The item arrived damaged.' }],
      },
      {
        id: 'assistant-1',
        role: 'assistant',
        parts: [
          {
            type: 'plan',
            steps: [
              { id: 'lookup', label: 'Look up order 1842', status: 'done' },
              { id: 'policy', label: 'Check refund policy', status: 'done' },
              { id: 'confirm', label: 'Wait for human approval', status: 'running' },
            ],
          },
          {
            type: 'tool',
            id: 'refund',
            name: 'orders.refund',
            status: 'pending',
            input: 'id=1842 amount=48',
            approvalId: 'refund-approval',
          },
          {
            type: 'approval',
            id: 'refund-approval',
            title: 'Refund $48 to the original payment method',
            description: 'The refund stays blocked until a person approves it.',
            status: 'pending',
          },
          {
            type: 'citations',
            items: [
              {
                id: 'policy',
                title: 'Damaged item refunds',
                href: 'https://example.com/help/refunds',
                source: 'Help center',
              },
            ],
          },
        ],
      },
    ],
  }
}
