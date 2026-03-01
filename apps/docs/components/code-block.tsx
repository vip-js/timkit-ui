'use client'

import { JSX, useLayoutEffect, useState } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import type { BundledLanguage } from 'shiki/bundle/web'
import { codeToHast } from 'shiki/bundle/web'

export async function highlight(code: string, lang: BundledLanguage) {
  const hast = await codeToHast(code, {
    lang,
    theme: 'github-dark',
  })

  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
  }) as JSX.Element
}

type Props = {
  code: string | null
  lang: BundledLanguage
  initial?: JSX.Element
  preHighlighted?: JSX.Element | null
  className?: string
}

export default function CodeBlock({ code, lang, initial, preHighlighted, className }: Props) {
  const [content, setContent] = useState<JSX.Element | null>(preHighlighted || initial || null)

  useLayoutEffect(() => {
    // If we have pre-highlighted content, use that
    if (preHighlighted) {
      setContent(preHighlighted)
      return
    }

    let isMounted = true

    if (code) {
      highlight(code, lang).then((result) => {
        if (isMounted) setContent(result)
      })
    } else {
      setContent(
        <pre className="rounded-xl border border-white/10 bg-slate-950 p-4 text-slate-100 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.6)]">
          No code available
        </pre>
      )
    }

    return () => {
      isMounted = false
    }
  }, [code, lang, preHighlighted])

  return content ? (
    <div
      className={`[&_code]:font-mono [&_code]:text-[13px] [&_pre]:max-h-[450px] [&_pre]:overflow-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-slate-950! [&_pre]:p-4 [&_pre]:leading-snug [&_pre]:text-slate-100 [&_pre]:vant-shadow ${className || ''}`}
    >
      {content}
    </div>
  ) : (
    <pre className="rounded-xl border border-white/10 bg-slate-950 p-4 text-slate-100 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.6)]">
      Loading...
    </pre>
  )
}
