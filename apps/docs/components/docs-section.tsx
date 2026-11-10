import type { ReactNode } from 'react'

import { cn } from '@/registry/default/lib/utils'

type DocsSectionHeaderProps = {
  id?: string
  title: string
  subtitle?: string
  className?: string
  /** English + 中文，用于组件文档页的层次说明 */
  kicker?: string
}

export function DocsSectionHeader({
  id,
  title,
  subtitle,
  kicker,
  className,
}: DocsSectionHeaderProps) {
  return (
    <header
      id={id}
      className={cn('scroll-m-24', className)}
    >
      {kicker ? (
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground">{kicker}</p>
      ) : null}
      <div className="flex items-baseline gap-3">
        <h2 className="shrink-0 text-lg font-semibold tracking-tight text-foreground md:text-xl">{title}</h2>
        <div className="h-px min-w-[2rem] flex-1 bg-border/50" aria-hidden />
      </div>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">{subtitle}</p>
      ) : null}
    </header>
  )
}

type DocsProsePanelProps = {
  children: ReactNode
  className?: string
}

/** 长段说明（契约 / 键盘）：更易扫读的容器 */
export function DocsProsePanel({ children, className }: DocsProsePanelProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/45 bg-muted/15 px-4 py-4 md:px-5 md:py-5',
        'text-[13px] leading-[1.75] text-muted-foreground',
        className
      )}
    >
      {children}
    </div>
  )
}
