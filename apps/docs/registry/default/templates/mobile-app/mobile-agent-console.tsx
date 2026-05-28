'use client'

import { Badge, Button, Input } from '@timui/react'
import { ArrowUp, Bot, CheckCircle2, Code2, Home, Layers, Search, Settings2 } from 'lucide-react'

const steps = ['Select mobile template', 'Install registry deps', 'Patch theme tokens']

export default function MobileAgentConsolePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-5 pb-4 pt-safe-top">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Agent console</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">Build session</h1>
        </div>
        <Button aria-label="Settings" className="size-11 rounded-lg" size="icon" variant="outline">
          <Settings2 className="size-5" />
        </Button>
      </header>

      <section className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-24">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="size-5" />
            </div>
            <div>
              <Badge className="rounded-md" variant="secondary">
                Timkit registry
              </Badge>
              <h2 className="mt-2 text-base font-semibold">Mobile checkout flow</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex min-h-[44px] items-center gap-2 rounded-lg bg-muted px-3 text-sm"
              >
                {index < 2 ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : (
                  <Code2 className="size-4 text-muted-foreground" />
                )}
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[86%] rounded-lg bg-muted p-3 text-sm leading-relaxed">
          Use mobile-marketplace and replace the product cards with the checkout summary.
        </div>
        <div className="ml-auto max-w-[86%] rounded-lg bg-primary p-3 text-sm leading-relaxed text-primary-foreground">
          I found the template and will install button, input, badge, and card dependencies.
        </div>

        <form className="fixed inset-x-0 bottom-[68px] mx-auto flex max-w-md gap-2 bg-background/95 px-5 py-3 backdrop-blur">
          <Input className="min-h-[44px] rounded-lg" placeholder="Describe the next UI change" />
          <Button aria-label="Send" className="size-11 rounded-lg" size="icon" type="button">
            <ArrowUp className="size-4" />
          </Button>
        </form>
      </section>

      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t bg-background/95 px-5 py-3 pb-safe-bottom backdrop-blur">
        {[Home, Search, Layers, Settings2].map((Icon, index) => (
          <Button
            key={index}
            aria-label={`Tab ${index + 1}`}
            className="size-11 rounded-lg"
            size="icon"
            variant={index === 0 ? 'secondary' : 'ghost'}
          >
            <Icon className="size-5" />
          </Button>
        ))}
      </nav>
    </main>
  )
}
