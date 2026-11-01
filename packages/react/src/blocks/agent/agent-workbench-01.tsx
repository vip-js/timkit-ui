'use client'

import {
  AgentComposer,
  AgentMessage,
  AgentPlan,
  ApprovalCard,
  CitationList,
  ToolCall,
} from '@timui/react/agent'

const steps = [
  { id: 'lookup', label: 'Look up order 1842', status: 'done' as const },
  { id: 'policy', label: 'Check the refund policy', status: 'done' as const },
  { id: 'confirm', label: 'Wait for a person to approve the refund', status: 'running' as const },
]

export default function AgentWorkbench01() {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col bg-background text-foreground">
      <header className="border-b px-4 py-4">
        <h1 className="text-base font-semibold">Support agent</h1>
        <p className="text-sm leading-6 text-muted-foreground">Refund request for order 1842</p>
      </header>
      <div className="grid flex-1 content-start gap-4 overflow-y-auto px-4 py-4">
        <AgentMessage role="user">Refund order 1842. The item arrived damaged.</AgentMessage>
        <AgentMessage role="assistant" status="idle">
          <AgentPlan steps={steps} />
          <ToolCall name="orders.get" status="succeeded" input="id=1842">
            Order 1842 is delivered. Total $48. Eligible for refund.
          </ToolCall>
          <ApprovalCard
            title="Refund $48 to the original payment method"
            description="The agent will not send the refund until a person approves it."
            status="pending"
            onApprove={() => undefined}
            onReject={() => undefined}
          />
          <CitationList
            items={[
              {
                id: 'policy',
                title: 'Damaged item refunds',
                href: 'https://example.com/help/refunds',
                source: 'Help center',
              },
            ]}
          />
        </AgentMessage>
      </div>
      <AgentComposer value="" onValueChange={() => undefined} onSubmit={() => undefined} />
    </section>
  )
}
