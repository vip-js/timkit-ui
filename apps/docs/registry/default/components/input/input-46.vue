<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue'

const id = 'input-46'
const digits = ref(['', '', '', ''])
const inputRefs = ref<Array<HTMLInputElement | null>>([])

function setInputRef(index: number, el: HTMLInputElement | null) {
  inputRefs.value[index] = el
}

function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '').slice(-1)
  digits.value[index] = value
  target.value = value
  if (value && index < digits.value.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">OTP input (spaced)</Label>
    <div class="flex gap-2">
      <input
        v-for="(_, index) in digits"
        :key="`${id}-${index}`"
        :id="index === 0 ? id : `${id}-${index}`"
        :ref="(el) => setInputRef(index, el as HTMLInputElement | null)"
        class="border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border text-center font-medium shadow-xs transition-[color,box-shadow] focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring/50"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="1"
        autocomplete="one-time-code"
        @input="(event) => handleInput(index, event)"
        @keydown="(event) => handleKeydown(index, event)"
      />
    </div>
    <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Built with
      <a
        class="hover:text-foreground underline"
        href="https://github.com/guilhermerodz/input-otp"
        target="_blank"
        rel="noopener nofollow"
      >
        Input OTP
      </a>
    </p>
  </div>
</template>
