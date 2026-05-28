import { Badge, Button, Card, CardContent, Input } from '@timui/react'
import { ArrowRight, Heart, Search, ShoppingBag, Sparkles, Star } from 'lucide-react'

const categories = ['Drops', 'Daily', 'Outdoor', 'Studio']

const products = [
  {
    name: 'Trace Knit Jacket',
    detail: 'Water-repellent shell',
    price: '$128',
    rating: '4.9',
    accent: 'bg-sky-100 text-sky-900 dark:bg-sky-400/15 dark:text-sky-200',
  },
  {
    name: 'Arc Running Tote',
    detail: '18L recycled nylon',
    price: '$74',
    rating: '4.8',
    accent: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200',
  },
]

export default function CommerceHome01() {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-5 pb-4 pt-safe-top">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Good morning</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">Find your next fit</h1>
        </div>
        <Button aria-label="Open shopping bag" className="size-11 rounded-lg" size="icon">
          <ShoppingBag className="size-5" />
        </Button>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-5 pb-safe-bottom">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="min-h-[44px] rounded-lg pl-10"
            placeholder="Search jackets, bags, shoes"
            type="search"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((category, index) => (
            <Button
              key={category}
              className="min-h-[44px] shrink-0 rounded-lg px-4"
              variant={index === 0 ? 'default' : 'outline'}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge className="rounded-md" variant="secondary">
                <Sparkles className="mr-1 size-3" />
                Agent pick
              </Badge>
              <h2 className="mt-4 max-w-[13rem] text-2xl font-semibold tracking-normal">
                Capsule pieces for a rainy city week.
              </h2>
            </div>
            <div className="grid size-24 place-items-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="size-10" />
            </div>
          </div>
          <Button className="mt-5 min-h-[44px] rounded-lg" variant="secondary">
            Build outfit
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>

        <div className="grid gap-3">
          {products.map((product) => (
            <Card key={product.name} className="rounded-lg">
              <CardContent className="flex items-center gap-3 p-3">
                <div className={`grid size-16 place-items-center rounded-lg ${product.accent}`}>
                  <ShoppingBag className="size-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{product.detail}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="size-3 fill-current" />
                    {product.rating}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    aria-label={`Save ${product.name}`}
                    className="size-11 rounded-lg"
                    size="icon"
                    variant="ghost"
                  >
                    <Heart className="size-4" />
                  </Button>
                  <span className="text-sm font-semibold">{product.price}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </section>
  )
}
