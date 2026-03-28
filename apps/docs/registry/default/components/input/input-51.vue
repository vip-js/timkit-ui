<script setup lang="ts">
import { computed, ref } from 'vue'
import { CreditCardIcon } from 'lucide-vue-next'
import { Input } from '@timui/vue'

const id = 'input-51'
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
  <div class="*:not-first:mt-2">
    <legend class="text-foreground text-sm font-medium">Card Details</legend>
    <div class="rounded-md shadow-xs">
      <div class="relative focus-within:z-10">
        <Input
          class="peer rounded-b-none pe-9 shadow-none [direction:inherit]"
          :id="`number-${id}`"
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

      <div class="-mt-px flex">
        <div class="min-w-0 flex-1 focus-within:z-10">
          <Input
            class="rounded-e-none rounded-t-none shadow-none [direction:inherit]"
            :id="`expiry-${id}`"
            inputmode="numeric"
            autocomplete="cc-exp"
            placeholder="MM/YY"
            :modelValue="expiry"
            @update:modelValue="onExpiryChange"
          />
        </div>
        <div class="-ms-px min-w-0 flex-1 focus-within:z-10">
          <Input
            class="rounded-s-none rounded-t-none shadow-none [direction:inherit]"
            :id="`cvc-${id}`"
            inputmode="numeric"
            autocomplete="cc-csc"
            :modelValue="cvc"
            @update:modelValue="onCvcChange"
          />
        </div>
      </div>
    </div>

    <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Built with
      <a
        class="hover:text-foreground underline"
        href="https://github.com/medipass/react-payment-inputs"
        target="_blank"
        rel="noopener nofollow"
      >
        React Payment Inputs
      </a>
    </p>
  </div>
</template>
