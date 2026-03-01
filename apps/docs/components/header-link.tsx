import Link from 'next/link'
import { RiArrowRightUpLine } from '@remixicon/react'

import { cn } from '@/registry/default/lib/utils'

export default function HeaderLink({
  text,
  href,
  external = false,
  className,
  isNew = false,
  isActive = false,
}: {
  text: string
  href: string
  external?: boolean
  className?: string
  isNew?: boolean
  isActive?: boolean
}) {
  // 翻译导航链接文本
  const translatedText =
    text === 'Components'
      ? '组件'
      : text === 'Blocks'
        ? '区块'
        : text === 'Layouts'
          ? '布局'
          : text === 'Easing Classes'
            ? '缓动类'
            : text

  // 翻译New标签
  const newLabel = '新增'

  return (
    <div className="flex items-center gap-1.5">
      {external ? (
        <a
          className={cn(
            'inline-flex items-center gap-1 text-sm font-medium hover:text-foreground',
            className
          )}
          href={href}
          target="_blank"
        >
          {translatedText}
          <span className="hidden sm:inline">
            {' '}
            <RiArrowRightUpLine className="text-muted-foreground/80" size={14} aria-hidden="true" />
          </span>
        </a>
      ) : (
        <div className="relative inline-flex">
          <Link
            href={href}
            className={cn(
              'relative inline-flex items-center gap-0.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-foreground text-background shadow-xs'
                : 'text-muted-foreground/80 hover:bg-muted/50 hover:text-foreground',
              className
            )}
          >
            {translatedText}
            {isNew && (
              <span className="pointer-events-none absolute -top-1.5 -right-1.5 rounded-full bg-primary px-1.5 py-[1px] text-[9px] leading-none font-semibold text-primary-foreground shadow-sm">
                {newLabel}
              </span>
            )}
          </Link>
        </div>
      )}
    </div>
  )
}
