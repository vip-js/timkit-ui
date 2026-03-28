<script setup lang="ts">
import { ref } from 'vue'
import { CreditCardIcon } from 'lucide-vue-next'
import { Input } from '@timui/vue'
import { Label } from '@timui/vue'

const id = 'input-48'
const cardNumber = ref('')

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function onCardNumberChange(value: string | number) {
  cardNumber.value = formatCardNumber(String(value ?? ''))
}
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="`number-${id}`">Card Number</Label>
    <div class="relative">
      <Input
        :id="`number-${id}`"
        class="peer ps-9 [direction:inherit]"
        inputmode="numeric"
        autocomplete="cc-number"
        :modelValue="cardNumber"
        @update:modelValue="onCardNumberChange"
      />
      <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <CreditCardIcon :size="16" aria-hidden="true" />
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
