import Link from 'next/link'

import { getRegistryCount, getUnifiedFamilies, type UnifiedGroup } from '@/lib/unified-components'
import { GroupGrid } from '@/components/group-grid'
import PageHeader from '@/components/page-header'

export const dynamic = 'force-static'
export const runtime = 'nodejs'

export default async function ComponentsIndex() {
  const families = await getUnifiedFamilies()
  const registryCount = getRegistryCount()

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(94,234,212,0.14),transparent_32%),linear-gradient(135deg,#0b1021,#0f172a)] px-6 py-10 shadow-[0_24px_120px_-50px_rgba(8,47,73,0.9)] sm:px-10">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_100%)]" />
        </div>
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm tracking-[0.22em] text-teal-100/80 uppercase">
              Components & Sections
            </p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              简洁、克制、富有速度感的组件库
            </h1>
            <p className="max-w-2xl text-sm text-slate-100/80 sm:text-base">
              参考 Linear
              的极简与流畅性设计：柔和对比、恰到好处的留白、紧凑的信息呈现，一键预览多框架代码。
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-100/80">
              <span className="rounded-full bg-white/10 px-3 py-1">{registryCount} 组件</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{families.length} 集合</span>
              <Link
                href="/search"
                className="rounded-full border border-white/30 px-3 py-1 font-medium hover:border-white hover:text-white"
              >
                全局搜索
              </Link>
            </div>
          </div>
          <div className="relative flex h-full min-w-[240px] flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-50 shadow-inner">
            <p className="text-xs tracking-[0.18em] text-teal-100/70 uppercase">快捷导航</p>
            <div className="grid grid-cols-1 gap-1 text-sm">
              {families.map((family) => (
                <a
                  key={family.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-100/90 transition hover:bg-white/10 hover:text-white"
                  href={`#${family.id}`}
                >
                  <span>{family.title}</span>
                  <span className="text-xs text-slate-100/60">{family.total}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 space-y-12">
        {families.map((family) => (
          <section key={family.id} id={family.id} className="space-y-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-muted-foreground text-sm tracking-[0.12em] uppercase">
                  {family.title}
                </p>
                <h2 className="text-2xl font-semibold">{family.description}</h2>
                <p className="text-muted-foreground text-sm">
                  {family.groups.length} 个分类 • {family.total} 个组件/区块
                  {family.id === 'shadcn' ? ` • ${registryCount} 个注册组件` : ''}
                </p>
              </div>
              <Link
                href="/search"
                className="border-border/60 hover:border-primary hover:text-primary rounded-full border px-4 py-2 text-sm font-medium"
              >
                全局搜索
              </Link>
            </div>

            <div className="space-y-6">
              {family.groups.map((group) => (
                <GroupGrid key={group.id} group={group} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
