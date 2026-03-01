'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@timui/react'

import { useConfig } from '@/hooks/use-config'
import CopyButton from '@/components/copy-button'

export default function CliCommands({ name }: { name: string }) {
  const [config, setConfig] = useConfig()
  const packageManager = config.packageManager || 'pnpm'

  const commands = {
    pnpm: `pnpm dlx shadcn@latest add https://ui.timkit.cn/r/${name}.json`,
    npm: `npx shadcn@latest add https://ui.timkit.cn/r/${name}.json`,
    yarn: `npx shadcn@latest add https://ui.timkit.cn/r/${name}.json`,
    bun: `bunx --bun shadcn@latest add https://ui.timkit.cn/r/${name}.json`,
  }

  return (
    <div className="relative">
      <Tabs
        value={packageManager}
        onValueChange={(value) => {
          setConfig({
            ...config,
            packageManager: value as 'pnpm' | 'npm' | 'yarn' | 'bun',
          })
        }}
        className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.2)]"
      >
        <TabsList className="h-auto w-full justify-start rounded-none border-b border-border/60 bg-card/80 px-4 py-0">
          <TabsTrigger
            className="data-[state=active]:after:bg-primary relative rounded-none py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="pnpm"
          >
            pnpm
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:after:bg-primary relative rounded-none py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="npm"
          >
            npm
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:after:bg-primary relative rounded-none py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="yarn"
          >
            yarn
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:after:bg-primary relative rounded-none py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="bun"
          >
            bun
          </TabsTrigger>
        </TabsList>
        {Object.entries(commands).map(([pkg, command]) => (
          <TabsContent className="m-0" key={pkg} value={pkg}>
            <pre className="overflow-auto bg-slate-950 p-4 font-mono text-[12.8px] text-slate-100">
              {command}
            </pre>
          </TabsContent>
        ))}
      </Tabs>
      <CopyButton
        componentSource={commands[packageManager as keyof typeof commands]}
        className="top-1"
      />
    </div>
  )
}
