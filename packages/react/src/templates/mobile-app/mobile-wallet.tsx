import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Home,
  PieChart,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const rows = [
  { label: 'Cloud tools', value: '-$44.00' },
  { label: 'Client payment', value: '+$1,280.00' },
  { label: 'Team lunch', value: '-$86.40' },
]

export default function MobileWalletPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background text-foreground">
      <header className="px-5 pb-4 pt-safe-top">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Available balance</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal">$18,420.90</h1>
          </div>
          <Button
            aria-label="Security"
            className="size-11 rounded-lg"
            size="icon"
            variant="outline"
          >
            <ShieldCheck className="size-5" />
          </Button>
        </div>
      </header>

      <section className="flex flex-1 flex-col gap-5 px-5 pb-24">
        <div className="rounded-lg bg-foreground p-5 text-background">
          <Badge className="rounded-md bg-background/15 text-background hover:bg-background/20">
            Primary card
          </Badge>
          <div className="mt-16 flex items-end justify-between">
            <p className="text-xl font-semibold">**** 4820</p>
            <CreditCard className="size-6 opacity-80" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button className="min-h-[52px] rounded-lg">
            <ArrowUpRight className="mr-2 size-4" />
            Send
          </Button>
          <Button className="min-h-[52px] rounded-lg" variant="secondary">
            <ArrowDownLeft className="mr-2 size-4" />
            Request
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Spend limit</h2>
            <span className="text-sm font-semibold">58%</span>
          </div>
          <Progress className="mt-4 h-2" value={58} />
        </div>

        <div className="grid gap-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex min-h-[60px] items-center justify-between rounded-lg border bg-card px-4"
            >
              <span className="text-sm font-medium">{row.label}</span>
              <span className="text-sm font-semibold">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t bg-background/95 px-5 py-3 pb-safe-bottom backdrop-blur">
        {[Home, PieChart, CreditCard, UserRound].map((Icon, index) => (
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
