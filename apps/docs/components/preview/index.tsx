'use client'

import { useCallback, useMemo, useState } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import type { SectionCodeGroup } from '@/lib/sections'
import FrameworksTabs, { type FrameworkPane, type FrameworkTab } from '@/components/frameworks-tabs'
import { IconHTML, IconReact, IconVue, IconWeapp } from '@/components/icons'
import MDXRemoteClient from '@/components/mdx-remote-client'
import PreviewSwitch from '@/components/preview-switch'
import Viewport from '@/components/viewport'

const frameworkTabs: FrameworkTab[] = [
  { name: 'React.js', icon: <IconReact />, value: 'react' },
  { name: 'HTML', icon: <IconHTML />, value: 'html' },
  { name: 'Vue.js', icon: <IconVue />, value: 'vue' },
  { name: 'Weapp', icon: <IconWeapp />, value: 'weapp' },
]

type CodeGroups = SectionCodeGroup[]

export default function Preview({
  item,
  mdxSource,
}: {
  item: { title?: string; codeGroups?: CodeGroups }
  mdxSource: MDXRemoteSerializeResult
  slug: string
}) {
  const [isPreview, setPreview] = useState(true)
  const codeGroups = useMemo(() => (item.codeGroups || []) as CodeGroups, [item.codeGroups])

  const resolveFramework = useCallback((group: SectionCodeGroup) => {
    const languageMap: Record<string, FrameworkTab['value']> = {
      tsx: 'react',
      jsx: 'react',
      vue: 'vue',
      html: 'html',
      weapp: 'weapp',
      wxml: 'weapp',
      wxss: 'weapp',
      wxs: 'weapp',
    }
    if (languageMap[group.language]) return languageMap[group.language]

    const matchedById = frameworkTabs.find(
      (tab) => group.id === tab.value || group.id.endsWith(`-${tab.value}`)
    )
    return matchedById?.value
  }, [])

  const frameworksInItem = useMemo(
    () =>
      new Set(
        codeGroups
          .map((g) => resolveFramework(g))
          .filter((val): val is FrameworkTab['value'] => Boolean(val))
      ),
    [codeGroups, resolveFramework]
  )

  const codePanes = useMemo<FrameworkPane[]>(() => {
    return frameworkTabs.map((tab) => {
      const group = codeGroups.find((item) => resolveFramework(item) === tab.value)
      const code = group?.files?.[0]?.code ?? ''
      return { value: tab.value, code }
    })
  }, [codeGroups, resolveFramework])

  const defaultFramework = useMemo(
    () => codePanes.find((pane) => pane.code?.trim())?.value ?? frameworkTabs[0].value,
    [codePanes]
  )

  return (
    <>
      <div className="items-start justify-between sm:flex">
        <h3 className="py-4 text-sm font-semibold text-foreground">{item?.title}</h3>
        <div className="my-3 flex items-center gap-3 sm:mt-0">
          <PreviewSwitch preview={isPreview} setPreview={setPreview} />
        </div>
      </div>

      {isPreview ? (
        <Viewport>
          <MDXRemoteClient mdxSource={mdxSource} />
        </Viewport>
      ) : (
        <FrameworksTabs
          tabs={frameworkTabs}
          panes={codePanes}
          defaultValue={defaultFramework}
          height={640}
        />
      )}
    </>
  )
}
