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
      <PageHeader title={title} size="compact" eyebrow="Component">
        {description}
      </PageHeader>

      <div className="mt-2 grid gap-4 md:grid-cols-2">
        {/* Installation */}
        <div id="installation" className="scroll-m-20 min-w-0">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground">安装 Installation</p>
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-sm">
            <div className="relative p-3">
              <div className="overflow-x-auto rounded-lg border border-border/20 bg-slate-950/98 px-3 py-2.5 text-[12px] font-mono leading-relaxed text-slate-100 whitespace-pre-wrap">
                {framework === 'react'
                  ? `npx shadcn@latest add https://ui.timkit.cn/r/${slug}.json`
                  : framework === 'vue'
                    ? `curl https://ui.timkit.cn/r/${slug}.json`
                    : framework === 'weapp'
                      ? `curl https://ui.timkit.cn/r/${slug}.json`
                      : `curl https://ui.timkit.cn/r/${slug}.json`}
              </div>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div id="usage" className="scroll-m-20 min-w-0">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground">用法 Usage</p>
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-sm">
            <div className="relative p-3">
              <div className="overflow-x-auto rounded-lg border border-border/20 bg-slate-950/98 px-3 py-2.5 text-[12px] font-mono leading-relaxed text-slate-100 whitespace-pre-wrap">
                {framework === 'react'
                  ? `import { ${title.replace(/\s+/g, '')} } from "@/components/ui/${slug}"`
                  : framework === 'vue'
                    ? `import { ${title.replace(/\s+/g, '')} } from "@timui/vue"`
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
