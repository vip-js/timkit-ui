'use client'

import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@timui/react'
import { CodeIcon } from 'lucide-react'

import type { SectionCodeGroup } from '@/lib/sections'
import CodeBlock from '@/components/code-block'
import CopyButton from '@/components/copy-button'

const FILE_TRIGGER_STYLES =
  'rounded-full border px-4 py-1.5 text-xs font-medium transition hover:bg-muted data-[active=true]:bg-foreground data-[active=true]:text-background'

const emptyState = (
  <p className="text-muted-foreground text-sm">暂无可展示的源码，稍后再试或查看 React 版本。</p>
)

type SectionCodeDialogProps = {
  title?: string
  codeGroups: SectionCodeGroup[]
}

export default function SectionCodeDialog({ codeGroups, title }: SectionCodeDialogProps) {
  const [activeGroup, setActiveGroup] = useState(() => codeGroups[0]?.id ?? '')

  const [activeFiles, setActiveFiles] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    codeGroups.forEach((group) => {
      if (group.files[0]) {
        initial[group.id] = group.files[0].id
      }
    })
    return initial
  })

  return (
    <div className="absolute top-2 right-2 flex gap-2 peer-data-comp-loading:hidden">
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
                    disabled={!codeGroups.length}
                  >
                    <CodeIcon size={16} aria-hidden={true} />
                    <span className="sr-only">查看源码</span>
                  </Button>
                </DialogTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-muted-foreground px-2 py-1 text-xs">
              查看源码
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle className="text-left">{title ? `${title} - Code` : 'Code'}</DialogTitle>
          </DialogHeader>
          {!codeGroups.length ? (
            emptyState
          ) : (
            <Tabs
              value={activeGroup}
              onValueChange={(val) => setActiveGroup(val)}
              className="space-y-4"
            >
              {codeGroups.length > 1 ? (
                <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
                  {codeGroups.map((group) => (
                    <TabsTrigger
                      key={group.id}
                      value={group.id}
                      className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-full border px-4 py-2 text-xs font-medium"
                    >
                      {group.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              ) : null}
              {codeGroups.map((group) => {
                const targetId = activeFiles[group.id]
                const currentFile =
                  group.files.find((file) => file.id === targetId) ?? group.files[0]

                return (
                  <TabsContent
                    key={group.id}
                    value={group.id}
                    className="space-y-4 focus-visible:ring-0 focus-visible:outline-none"
                  >
                    {group.files.length > 1 ? (
                      <div className="flex flex-wrap gap-2">
                        {group.files.map((file) => (
                          <button
                            key={file.id}
                            onClick={() =>
                              setActiveFiles((prev) => ({
                                ...prev,
                                [group.id]: file.id,
                              }))
                            }
                            data-active={activeFiles[group.id] === file.id ? 'true' : 'false'}
                            className={FILE_TRIGGER_STYLES}
                            type="button"
                          >
                            {file.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <div className="relative">
                      {currentFile && currentFile.code ? (
                        <>
                          <CodeBlock code={currentFile.code} lang={group.language as any} />
                          <CopyButton componentSource={currentFile.code} />
                        </>
                      ) : (
                        emptyState
                      )}
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
