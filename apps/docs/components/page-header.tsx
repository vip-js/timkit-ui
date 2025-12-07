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
    <div className={cn('mb-16 text-center', className)}>
      {eyebrow && (
        <p className="text-muted-foreground mb-3 text-xs tracking-[0.2em] uppercase">{eyebrow}</p>
      )}
      <h1 className="font-heading text-foreground mb-3 text-4xl/[1.1] font-bold tracking-tight md:text-5xl/[1.1]">
        {title}
      </h1>
      <p className="text-muted-foreground mx-auto max-w-3xl text-lg">{children}</p>
      {cta && <div className="mt-6 flex justify-center">{cta}</div>}
    </div>
  )
}
