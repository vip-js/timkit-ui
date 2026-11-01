'use client'

import * as React from 'react'
import { cn } from '@timui/core'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type ApprovalCardProps = {
  title: string
  description?: string
  status?: ApprovalStatus
  approveLabel?: string
  rejectLabel?: string
  onApprove?: () => void
  onReject?: () => void
  className?: string
}

const receipt: Record<Exclude<ApprovalStatus, 'pending'>, string> = {
  approved: 'Approved',
  rejected: 'Rejected',
}

export function ApprovalCard({
  title,
  description,
  status = 'pending',
  approveLabel = 'Approve',
  rejectLabel = 'Reject',
  onApprove,
  onReject,
  className,
}: ApprovalCardProps) {
  return (
    <section
      data-slot="approval-card"
      data-status={status}
      className={cn('grid gap-3 rounded-lg border bg-card p-3 text-sm', className)}
    >
      <div className="grid gap-1">
        <h3 className="font-medium leading-6">{title}</h3>
        {description ? <p className="leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {status === 'pending' ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Approval actions">
          <button
            type="button"
            onClick={onReject}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border px-4 font-medium"
          >
            {rejectLabel}
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 font-medium text-primary-foreground"
          >
            {approveLabel}
          </button>
        </div>
      ) : (
        <p aria-live="polite" className="text-xs font-medium">
          Receipt: {receipt[status]}
        </p>
      )}
    </section>
  )
}
