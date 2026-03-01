<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
</script>
<template>
<Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Card details</Button>
    </DialogTrigger>
    <DialogContent>
      <div class="flex flex-col gap-2">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-80"><circle cx="12" cy="12" r="9" /></svg>
        </div>
        <DialogHeader>
          <DialogTitle class="text-left">Update your card</DialogTitle>
          <DialogDescription class="text-left">
            Your new card will replace your current card.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form class="space-y-5">
        <div class="space-y-4">
          <div class="*:not-first:mt-2">
            <Label for="name-dialog-16-id">Name on card</Label>
            <Input id="name-dialog-16-id" type="text" required />
          </div>
          <div class="*:not-first:mt-2">
            <Label for="number-dialog-16-id">Card Number</Label>
            <div class="relative">
              <Input id="number-dialog-16-id" class="peer pe-9 [direction:inherit]" />
              <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              </div>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-1 space-y-2">
              <Label for="expiry-dialog-16-id">Expiry date</Label>
              <Input class="[direction:inherit]" id="expiry-dialog-16-id" />
            </div>
            <div class="flex-1 space-y-2">
              <Label for="cvc-dialog-16-id">CVC</Label>
              <Input class="[direction:inherit]" id="cvc-dialog-16-id" />
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="primary-dialog-16-id" />
          <Label for="primary-dialog-16-id" class="text-muted-foreground font-normal">
            Set as default payment method
          </Label>
        </div>
        <Button type="button" class="w-full">
          Update card
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>
