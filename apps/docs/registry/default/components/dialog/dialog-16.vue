<script setup lang="ts">
import { computed, ref } from 'vue'
import { CreditCardIcon, WalletIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Checkbox } from '@timui/vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@timui/vue'
import { Input } from '@timui/vue'
import { Label } from '@timui/vue'

const id = 'dialog-16'
const cardNumber = ref('')
const expiry = ref('')
const cvc = ref('')

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function detectCardType(value: string) {
  const digits = value.replace(/\D/g, '')
  if (/^4/.test(digits)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard'
  if (/^3[47]/.test(digits)) return 'amex'
  if (/^6(011|5)/.test(digits)) return 'discover'
  return null
}

const cardType = computed(() => detectCardType(cardNumber.value))
const cardTypeLabel = computed(() => {
  if (!cardType.value) return ''
  if (cardType.value === 'mastercard') return 'MC'
  if (cardType.value === 'discover') return 'DISC'
  return cardType.value.toUpperCase()
})

function onCardNumberChange(value: string | number) {
  cardNumber.value = formatCardNumber(String(value ?? ''))
}

function onExpiryChange(value: string | number) {
  expiry.value = formatExpiry(String(value ?? ''))
}

function onCvcChange(value: string | number) {
  cvc.value = String(value ?? '').replace(/\D/g, '').slice(0, 4)
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">Card details</Button>
    </DialogTrigger>

    <DialogContent>
      <div class="flex flex-col gap-2">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
          <WalletIcon class="opacity-80" :size="16" />
        </div>
        <DialogHeader>
          <DialogTitle class="text-left">Update your card</DialogTitle>
          <DialogDescription class="text-left">Your new card will replace your current card.</DialogDescription>
        </DialogHeader>
      </div>

      <form class="space-y-5" @submit.prevent>
        <div class="space-y-4">
          <div class="*:not-first:mt-2">
            <Label :htmlFor="`name-${id}`">Name on card</Label>
            <Input :id="`name-${id}`" type="text" required autocomplete="cc-name" />
          </div>

          <div class="*:not-first:mt-2">
            <Label :htmlFor="`number-${id}`">Card Number</Label>
            <div class="relative">
              <Input
                :id="`number-${id}`"
                class="peer pe-9 [direction:inherit]"
                inputmode="numeric"
                autocomplete="cc-number"
                :modelValue="cardNumber"
                @update:modelValue="onCardNumberChange"
              />
              <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                <span v-if="cardTypeLabel" class="text-[10px] font-medium tracking-wide">{{ cardTypeLabel }}</span>
                <CreditCardIcon v-else :size="16" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-1 space-y-2">
              <Label :htmlFor="`expiry-${id}`">Expiry date</Label>
              <Input
                class="[direction:inherit]"
                :id="`expiry-${id}`"
                inputmode="numeric"
                autocomplete="cc-exp"
                placeholder="MM/YY"
                :modelValue="expiry"
                @update:modelValue="onExpiryChange"
              />
            </div>
            <div class="flex-1 space-y-2">
              <Label :htmlFor="`cvc-${id}`">CVC</Label>
              <Input
                class="[direction:inherit]"
                :id="`cvc-${id}`"
                inputmode="numeric"
                autocomplete="cc-csc"
                :modelValue="cvc"
                @update:modelValue="onCvcChange"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Checkbox :id="`primary-${id}`" />
          <Label :htmlFor="`primary-${id}`" class="text-muted-foreground font-normal">
            Set as default payment method
          </Label>
        </div>

        <Button type="button" class="w-full">Update card</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>
