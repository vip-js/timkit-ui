import { Badge, Button, Card, CardContent, Input } from '@timui/react'
import { Bell, Home, Layers, Search, ShoppingBag, Star, UserRound } from 'lucide-react'

const products = ['Trail shell', 'Daily sling', 'Studio cap']

export default function MobileMarketplacePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-5 pb-4 pt-safe-top">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Marketplace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">Curated drops</h1>
        </div>
        <Button
          aria-label="Notifications"
          className="size-11 rounded-lg"
          size="icon"
          variant="outline"
        >
          <Bell className="size-5" />
        </Button>
      </header>

      <section className="flex flex-1 flex-col gap-5 px-5 pb-24">
        <label className="relative block">
          <span className="sr-only">Search catalog</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="min-h-[44px] rounded-lg pl-10" placeholder="Search catalog" />
        </label>

        <div className="rounded-lg border bg-card p-4">
          <Badge className="rounded-md" variant="secondary">
            Agent bundle
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold tracking-normal">
            A weekend kit in three pieces
          </h2>
          <Button className="mt-5 min-h-[44px] rounded-lg">
            Shop bundle
            <ShoppingBag className="ml-2 size-4" />
          </Button>
        </div>

        <div className="grid gap-3">
          {products.map((product, index) => (
            <Card key={product} className="rounded-lg">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="grid size-16 place-items-center rounded-lg bg-muted">
                  <Layers className="size-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{product}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Ready in {index + 2} colors</p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="size-3 fill-current" />
                    4.{index + 7}
                  </p>
                </div>
                <span className="text-sm font-semibold">${72 + index * 18}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t bg-background/95 px-5 py-3 pb-safe-bottom backdrop-blur">
        {[Home, Search, ShoppingBag, UserRound].map((Icon, index) => (
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
