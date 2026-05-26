'use client'

import { ArrowUp, Bot, CheckCircle2, Command, FileText, Sparkles } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const tasks = [
  { label: 'Read registry-index.json', done: true },
  { label: 'Install wallet-home-01', done: true },
  { label: 'Patch mobile safe area', done: false },
]

export default function AgentChat01() {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background text-foreground">
      <header className="flex items-center gap-3 border-b px-5 pb-4 pt-safe-top">
        <Avatar className="size-11">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="size-5" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-semibold tracking-normal">Timkit Agent</h1>
          <p className="truncate text-xs text-muted-foreground">Mobile UI registry session</p>
        </div>
        <Badge className="rounded-md" variant="secondary">
          Live
        </Badge>
      </header>

      <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
        <div className="max-w-[82%] rounded-lg bg-muted p-3">
          <p className="text-sm leading-relaxed">
            Build a mobile checkout screen using Timkit components and keep every tap target above
            44px.
          </p>
        </div>

        <div className="ml-auto max-w-[86%] rounded-lg bg-primary p-3 text-primary-foreground">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium opacity-80">
            <Sparkles className="size-3.5" />
            Registry plan
          </div>
          <div className="grid gap-2">
            {tasks.map((task) => (
              <div
                key={task.label}
                className="flex items-center gap-2 rounded-md bg-primary-foreground/10 px-2 py-2 text-sm"
              >
                {task.done ? <CheckCircle2 className="size-4" /> : <Command className="size-4" />}
                <span>{task.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[88%] rounded-lg border bg-card p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <FileText className="size-3.5" />
            Command
          </div>
          <code className="block overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs">
            npx @timui/cli add commerce-home-01 --framework react
          </code>
        </div>
      </main>

      <form className="flex gap-2 border-t px-5 py-3 pb-safe-bottom">
        <Input className="min-h-[44px] rounded-lg" placeholder="Ask the agent to compose UI" />
        <Button aria-label="Send message" className="size-11 rounded-lg" size="icon" type="button">
          <ArrowUp className="size-4" />
        </Button>
      </form>
    </section>
  )
}
