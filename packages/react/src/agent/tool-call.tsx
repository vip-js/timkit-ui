import * as React from 'react'
import { cn } from '@timui/core'

const { memo } = React

export type ToolCallStatus = 'pending' | 'running' | 'succeeded' | 'failed'

export type ToolCallProps = {
  name: string
  status?: ToolCallStatus
  input?: string
  className?: string
  children?: React.ReactNode
}

const statusLabel: Record<ToolCallStatus, string> = {
  pending: 'Waiting',
  running: 'Running',
  succeeded: 'Done',
  failed: 'Failed',
}

export const ToolCall = memo(function ToolCall({
  name,
  status = 'pending',
  input,
  className,
  children,
}: ToolCallProps) {
  return (
    <section
      data-slot="tool-call"
      data-status={status}
      className={cn('grid gap-2 rounded-lg border bg-background p-3 text-sm', className)}
    >
      <header className="flex items-center justify-between gap-3">
        <h3 className="min-w-0 truncate font-medium">
          <span className="text-muted-foreground">Tool</span> {name}
        </h3>
        <span aria-live="polite" className="shrink-0 text-xs font-medium text-muted-foreground">
          {statusLabel[status]}
        </span>
      </header>
      {input ? (
        <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs leading-5 text-foreground">
          {input}
        </pre>
      ) : null}
      {children ? <div className="leading-6">{children}</div> : null}
    </section>
  )
})

ToolCall.displayName = 'ToolCall'
