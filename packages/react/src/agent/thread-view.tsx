'use client'

import { useCallback, useMemo } from 'react'
import type { AgentThread, AgentUiAction } from '@timui/core/agent-thread'

import { AgentComposer } from './composer'
import { AgentThreadMessageRow } from './thread-message'

export type AgentThreadViewProps = {
  thread: AgentThread
  onAction: (action: AgentUiAction) => void
  className?: string
}

export function AgentThreadView({ thread, onAction, className }: AgentThreadViewProps) {
  const onComposerChange = useCallback(
    (text: string) => onAction({ type: 'composer.change', text }),
    [onAction]
  )
  const onComposerSubmit = useCallback(
    (text: string) => onAction({ type: 'composer.submit', text }),
    [onAction]
  )
  const rows = useMemo(() => thread.messages, [thread.messages])

  return (
    <section data-slot="agent-thread" className={className}>
      <div className="grid gap-4">
        {rows.map((message) => (
          <AgentThreadMessageRow key={message.id} message={message} dispatch={onAction} />
        ))}
      </div>
      <AgentComposer
        value={thread.composer}
        status={thread.composerStatus}
        onValueChange={onComposerChange}
        onSubmit={onComposerSubmit}
      />
    </section>
  )
}
