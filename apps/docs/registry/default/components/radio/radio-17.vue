<script setup lang="ts">
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group-item';



</script>

<template>
  <fieldset class="space-y-4"><legend class="text-foreground text-sm leading-none font-medium">How did it go?</legend><RadioGroup class="flex gap-1.5" default-value="3"><label v-for="(item, index) in items" :key="index" :key="`${id}-${item.value}`" class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 cursor-pointer flex-col items-center justify-center rounded-full border text-center text-xl shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"><RadioGroupItem :id="`${id}-${item.value}`" :value="item.value" class="sr-only after:absolute after:inset-0" />{{ item.icon }}</label></RadioGroup></fieldset>
</template>
