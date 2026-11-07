'use client'

import * as React from 'react'
import { cn } from '@timui/core'

export type AgentComposerStatus = 'ready' | 'running'

export type AgentComposerProps = {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (value: string) => void
  status?: AgentComposerStatus
  placeholder?: string
  submitLabel?: string
  className?: string
}

export const AgentComposer = React.memo(function AgentComposer({
  value,
  onValueChange,
  onSubmit,
  status = 'ready',
  placeholder = 'Message the agent',
  submitLabel = 'Send',
  className,
}: AgentComposerProps) {
  const running = status === 'running'
  const canSend = value.trim().length > 0 && !running

  const submit = () => {
    if (!canSend) return
    onSubmit(value.trim())
  }

  return (
    <form
      data-slot="agent-composer"
      data-status={status}
      className={cn('flex items-end gap-2 border-t bg-background p-3', className)}
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <label className="grid min-w-0 flex-1 gap-1 text-xs font-medium text-muted-foreground">
        Message
        <textarea
          value={value}
          rows={2}
          disabled={running}
          placeholder={placeholder}
          className="min-h-11 w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
        />
      </label>
      <button
        type="submit"
        disabled={!canSend}
        aria-label={running ? 'Agent is running' : submitLabel}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {running ? 'Running' : submitLabel}
      </button>
    </form>
  )
})

AgentComposer.displayName = 'AgentComposer'
