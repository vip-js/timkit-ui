<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Checkout</Button>
    </DialogTrigger>
    <DialogContent>
      <div class="mb-2 flex flex-col gap-2">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-80"><circle cx="12" cy="12" r="9" /></svg>
        </div>
        <DialogHeader>
          <DialogTitle class="text-left">Confirm and pay</DialogTitle>
          <DialogDescription class="text-left">
            Pay securely and cancel any time.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form class="space-y-5">
        <div class="space-y-4">
          <RadioGroup class="grid-cols-2" defaultValue="yearly">
            <label class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col gap-1 rounded-md border px-4 py-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem id="radio-monthly" value="monthly" class="sr-only after:absolute after:inset-0" />
              <p class="text-foreground text-sm font-medium">Monthly</p>
              <p class="text-muted-foreground text-sm">$32/month</p>
            </label>
            <label class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col gap-1 rounded-md border px-4 py-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem id="radio-yearly" value="yearly" class="sr-only after:absolute after:inset-0" />
              <div class="inline-flex items-start justify-between gap-2">
                <p class="text-foreground text-sm font-medium">Yearly</p>
                <Badge>Popular</Badge>
              </div>
              <p class="text-muted-foreground text-sm">$320/month</p>
            </label>
          </RadioGroup>
          <div class="*:not-first:mt-2">
            <Label for="name-dialog-17-id">Name on card</Label>
            <Input id="name-dialog-17-id" type="text" required />
          </div>
          <div class="*:not-first:mt-2">
            <legend class="text-foreground text-sm font-medium">Card Details</legend>
            <div class="rounded-md shadow-xs">
              <div class="relative focus-within:z-10">
                <Input class="peer rounded-b-none pe-9 shadow-none [direction:inherit]" />
                <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                   <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                </div>
              </div>
              <div class="-mt-px flex">
                <div class="min-w-0 flex-1 focus-within:z-10">
                  <Input class="rounded-e-none rounded-t-none shadow-none [direction:inherit]" />
                </div>
                <div class="-ms-px min-w-0 flex-1 focus-within:z-10">
                  <Input class="rounded-s-none rounded-t-none shadow-none [direction:inherit]" />
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="text-sm underline hover:no-underline">
            + Add coupon
          </button>
        </div>
        <Button type="button" class="w-full">
          Subscribe
        </Button>
      </form>

      <p class="text-muted-foreground text-center text-xs">
        Payments are non-refundable. Cancel anytime.
      </p>
    </DialogContent>
  </Dialog>
</template>
