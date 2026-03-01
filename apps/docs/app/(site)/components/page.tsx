import Link from 'next/link'
import { ArrowRightIcon, CheckIcon } from 'lucide-react'

import PageHeader from '@/components/page-header'

export const dynamic = 'force-static'
export const runtime = 'nodejs'

export default function ComponentsIndex() {
  return (
    <main className="relative py-10 lg:gap-14 lg:py-14 xl:grid xl:grid-cols-[minmax(0,1fr)_220px]">
      <div className="mx-auto w-full min-w-0">
        <PageHeader title="Modern UI Components" eyebrow="Design System">
          简洁、克制、富有速度感的组件库。致力于提供极致的 UI 开发体验。
        </PageHeader>

        <div className="mt-10 space-y-12">
          {/* Installation Section */}
          <section id="installation" className="scroll-m-24">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-foreground md:text-2xl">
              快速开始
            </h2>
            <div className="glass group relative overflow-hidden rounded-2xl border border-border/40 p-1 shadow-sm transition-all hover:border-border/60">
              <div className="flex flex-col gap-3 p-5">
                <div className="relative overflow-hidden rounded-xl bg-black px-4 py-3 text-[12px] font-mono text-white shadow-2xl transition-all group-hover:bg-zinc-900">
                  <div className="absolute right-4 top-4 opacity-50 transition-opacity group-hover:opacity-100">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <span className="text-zinc-500 mr-2">$</span>
                  npx @timui/cli init
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  运行初始化命令，自动完成 Tailwind CSS 配置、依赖包安装及项目主体结构搭建。
                </p>
              </div>
            </div>
          </section>

          {/* Philosophy / Features */}
          <section id="philosophy" className="scroll-m-24">
            <h2 className="mb-6 text-xl font-bold tracking-tight text-foreground md:text-2xl">
              核心特性
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: '源码所有权',
                  desc: '组件以源码形式直接导入你的项目。你可以 100% 掌控每一行代码，随心所欲定制功能。',
                },
                {
                  title: '逻辑解耦',
                  desc: '基于 Zag.js 构建。状态管理与渲染逻辑高度解耦，确保性能极致且跨框架一致。',
                },
                {
                  title: 'Linear 级感官',
                  desc: '对细节近乎偏执。从 1px 边线到微秒级响应，我们都在追求世界顶尖产品的质感。',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass group relative rounded-2xl border border-border/40 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-border/60 hover:shadow-md"
                >
                  <h3 className="mb-2 text-[14px] font-bold text-foreground">{item.title}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground/80">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ / Next Steps */}
          <section id="next-steps" className="scroll-m-24 border-t border-border/30 pt-12">
            <h2 className="mb-6 text-lg font-bold tracking-tight text-foreground">接下来</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Link
                href="/components/accordion"
                className="glass group flex flex-col gap-2 rounded-2xl border border-border/40 p-5 transition-all hover:-translate-y-1 hover:border-border/60 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold">浏览组件库</span>
                  <ArrowRightIcon className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-[13px] text-muted-foreground/80">
                  探索按钮、对话框、导航菜单等 50+ 高质量组件
                </p>
              </Link>
              <Link
                href="/docs/theming"
                className="glass group flex flex-col gap-2 rounded-2xl border border-border/40 p-5 transition-all hover:-translate-y-1 hover:border-border/60 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold">个性化定制</span>
                  <ArrowRightIcon className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-[13px] text-muted-foreground/80">
                  全面了解如何通过 CSS 变量和 Tailwind 定义你的独特视觉
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Right Sidebar TOC */}
      <div className="hidden xl:block">
        <div className="sticky top-24 self-start">
          <div className="flex flex-col gap-6 px-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              On This Page
            </p>
            <nav>
              <ul className="flex flex-col gap-3 text-[12px] font-medium text-muted-foreground">
                <li>
                  <a href="#installation" className="transition-colors hover:text-foreground">
                    快速开始
                  </a>
                </li>
                <li>
                  <a href="#philosophy" className="transition-colors hover:text-foreground">
                    核心特性
                  </a>
                </li>
                <li>
                  <a href="#next-steps" className="transition-colors hover:text-foreground">
                    后续步骤
                  </a>
                </li>
              </ul>
            </nav>
            <div className="mt-8 border-t border-border/30 pt-8">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                参与贡献
              </p>
              <a
                href="#"
                className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                在 GitHub 上编辑此页
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
