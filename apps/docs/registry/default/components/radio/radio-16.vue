<script setup lang="ts">
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group-item';



</script>

<template>
  <fieldset class="space-y-4"><legend class="text-foreground text-sm leading-none font-medium">Rate your experience
      </legend><RadioGroup class="inline-flex gap-0" @update:modelValue="setCurrentRating"><label v-for="(value, index) in ['1', '2', '3', '4', '5']" :key="index" :key="value" class="group has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative cursor-pointer rounded p-0.5 outline-none has-focus-visible:ring-[3px]" :onMouseEnter="() => setHoverRating(value)" :onMouseLeave="() => setHoverRating('')"><RadioGroupItem :id="`${id}-${value}`" :value="value" class="sr-only" /><RiStarFill :size="24" :class="`transition-all ${
                (hoverRating || currentRating) >= value ? 'text-amber-500' : 'text-input'
              } group-hover:scale-110`" /><span class="sr-only">{{ value }}star{{ value === '1' ? '' : 's' }}</span></label></RadioGroup></fieldset>
</template>
