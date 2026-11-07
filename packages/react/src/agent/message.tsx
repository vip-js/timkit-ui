import * as React from 'react'
import { cn } from '@timui/core'

const { memo } = React

export type AgentMessageRole = 'user' | 'assistant' | 'system'
export type AgentMessageStatus = 'idle' | 'streaming' | 'error'

export type AgentMessageProps = {
  role: AgentMessageRole
  status?: AgentMessageStatus
  name?: string
  className?: string
  children?: React.ReactNode
}

const roleLabel: Record<AgentMessageRole, string> = {
  user: 'You',
  assistant: 'Agent',
  system: 'System',
}

export const AgentMessage = memo(function AgentMessage({
  role,
  status = 'idle',
  name,
  className,
  children,
}: AgentMessageProps) {
  const label = name || roleLabel[role]
  const isUser = role === 'user'

  return (
    <article
      data-slot="agent-message"
      data-role={role}
      data-status={status}
      className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start', className)}
    >
      <div
        className={cn(
          'grid max-w-[42rem] gap-1 rounded-lg border px-3 py-2 text-sm leading-6',
          role === 'system' && 'w-full border-dashed bg-muted/40 text-muted-foreground',
          role === 'assistant' && 'bg-card text-card-foreground',
          isUser && 'bg-primary text-primary-foreground'
        )}
      >
        <div className="flex items-center gap-2 text-xs font-medium">
          <span>{label}</span>
          {status === 'streaming' ? (
            <span className="inline-flex items-center gap-1" aria-live="polite">
              <span>Responding</span>
              <span
                aria-hidden="true"
                className="inline-block h-3 w-px bg-current motion-safe:animate-pulse"
              />
            </span>
          ) : null}
          {status === 'error' ? <span aria-live="polite">Failed</span> : null}
        </div>
        <div className="grid gap-3">{children}</div>
      </div>
    </article>
  )
})

AgentMessage.displayName = 'AgentMessage'
