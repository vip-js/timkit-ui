<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@timui/vue'
import { Label } from '@timui/vue'

const id = 'input-50'
const cvc = ref('')

function onCvcChange(value: string | number) {
  cvc.value = String(value ?? '').replace(/\D/g, '').slice(0, 4)
}
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="`cvc-${id}`">Code</Label>
    <Input
      :id="`cvc-${id}`"
      class="[direction:inherit]"
      inputmode="numeric"
      autocomplete="cc-csc"
      :modelValue="cvc"
      @update:modelValue="onCvcChange"
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
