<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@timui/vue'
import { Label } from '@timui/vue'

const id = 'input-49'
const expiry = ref('')

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function onExpiryChange(value: string | number) {
  expiry.value = formatExpiry(String(value ?? ''))
}
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="`expiry-${id}`">Expiry date</Label>
    <Input
      :id="`expiry-${id}`"
      class="[direction:inherit]"
      inputmode="numeric"
      autocomplete="cc-exp"
      placeholder="MM/YY"
      :modelValue="expiry"
      @update:modelValue="onExpiryChange"
    />
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
