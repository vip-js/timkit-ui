import Link from "next/link"

import {
  getRegistryCount,
  getUnifiedFamilies,
  type UnifiedGroup,
} from "@/lib/unified-components"
import ComponentCard from "@/components/component-card"
import ComponentExample from "@/components/component-example"
import PageGrid from "@/components/page-grid"
import PageHeader from "@/components/page-header"

export const dynamic = "force-static"
export const runtime = "nodejs"

export default async function ComponentsIndex() {
  const families = await getUnifiedFamilies()
  const registryCount = getRegistryCount()

  const renderGroup = (group: UnifiedGroup) => (
    <section key={group.id} id={group.slug} className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.08em] uppercase">
            {group.slug}
          </p>
          <h3 className="text-lg font-semibold">{group.title}</h3>
          <p className="text-muted-foreground text-xs">共 {group.count} 个</p>
        </div>
        <Link
          href={group.href}
          className="text-primary text-sm hover:underline"
        >
          查看详情
        </Link>
      </div>

      <PageGrid>
        {group.entries.map((entry) => (
          <ComponentCard
            key={entry.id}
            component={
              entry.variant === "registry"
                ? entry.component!
                : {
                    name: entry.id,
                    type: "registry:component",
                    dependencies: [],
                    files: [],
                    meta: { colSpan: 3 },
                  }
            }
          >
            {entry.variant === "registry" && entry.component ? (
              group.slug === "tree" ? (
                <div className="border-border/70 bg-muted/40 rounded-xl border border-dashed p-4 text-left">
                  <p className="text-foreground text-sm font-semibold">
                    {entry.title}
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Tree 组件依赖 headless-tree，仅在分类页加载，避免聚合页的
                    Hook 冲突。
                  </p>
                  <Link
                    href={`/${group.slug}`}
                    className="text-primary mt-3 inline-flex text-sm font-medium hover:underline"
                  >
                    前往分类页预览
                  </Link>
                </div>
              ) : (
                <ComponentExample
                  variant="registry"
                  component={entry.component}
                />
              )
            ) : (
              <div className="border-border/70 bg-muted/40 rounded-xl border p-4 text-left">
                <p className="text-foreground text-sm font-semibold">
                  {entry.title}
                </p>
                {entry.description ? (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {entry.description}
                  </p>
                ) : null}
                <Link
                  href={group.href}
                  className="text-primary mt-3 inline-flex text-sm font-medium hover:underline"
                >
                  在区块页查看预览
                </Link>
              </div>
            )}
          </ComponentCard>
        ))}
      </PageGrid>
    </section>
  )

  return (
    <div className="space-y-10">
      <PageHeader
        title="全部组件预览"
        eyebrow="components"
        cta={
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <Link
              href="/"
              className="text-primary text-sm font-medium hover:underline"
            >
              返回首页
            </Link>
            <Link
              href="#sections"
              className="text-muted-foreground hover:text-primary text-sm font-medium"
            >
              跳转到区块库
            </Link>
          </div>
        }
      >
        将 shadcn 套件（Web 控件）与 Float UI
        区块合并展示，一页对比、筛选、复制。
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[240px,1fr]">
        <aside className="border-border/70 bg-card/60 top-24 hidden h-fit rounded-xl border p-4 lg:sticky lg:block">
          <p className="text-muted-foreground mb-3 text-xs tracking-[0.08em] uppercase">
            快捷导航
          </p>
          <div className="space-y-2 text-sm">
            {families.map((family) => (
              <div key={family.id} className="space-y-2">
                <a
                  className="text-foreground hover:text-primary block"
                  href={`#${family.id}`}
                >
                  {family.title}
                </a>
                {family.groups.map((group) => (
                  <a
                    key={group.id}
                    className="text-muted-foreground hover:text-primary block"
                    href={`#${group.slug}`}
                  >
                    {group.title}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-14">
          {families.map((family) => (
            <section key={family.id} id={family.id} className="space-y-8">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-muted-foreground text-sm tracking-[0.08em] uppercase">
                    {family.title}
                  </p>
                  <h2 className="text-2xl font-semibold">
                    {family.description}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {family.groups.length} 个分类 • {family.total} 个组件/区块
                    {family.id === "shadcn"
                      ? ` • ${registryCount} 个注册组件`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                {family.groups.map((group) => renderGroup(group))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
