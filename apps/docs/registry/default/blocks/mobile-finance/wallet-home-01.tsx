import { Badge, Button, Card, CardContent, Progress } from '@timui/react'
import { ArrowDownLeft, ArrowUpRight, CreditCard, ShieldCheck, Wallet } from 'lucide-react'

const actions = [
  { label: 'Send', icon: ArrowUpRight },
  { label: 'Receive', icon: ArrowDownLeft },
  { label: 'Cards', icon: CreditCard },
]

const transactions = [
  {
    name: 'Figma',
    amount: '-$24.00',
    tone: 'bg-violet-100 text-violet-900 dark:bg-violet-400/15 dark:text-violet-200',
  },
  {
    name: 'Stripe payout',
    amount: '+$890.20',
    tone: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200',
  },
  {
    name: 'Vercel',
    amount: '-$20.00',
    tone: 'bg-slate-100 text-slate-900 dark:bg-slate-400/15 dark:text-slate-200',
  },
]

export default function WalletHome01() {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background text-foreground">
      <header className="px-5 pb-4 pt-safe-top">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total balance</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal">$24,892.48</h1>
          </div>
          <Button
            aria-label="Security center"
            className="size-11 rounded-lg"
            size="icon"
            variant="outline"
          >
            <ShieldCheck className="size-5" />
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-5 pb-safe-bottom">
        <div className="rounded-lg bg-foreground p-5 text-background shadow-sm">
          <div className="flex items-center justify-between">
            <Badge className="rounded-md bg-background/15 text-background hover:bg-background/20">
              Timkit Card
            </Badge>
            <Wallet className="size-6 opacity-80" />
          </div>
          <div className="mt-12 flex items-end justify-between">
            <div>
              <p className="text-xs text-background/60">Monthly spend</p>
              <p className="mt-1 text-xl font-semibold">$3,240.18</p>
            </div>
            <p className="text-sm text-background/70">**** 0924</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button key={action.label} className="min-h-[56px] rounded-lg" variant="secondary">
                <Icon className="mr-2 size-4" />
                {action.label}
              </Button>
            )
          })}
        </div>

        <Card className="rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold">Agent budget guard</h2>
                <p className="mt-1 text-xs text-muted-foreground">$1,840 left this month</p>
              </div>
              <span className="text-sm font-semibold">62%</span>
            </div>
            <Progress className="mt-4 h-2" value={62} />
          </CardContent>
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent activity</h2>
            <Button className="h-11 rounded-lg px-3" variant="ghost">
              View all
            </Button>
          </div>
          <div className="grid gap-3">
            {transactions.map((item) => (
              <div
                key={item.name}
                className="flex min-h-[64px] items-center gap-3 rounded-lg border bg-card px-3"
              >
                <div className={`grid size-10 place-items-center rounded-lg ${item.tone}`}>
                  <CreditCard className="size-4" />
                </div>
                <span className="flex-1 text-sm font-medium">{item.name}</span>
                <span className="text-sm font-semibold">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </section>
  )
}
