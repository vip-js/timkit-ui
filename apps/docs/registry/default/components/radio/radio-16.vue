<script setup lang="ts">
import { ref } from 'vue'
import { StarIcon } from 'lucide-vue-next'
import { RadioGroup } from '@timui/vue'
import { RadioGroupItem } from '@timui/vue'

const hoverRating = ref('')
const currentRating = ref('')
const id = 'radio-16'

const setHoverRating = (next: string) => {
  hoverRating.value = next
}

const setCurrentRating = (next?: string) => {
  currentRating.value = next ?? ''
}
</script>

<template>
  <fieldset class="space-y-4">
    <legend class="text-foreground text-sm leading-none font-medium">Rate your experience</legend>
    <RadioGroup class="inline-flex gap-0" @update:modelValue="setCurrentRating">
      <label
        v-for="value in ['1', '2', '3', '4', '5']"
        :key="value"
        class="group has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative cursor-pointer rounded p-0.5 outline-none has-focus-visible:ring-[3px]"
        @mouseenter="setHoverRating(value)"
        @mouseleave="setHoverRating('')"
      >
        <RadioGroupItem :id="`${id}-${value}`" :value="value" class="sr-only" />
        <StarIcon
          :size="24"
          class="fill-current transition-all group-hover:scale-110"
          :class="(hoverRating || currentRating) >= value ? 'text-amber-500' : 'text-input'"
        />
        <span class="sr-only">{{ value }} star{{ value === '1' ? '' : 's' }}</span>
      </label>
    </RadioGroup>
  </fieldset>
</template>
