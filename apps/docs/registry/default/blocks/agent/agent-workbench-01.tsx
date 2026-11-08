'use client'

import type { AgentThread } from '@timui/core/agent-thread'
import { AgentThreadView, useAgentThreadController } from '@timui/react/agent'

const initialThread: AgentThread = {
  id: 'refund-1842',
  composer: '',
  composerStatus: 'ready',
  messages: [
    {
      id: 'user-1',
      role: 'user',
      status: 'idle',
      parts: [{ type: 'text', text: 'Refund order 1842. The item arrived damaged.' }],
    },
    {
      id: 'assistant-1',
      role: 'assistant',
      status: 'idle',
      parts: [
        {
          type: 'plan',
          steps: [
            { id: 'lookup', label: 'Look up order 1842', status: 'done' },
            { id: 'policy', label: 'Check the refund policy', status: 'done' },
            { id: 'confirm', label: 'Wait for a person to approve the refund', status: 'running' },
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

export default function AgentWorkbench01() {
  const { thread, dispatch } = useAgentThreadController(initialThread)

  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col bg-background text-foreground">
      <header className="border-b px-4 py-4">
        <h1 className="text-base font-semibold">Support agent</h1>
        <p className="text-sm leading-6 text-muted-foreground">Refund request for order 1842</p>
      </header>
      <AgentThreadView
        className="flex flex-1 flex-col justify-between px-4 py-4"
        thread={thread}
        onAction={dispatch}
      />
    </section>
  )
}
