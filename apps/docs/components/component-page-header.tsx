'use client'

import * as React from 'react'

import { useFramework } from '@/hooks/framework-context'
import PageHeader from '@/components/page-header'

interface ComponentPageHeaderProps {
  title: string
  description?: string
  slug: string
}

export function ComponentPageHeader({ title, description, slug }: ComponentPageHeaderProps) {
  const { framework } = useFramework()

  return (
    <>
      <PageHeader title={title}>{description}</PageHeader>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {/* Installation */}
        <div id="installation" className="scroll-m-20 group min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[12px] font-medium text-muted-foreground/80 tracking-tight group-hover:text-foreground transition-colors">
              Installation
            </h2>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border/20 bg-background/90 backdrop-blur-sm transition-all duration-300 group-hover:border-border/30 group-hover:bg-background/95">
            <div className="relative p-3">
              <div className="rounded-lg border border-border/15 bg-slate-950/98 px-3 py-2.5 text-[12px] font-mono text-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.25)] dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] whitespace-pre overflow-x-auto backdrop-blur-sm">
                {framework === 'react'
                  ? `npx @timui/cli add ${slug}`
                  : framework === 'vue'
                    ? `npx @timui/cli add ${slug} --framework vue`
                    : framework === 'weapp'
                      ? `npx @timui/cli add ${slug} --framework weapp`
                      : `npx @timui/cli add ${slug} --framework html`}
              </div>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div id="usage" className="scroll-m-20 group min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[12px] font-medium text-muted-foreground/80 tracking-tight group-hover:text-foreground transition-colors">
              Usage
            </h2>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border/20 bg-background/90 backdrop-blur-sm transition-all duration-300 group-hover:border-border/30 group-hover:bg-background/95">
            <div className="relative p-3">
              <div className="rounded-lg border border-border/15 bg-slate-950/98 px-3 py-2.5 text-[12px] font-mono text-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.25)] dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] whitespace-pre overflow-x-auto backdrop-blur-sm">
                {framework === 'react'
                  ? `import { ${title.replace(/\s+/g, '')} } from "@/components/ui/${slug}"`
                  : framework === 'vue'
                    ? `import ${title.replace(/\s+/g, '')} from "@/components/ui/${slug}.vue"`
                    : framework === 'weapp'
                      ? `"usingComponents": {\n  "${slug}": "@/components/ui/${slug}/${slug}"\n}`
                      : `<!-- Copy HTML from preview -->`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
