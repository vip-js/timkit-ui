'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { CheckIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import type { SectionCodeGroup } from '@/lib/sections'
import { IconHTML, IconReact, IconSvelte, IconVue } from '@/components/icons'
import MDXRemoteClient from '@/components/mdx-remote-client'
import PreviewSwitch from '@/components/preview-switch'
import { TabsTrigger } from '@/components/tabs-trigger'
import Viewport from '@/components/viewport'

const SyntaxHighlightLazy = dynamic(
  () => import('@/components/syntax-heighlight').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="text-muted-foreground h-[640px] rounded-xl bg-zinc-900/50 p-4 text-sm">
        加载代码中…
      </div>
    ),
  }
)

const tabs = [
  { name: 'React.js', icon: <IconReact />, value: 'react' },
  { name: 'HTML', icon: <IconHTML />, value: 'html' },
  { name: 'Vue.js', icon: <IconVue />, value: 'vue' },
  { name: 'Svelte.js', icon: <IconSvelte />, value: 'svelte' },
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
  const [isClient, setIsClient] = useState(false)
  const [selectedFramework, setFramework] = useState('react')
  const [copied, setCopied] = useState(false)

  const codeGroups = useMemo(() => (item.codeGroups || []) as CodeGroups, [item.codeGroups])
  const frameworksInItem = useMemo(() => new Set(codeGroups.map((g) => g.id)), [codeGroups])
  const visibleTabs = tabs.map((t) => ({
    ...t,
    available: frameworksInItem.has(t.value),
  }))
  const activeGroup = codeGroups.find((g) => g.id === selectedFramework) || codeGroups[0]
  const activeFile = activeGroup?.files?.[0]

  const copyCode = (code: string) => {
    if (!code) return
    const textare = document.createElement('textarea')
    textare.textContent = code
    document.body.append(textare)
    textare.select()
    document.execCommand('copy')
    textare.remove()
    setCopied(true)
  }

  useEffect(() => {
    setIsClient(true)
    if (codeGroups.length && !frameworksInItem.has(selectedFramework)) {
      setFramework(codeGroups[0].id)
    }
    if (copied) {
      const id = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(id)
    }
  }, [copied, codeGroups, frameworksInItem, selectedFramework])

  return (
    <>
      <div className="items-start justify-between sm:flex">
        <h3 className="py-4 text-sm font-medium text-zinc-300">{item?.title}</h3>
        <div className="my-3 flex items-center gap-3 sm:mt-0">
          <PreviewSwitch preview={isPreview} setPreview={setPreview} />
        </div>
      </div>

      {isPreview && (
        <Viewport>
          <MDXRemoteClient mdxSource={mdxSource} />
        </Viewport>
      )}

      {!isPreview && (
        <>
          {!isClient ? (
            <div className="text-muted-foreground rounded-2xl border border-zinc-800 p-6 text-sm">
              加载代码视图…
            </div>
          ) : (
            <Tabs.Root
              onValueChange={(val) => setFramework(val)}
              className="relative flex-1 overflow-hidden rounded-2xl border border-zinc-800"
              defaultValue={selectedFramework}
            >
              <Tabs.List
                className="flex items-center overflow-auto border-b border-b-zinc-800 bg-[linear-gradient(175deg,_rgba(24,_24,_27,_0.80)_3.95%,_rgba(24,_24,_27,_0.00)_140.01%)] px-4 py-2"
                aria-label="Switch between supported frameworks"
              >
                {visibleTabs.map((tab, idx) => (
                  <TabsTrigger
                    key={idx}
                    value={tab.value}
                    selectedTab={selectedFramework}
                    disabled={!tab.available}
                  >
                    <div className="relative z-10 flex items-center gap-x-2">
                      {tab.icon}
                      {tab.name}
                    </div>
                  </TabsTrigger>
                ))}
              </Tabs.List>

              {activeFile?.code && (
                <button
                  className="absolute top-16 right-6 flex h-7 w-7 items-center justify-center rounded-md text-sm font-medium text-zinc-300 duration-200 hover:bg-zinc-600"
                  onClick={() => copyCode(activeFile.code)}
                  type="button"
                >
                  {copied ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <Square2StackIcon className="h-5 w-5" />
                  )}
                </button>
              )}

              {visibleTabs.map((tab, idx) => {
                const group = codeGroups.find((g) => g.id === tab.value) || activeGroup
                const file = group?.files?.[0]
                return (
                  <Tabs.Content
                    key={idx}
                    className="overflow-auto p-4 delay-1000 duration-1000 data-[state=active]:opacity-100 data-[state=inactive]:opacity-0"
                    value={tab.value}
                    forceMount
                  >
                    {file?.code ? (
                      <motion.div
                        className="h-[640px] opacity-0"
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.9 }}
                      >
                        <SyntaxHighlightLazy code={file.code} />
                      </motion.div>
                    ) : (
                      <div className="rounded-xl bg-zinc-800 py-12 text-center text-sm text-white">
                        当前组件未提供 {tab.name} 代码片段
                      </div>
                    )}
                  </Tabs.Content>
                )
              })}
            </Tabs.Root>
          )}
        </>
      )}
    </>
  )
}
