<script setup lang="ts">
import { ref } from 'vue'
import { Input, Label } from '@timui/vue'

const id = 'input-55'
const value = ref('')

const isLetter = (char: string) => /^[A-Z]$/.test(char)
const isDigit = (char: string) => /^\d$/.test(char)

function formatMaskedValue(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, '')
  let cursor = 0

  const consume = (matcher: (char: string) => boolean) => {
    while (cursor < raw.length) {
      const char = raw[cursor]
      cursor += 1
      if (char && matcher(char)) return char
    }
    return ''
  }

  const p1 = consume(isLetter)
  if (!p1) return ''
  const p2 = consume(isLetter)
  if (!p2) return p1
  const d1 = consume(isDigit)
  if (!d1) return `${p1}${p2}`
  const d2 = consume(isDigit)
  if (!d2) return `${p1}${p2}${d1}`
  const l1 = consume(isLetter)
  if (!l1) return `${p1}${p2}${d1}${d2}`
  const l2 = consume(isLetter)
  if (!l2) return `${p1}${p2}${d1}${d2} ${l1}`
  const l3 = consume(isLetter)
  if (!l3) return `${p1}${p2}${d1}${d2} ${l1}${l2}`
  return `${p1}${p2}${d1}${d2} ${l1}${l2}${l3}`
}

function handleValueChange(nextValue: string | number) {
  value.value = formatMaskedValue(String(nextValue))
}

</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Input with mask</Label>
    <Input
      :id="id"
      v-model="value"
      placeholder="AB12 CDE"
      type="text"
      @update:model-value="handleValueChange"
    />
    <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Built with native mask formatting
    </p>
  </div>
</template>
