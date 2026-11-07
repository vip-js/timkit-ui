'use client'

import { useState } from 'react'
import { AgentMessage, ApprovalCard } from '@timui/react/agent'

export default function Component() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  return (
    <div className="space-y-3">
      <AgentMessage role="user">Refund order 1842.</AgentMessage>
      <ApprovalCard
        title="Refund 48 dollars"
        description="Wait for a person before sending the refund."
        status={status}
        onApprove={() => setStatus('approved')}
        onReject={() => setStatus('rejected')}
      />
    </div>
  )
}
