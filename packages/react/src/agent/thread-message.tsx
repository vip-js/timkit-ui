'use client'

import { memo } from 'react'
import type { AgentThreadMessage, AgentUiAction } from '@timui/core/agent-thread'

import { AgentMessage } from './message'
import { AgentThreadPart } from './thread-part'

export const AgentThreadMessageRow = memo(function AgentThreadMessageRow({
  message,
  dispatch,
}: {
  message: AgentThreadMessage
  dispatch: (action: AgentUiAction) => void
}) {
  return (
    <AgentMessage role={message.role} status={message.status}>
      {message.parts.map((part, index) => (
        <AgentThreadPart
          key={
            part.type === 'tool' || part.type === 'approval' ? part.id : `${message.id}-${index}`
          }
          part={part}
          dispatch={dispatch}
        />
      ))}
    </AgentMessage>
  )
})

AgentThreadMessageRow.displayName = 'AgentThreadMessageRow'
