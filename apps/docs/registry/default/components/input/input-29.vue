<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Input } from '@timui/vue'
import { Label } from '@timui/vue'

const value = ref(99)

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  currencySign: 'accounting',
})

const displayValue = computed(() => formatter.format(value.value))
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label>Number input with chevrons</Label>
    <div class="border-input bg-background relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm shadow-xs">
      <Input :value="displayValue" readonly class="h-full rounded-none border-0 tabular-nums shadow-none" />
      <div class="flex h-full flex-col border-l">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          class="h-1/2 w-8 rounded-none border-b"
          aria-label="Increase value"
          @click="value += 1"
        >
          <ChevronUpIcon :size="12" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          class="h-1/2 w-8 rounded-none"
          aria-label="Decrease value"
          @click="value -= 1"
        >
          <ChevronDownIcon :size="12" aria-hidden="true" />
        </Button>
      </div>
    </div>
    <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Built with TimUI atomic components
    </p>
  </div>
</template>
