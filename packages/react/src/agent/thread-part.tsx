'use client'

import { memo } from 'react'
import type { AgentPart, AgentUiAction } from '@timui/core/agent-thread'

import { ApprovalCard } from './approval-card'
import { CitationList } from './citation-list'
import { AgentPlan } from './plan'
import { ToolCall } from './tool-call'

export type AgentThreadPartProps = {
  part: AgentPart
  dispatch: (action: AgentUiAction) => void
}

export const AgentThreadPart = memo(function AgentThreadPart({
  part,
  dispatch,
}: AgentThreadPartProps) {
  if (part.type === 'text') {
    return <p>{part.text}</p>
  }
  if (part.type === 'plan') {
    return <AgentPlan steps={part.steps} />
  }
  if (part.type === 'tool') {
    return (
      <ToolCall name={part.name} status={part.status} input={part.input}>
        {part.output}
      </ToolCall>
    )
  }
  if (part.type === 'approval') {
    return (
      <ApprovalCard
        title={part.title}
        description={part.description}
        status={part.status}
        onApprove={() => dispatch({ type: 'approval.decide', id: part.id, decision: 'approved' })}
        onReject={() => dispatch({ type: 'approval.decide', id: part.id, decision: 'rejected' })}
      />
    )
  }
  return <CitationList items={part.items} />
})

AgentThreadPart.displayName = 'AgentThreadPart'
