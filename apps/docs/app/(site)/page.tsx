import Image from 'next/image'
import Link from 'next/link'
import { RiGithubFill } from '@remixicon/react'

import { getCategories } from '@/lib/catalog'
import SearchButton from '@/components/search-button'
import { SubscribeBottom } from '@/components/subscribe-form'
import SupportedFrameworks from '@/components/supported-frameworks'

export default function Page() {
  const categories = getCategories()
  return (
    <div data-home className="relative px-4 pb-16 pt-14 md:pb-24 md:pt-20 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] left-[5%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] right-[5%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-6">
              <div className="animate-hero-rise inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                Timkit UI v1.0
              </div>

              <div className="space-y-3">
                <h1 className="animate-hero-rise font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                  极简设计 <br />
                  <span className="linear-gradient-text">极致体验</span>
                </h1>
                <p className="animate-hero-rise text-muted-foreground text-base leading-relaxed max-w-2xl lg:mx-0 mx-auto md:text-lg">
                  灵感源自
                  Linear，专注结构与细节。为开发者打造的高质量组件库，助你构建世界级数字产品。
                </p>
              </div>

              <div className="animate-hero-rise flex flex-col gap-3 sm:flex-row sm:items-center justify-center lg:justify-start">
                <Link
                  href="/components"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-foreground px-6 py-3 text-[13px] font-bold text-background transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-foreground/10"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    开始探索
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <a
                  href="https://github.com/origin-space/originui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group inline-flex items-center justify-center rounded-xl border border-border/40 px-6 py-3 text-[13px] font-bold text-foreground transition-all hover:bg-muted/50 hover:border-border/60 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <RiGithubFill className="mr-2 h-5 w-5" />
                  GitHub 源码
                </a>
              </div>
            </div>

            <div className="animate-hero-rise grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 pt-6">
              {[
                { label: '精心雕琢', value: '240+', desc: '开箱即用组件' },
                { label: '视觉区块', value: '180+', desc: '完整场景布局' },
                { label: '框架全覆盖', value: '4+', desc: '跨框架一致性' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center lg:items-start">
                  <div className="font-heading text-2xl font-bold text-foreground">
                    {item.value}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">
                    {item.label}
                  </div>
                  <div className="text-[12px] font-medium text-muted-foreground/50 mt-0.5">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-24">
        <div className="mb-10 text-center lg:text-left">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            组件库全景
          </h2>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">
            探索每一个精选分类，构建你的下一个杰作
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories
            .sort((a, b) => {
              if (a.isNew && !b.isNew) return -1
              if (!a.isNew && b.isNew) return 1
              return 0
            })
            .map((category, index) => (
              <div
                key={category.slug}
                className="animate-hero-rise"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CategoryCard
                  slug={category.slug}
                  name={category.name}
                  componentsCount={category.components.length}
                  isNew={category.isNew}
                />
              </div>
            ))}
        </div>
      </div>

      <div className="mt-28">
        <SupportedFrameworks />
      </div>

      <div className="mt-24">
        <SubscribeBottom />
      </div>
    </div>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  )
}

type CategoryCardProps = {
  slug: string
  name: string
  componentsCount?: number
  isNew?: boolean
}

function CategoryCard({ slug, name, componentsCount, isNew = false }: CategoryCardProps) {
  const href = `/components#${slug}`
  const imageBasePath = `/thumbs/${slug}`
  const alt = `${name} 组件`
  const isComingSoon = componentsCount === undefined

  return (
    <div className="glass group relative flex flex-col gap-4 rounded-2xl border border-border/40 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-border/60 hover:shadow-xl dark:shadow-none dark:hover:border-primary/20">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/40 bg-muted/20">
        {isComingSoon ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 shadow-sm">
              Coming Soon
            </span>
          </div>
        ) : (
          <Link href={href} className="absolute inset-0 z-10" tabIndex={-1} aria-hidden="true" />
        )}
        {isNew && (
          <div className="absolute left-3 top-3 z-20">
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg">
              New
            </span>
          </div>
        )}
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ImageComponent imageBasePath={imageBasePath} alt={alt} />
        </div>
      </div>
      <div className="flex flex-col px-1 pb-1">
        <h3 className="font-heading text-[15px] font-bold text-foreground">
          {!isComingSoon ? (
            <Link href={href} className="transition-colors hover:text-primary">
              {name}
            </Link>
          ) : (
            <span className="text-muted-foreground/80">{name}</span>
          )}
        </h3>
        <p className="mt-1 text-[12px] font-medium text-muted-foreground/60">
          {!isComingSoon ? `${componentsCount} Components` : 'Stay Tuned'}
        </p>
      </div>
    </div>
  )
}

type ImageComponentProps = {
  imageBasePath: string
  alt: string
}

function ImageComponent({ imageBasePath, alt }: ImageComponentProps) {
  return (
    <>
      <Image
        className="w-full dark:hidden"
        src={`${imageBasePath}.png`}
        alt={alt}
        width={268}
        height={198}
      />
      <Image
        className="hidden w-full dark:block"
        src={`${imageBasePath}-dark.png`}
        alt={`${alt} 暗色主题`}
        width={268}
        height={198}
      />
    </>
  )
}
