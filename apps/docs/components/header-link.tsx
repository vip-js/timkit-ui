import Link from "next/link"
import { RiArrowRightUpLine } from "@remixicon/react"

import { cn } from "@/registry/default/lib/utils"

export default function HeaderLink({
  text,
  href,
  external = false,
  className,
  isNew = false,
}: {
  text: string
  href: string
  external?: boolean
  className?: string
  isNew?: boolean
}) {
  // 翻译导航链接文本
  const translatedText =
    text === "Components"
      ? "组件"
      : text === "Blocks"
        ? "区块"
        : text === "Layouts"
          ? "布局"
          : text === "Easing Classes"
            ? "缓动类"
            : text

  // 翻译New标签
  const newLabel = "新增"

  return (
    <div className="flex items-start gap-1.5">
      {external ? (
        <a
          className={cn(
            "inline-flex gap-0.5 text-sm hover:underline",
            className
          )}
          href={href}
          target="_blank"
        >
          {translatedText}
          <span className="hidden sm:inline">
            {" "}
            <RiArrowRightUpLine
              className="text-muted-foreground/80"
              size={14}
              aria-hidden="true"
            />
          </span>
        </a>
      ) : (
        <>
          <Link
            href={href}
            className={cn(
              "inline-flex gap-0.5 text-sm hover:underline",
              className
            )}
          >
            {translatedText}
          </Link>
          {isNew && (
            <span className="text-muted-foreground/80 text-xs text-[10px] font-medium uppercase">
              {newLabel}
            </span>
          )}
        </>
      )}
    </div>
  )
}
