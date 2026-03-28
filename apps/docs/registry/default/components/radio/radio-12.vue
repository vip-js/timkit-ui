<script setup lang="ts">
import { AppleIcon, CreditCardIcon, WalletIcon } from 'lucide-vue-next'
import { RadioGroup } from '@timui/vue'
import { RadioGroupItem } from '@timui/vue'

const id = 'radio-12'
</script>

<template>
  <RadioGroup class="grid-cols-3" default-value="1">
    <div class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
      <RadioGroupItem :id="`${id}-1`" value="1" class="sr-only" />
      <CreditCardIcon class="opacity-60" :size="20" aria-hidden="true" />
      <label :for="`${id}-1`" class="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0">Card</label>
    </div>
    <div class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
      <RadioGroupItem :id="`${id}-2`" value="2" class="sr-only" />
      <WalletIcon class="opacity-60" :size="20" aria-hidden="true" />
      <label :for="`${id}-2`" class="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0">PayPal</label>
    </div>
    <div class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
      <RadioGroupItem :id="`${id}-3`" value="3" class="sr-only" />
      <AppleIcon class="opacity-60" :size="20" aria-hidden="true" />
      <label :for="`${id}-3`" class="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0">Apple Pay</label>
    </div>
  </RadioGroup>
</template>
