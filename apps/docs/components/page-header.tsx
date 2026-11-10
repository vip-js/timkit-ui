import type { ReactNode } from 'react'

import { cn } from '@/registry/default/lib/utils'

interface PageHeaderProps {
  title: string
  eyebrow?: string
  cta?: ReactNode
  className?: string
  /** 组件文档内页使用更紧凑的标题尺度 */
  size?: 'default' | 'compact'
  children: ReactNode
}

export default function PageHeader({
  title,
  eyebrow,
  cta,
  className,
  size = 'default',
  children,
}: PageHeaderProps) {
  const compact = size === 'compact'
  return (
    <div className={cn(compact ? 'mb-10' : 'mb-16', 'text-left animate-hero-rise', className)}>
      {eyebrow && (
        <p
          className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80',
            compact ? 'mb-2' : 'mb-4'
          )}
        >
          {eyebrow}
        </p>
      )}
      <h1
        className={cn(
          'font-heading font-bold tracking-tight text-foreground',
          compact ? 'mb-3 text-2xl md:text-3xl' : 'mb-4 text-4xl md:text-5xl lg:text-6xl'
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          'max-w-2xl leading-relaxed text-muted-foreground/90',
          compact ? 'text-[15px] md:text-base' : 'text-lg md:text-xl'
        )}
      >
        {children}
      </p>
      {cta && <div className={cn('flex justify-start', compact ? 'mt-5' : 'mt-8')}>{cta}</div>}
    </div>
  )
}
