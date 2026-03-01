'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import mergeTW from '@/utils/merge-tw'
import { CheckIcon, Square2StackIcon } from '@heroicons/react/24/outline'

import SyntaxHighlight from '@/components/syntax-heighlight'
import { TabsTrigger } from '@/components/tabs-trigger'
import { Tabs, TabsContent, TabsList } from '@/registry/default/ui/tabs'

export type FrameworkTab = {
  name: string
  value: string
  icon?: ReactNode
  language?: string
}

export type FrameworkPane = {
  value: string
  code?: string
}

type Props = {
  tabs: FrameworkTab[]
  panes: FrameworkPane[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  height?: number
  showCopy?: boolean
  disableUnavailableTabs?: boolean
  renderEmpty?: (tab: FrameworkTab) => ReactNode
}

type TabState = FrameworkTab & { code: string; available: boolean }

const FrameworksTabs = ({
  tabs,
  panes,
  defaultValue,
  value,
  onValueChange,
  className = '',
  height = 640,
  showCopy = true,
  disableUnavailableTabs = false,
  renderEmpty,
}: Props) => {
  const tabStates = useMemo<TabState[]>(() => {
    const paneMap = panes.reduce<Map<string, string>>((map, pane) => {
      map.set(pane.value, pane.code?.trim() ?? '')
      return map
    }, new Map())

    return tabs.map((tab) => {
      const code = paneMap.get(tab.value) ?? ''
      return {
        ...tab,
        code,
        available: code.length > 0,
      }
    })
  }, [tabs, panes])

  const firstAvailable = tabStates.find((tab) => tab.available) ?? tabStates[0]

  // Uncontrolled state
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? firstAvailable?.value ?? tabs[0]?.value ?? ''
  )
  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : internalValue

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  const [copied, setCopied] = useState(false)

  // Sync internal state with defaultValue changes if uncontrolled
  useEffect(() => {
    if (isControlled || !defaultValue) return
    const canUseDefault = tabStates.some(
      (tab) => tab.value === defaultValue && (tab.available || !disableUnavailableTabs)
    )
    if (canUseDefault && defaultValue !== internalValue) {
      setInternalValue(defaultValue)
    }
  }, [defaultValue, disableUnavailableTabs, internalValue, tabStates, isControlled])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(timer)
  }, [copied])

  const activeTab = tabStates.find((tab) => tab.value === selectedValue) ?? firstAvailable
  const activeCode = activeTab?.code ?? ''

  const fallbackContent =
    renderEmpty ??
    ((tab: FrameworkTab) => (
      <div
        className="flex items-center justify-center rounded-2xl border border-border/60 bg-card/80 text-sm text-muted-foreground"
        style={{ minHeight: height }}
      >
        当前组件未提供 {tab.name} 代码片段
      </div>
    ))

  const handleCopy = () => {
    if (!activeCode) return
    const textarea = document.createElement('textarea')
    textarea.value = activeCode
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
    setCopied(true)
  }

  return (
    <Tabs
      className={mergeTW(
        'relative flex-1 overflow-hidden rounded-xl border border-border/30 bg-background/95 backdrop-blur-sm shadow-[0_2px_8px_0_rgba(15,23,42,0.06),0_1px_3px_0_rgba(15,23,42,0.04)] dark:shadow-[0_4px_12px_0_rgba(0,0,0,0.08),0_2px_4px_0_rgba(0,0,0,0.04)]',
        className
      )}
      value={selectedValue || ''}
      onValueChange={handleValueChange}
    >
      <TabsList
        className="flex items-center gap-1 overflow-auto border-b border-border/20 bg-background/80 backdrop-blur-sm px-4 py-3"
        aria-label="Switch between supported frameworks"
      >
        {tabStates.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            selectedTab={selectedValue || ''}
            disabled={disableUnavailableTabs && !tab.available}
          >
            <div className="relative z-10 flex items-center gap-x-2">
              {tab.icon}
              {tab.name}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {showCopy && activeCode && (
        <button
          type="button"
          className="absolute top-20 right-6 z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-border/30 bg-background/90 text-sm font-medium text-muted-foreground backdrop-blur-sm duration-200 hover:border-border/50 hover:bg-muted/60 hover:text-foreground transition-all"
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? <CheckIcon className="h-4 w-4" /> : <Square2StackIcon className="h-4 w-4" />}
        </button>
      )}

      {tabStates.map((tab) => (
        <TabsContent
          key={tab.value}
          className="flex flex-col items-start justify-start overflow-auto p-5 text-left"
          value={tab.value}
          style={{ minHeight: height }}
        >
          {tab.available ? (
            <div className="w-full h-full rounded-lg border border-border/20 bg-slate-950/95 p-4 text-left shadow-[0_4px_12px_-4px_rgba(15,23,42,0.3)] dark:shadow-[0_6px_16px_-4px_rgba(0,0,0,0.4)] backdrop-blur-sm">
              <SyntaxHighlight
                code={tab.code}
                language={tab.language || 'jsx'}
                className="text-slate-100"
              />
            </div>
          ) : (
            fallbackContent(tab)
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default FrameworksTabs
