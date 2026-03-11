'use client'

import { useMemo } from 'react'
import type { RegistryItem } from '@timui/core'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@timui/react'
import { CodeIcon } from 'lucide-react'

import { getAvailableFrameworkTabs, getFrameworkCodePanes } from '@/lib/framework-utils'
import ComponentCli from '@/components/cli-commands'
import FrameworksTabs, { type FrameworkPane, type FrameworkTab } from '@/components/frameworks-tabs'
import OpenInV0 from '@/components/open-in-v0'

export default function ComponentDetails({ component }: { component: RegistryItem }) {
  // Remove local frameworkTabs definition
  // Use shared framework tabs definition
  const frameworkTabs = useMemo<FrameworkTab[]>(
    () => getAvailableFrameworkTabs(component),
    [component]
  )

  // ...

  const frameworkPanes = useMemo<FrameworkPane[]>(() => {
    if (!component?.files) return []

    const paneMap = getFrameworkCodePanes(component)

    return frameworkTabs.map((tab) => ({
      value: tab.value,
      code: paneMap[tab.value] ?? '',
    }))
  }, [component, frameworkTabs])

  return (
    <div className="absolute top-2 right-2 flex gap-2 peer-data-comp-loading:hidden">
      <OpenInV0 componentSource={`https://ui.timkit.cn/r/${component.name}.json`} />
      <Dialog>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground/80 hover:text-foreground transition-none hover:bg-transparent disabled:opacity-100 lg:opacity-0 lg:group-focus-within/item:opacity-100 lg:group-hover/item:opacity-100"
                  >
                    <CodeIcon size={16} aria-hidden={true} />
                  </Button>
                </DialogTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-muted-foreground px-2 py-1 text-xs">
              View code
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-left">Installation</DialogTitle>
            <DialogDescription className="sr-only">
              Use the CLI to add components to your project
            </DialogDescription>
          </DialogHeader>
          <div className="min-w-0 space-y-5 flex-1 overflow-auto p-1">
            <ComponentCli name={component.name} />
            <div className="space-y-4">
              <p className="text-lg font-semibold tracking-tight">Code</p>
              <div className="relative">
                {!component.files?.length ? (
                  <p className="text-muted-foreground text-sm">No code available.</p>
                ) : (
                  <FrameworksTabs
                    tabs={frameworkTabs}
                    panes={frameworkPanes}
                    height={400}
                    disableUnavailableTabs
                  />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
