import { cn } from '@/registry/default/lib/utils'

interface PageHeaderProps {
  title: string
  eyebrow?: string
  cta?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export default function PageHeader({ title, eyebrow, cta, className, children }: PageHeaderProps) {
  return (
    <div className={cn('mb-16 text-left animate-hero-rise', className)}>
      {eyebrow && (
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
          {eyebrow}
        </p>
      )}
      <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground/90 md:text-xl">
        {children}
      </p>
      {cta && <div className="mt-8 flex justify-start">{cta}</div>}
    </div>
  )
}
