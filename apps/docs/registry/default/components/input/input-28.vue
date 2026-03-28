<script setup lang="ts">
import { ref } from 'vue'
import { MinusIcon, PlusIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Input } from '@timui/vue'
import { Label } from '@timui/vue'

const id = 'input-28'
const value = ref(2048)

function decrement() {
  value.value = Math.max(0, value.value - 1)
}

function increment() {
  value.value += 1
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const next = Number(target.value)
  value.value = Number.isFinite(next) ? Math.max(0, next) : 0
}
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Number input with plus/minus buttons</Label>
    <div class="border-input bg-background relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm shadow-xs">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        class="h-full rounded-none border-r"
        aria-label="Decrease value"
        @click="decrement"
      >
        <MinusIcon :size="16" aria-hidden="true" />
      </Button>
      <Input
        :id="id"
        type="number"
        min="0"
        :value="String(value)"
        class="h-full rounded-none border-0 text-center tabular-nums shadow-none"
        @input="handleInput"
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        class="h-full rounded-none border-l"
        aria-label="Increase value"
        @click="increment"
      >
        <PlusIcon :size="16" aria-hidden="true" />
      </Button>
    </div>
    <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Built with TimUI atomic components
    </p>
  </div>
</template>
