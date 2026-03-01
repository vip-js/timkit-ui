import { Button } from '@timui/react'

export default function Cta() {
  return (
    <div className="mt-16 md:mt-20">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 px-6 py-10 shadow-[0_12px_30px_-20px_rgba(12,20,38,0.22)] sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(75,118,255,0.08),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Suggestion Box
            </p>
            <h2 className="font-heading text-foreground mt-3 text-3xl/[1.1] font-semibold tracking-tight md:text-4xl/[1.1]">
              Didn&apos;t find what you were looking for?
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl text-sm md:text-base">
              Tell us which component you want next. We track suggestions and prioritize them for
              the roadmap.
            </p>
          </div>
          <Button asChild className="rounded-full px-6">
            <a
              href="https://github.com/origin-space/originui/discussions/categories/suggestions"
              target="_blank"
              rel="noreferrer"
            >
              Suggest component
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
