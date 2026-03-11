<script setup lang="ts">
import { CreditCardIcon, WalletIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



</script>

<template>
  <Dialog><DialogTrigger as-child><Button variant="outline">Card details</Button></DialogTrigger><DialogContent><div class="flex flex-col gap-2"><div class="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><WalletIcon class="opacity-80" :size="16" /></div><DialogHeader><DialogTitle class="text-left">Update your card</DialogTitle><DialogDescription class="text-left">Your new card will replace your current card.
            </DialogDescription></DialogHeader></div><form class="space-y-5"><div class="space-y-4"><div class="*:not-first:mt-2"><Label :htmlFor="`name-${id}`">Name on card</Label><Input :id="`name-${id}`" type="text" required /></div><div class="*:not-first:mt-2"><Label :htmlFor="`number-${id}`">Card Number</Label><div class="relative"><Input :id="`number-${id}`" class="peer pe-9 [direction:inherit]" /><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">{{ meta.cardType ? (
                    <svg
                      className="overflow-hidden rounded-sm"
                      {...getCardImageProps({
                        images: images as unknown as CardImages,
                      })}
                      width={20}
                    />
                  ) : (
                    <CreditCardIcon size={16} aria-hidden="true" />
                  ) }}</div></div></div><div class="flex gap-4"><div class="flex-1 space-y-2"><Label :htmlFor="`expiry-${id}`">Expiry date</Label><Input class="[direction:inherit]" :id="`expiry-${id}`" /></div><div class="flex-1 space-y-2"><Label :htmlFor="`cvc-${id}`">CVC</Label><Input class="[direction:inherit]" :id="`cvc-${id}`" /></div></div></div><div class="flex items-center gap-2"><Checkbox :id="`primary-${id}`" /><Label :htmlFor="`primary-${id}`" class="text-muted-foreground font-normal">Set as default payment method
            </Label></div><Button type="button" class="w-full">Update card
          </Button></form></DialogContent></Dialog>
</template>
