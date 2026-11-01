import { cn } from '@timui/core'

export type AgentPlanStatus = 'pending' | 'running' | 'done' | 'failed'

export type AgentPlanStep = {
  id: string
  label: string
  detail?: string
  status: AgentPlanStatus
}

export type AgentPlanProps = {
  steps: AgentPlanStep[]
  title?: string
  className?: string
}

const statusLabel: Record<AgentPlanStatus, string> = {
  pending: 'Waiting',
  running: 'Running',
  done: 'Done',
  failed: 'Failed',
}

export function AgentPlan({ steps, title = 'Plan', className }: AgentPlanProps) {
  return (
    <section data-slot="agent-plan" className={cn('grid gap-2 text-sm', className)}>
      <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      <ol className="grid gap-2">
        {steps.map((step, index) => (
          <li
            key={step.id}
            data-status={step.status}
            className="grid gap-0.5 rounded-md border px-3 py-2 leading-6"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-medium">
                {index + 1}. {step.label}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {statusLabel[step.status]}
              </span>
            </div>
            {step.detail ? <p className="text-muted-foreground">{step.detail}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
