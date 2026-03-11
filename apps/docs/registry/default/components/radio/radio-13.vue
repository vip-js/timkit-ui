<script setup lang="ts">
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group-item';



</script>

<template>
  <fieldset class="space-y-4"><legend class="text-foreground text-sm leading-none font-medium">CPU Cores</legend><RadioGroup class="grid grid-cols-3 gap-2" default-value="1"><label v-for="(item, index) in items" :key="index" :key="`${id}-${item.value}`" class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"><RadioGroupItem :id="`${id}-${item.value}`" :value="item.value" class="sr-only after:absolute after:inset-0" :disabled="item.disabled" /><p class="text-foreground text-sm leading-none font-medium">{{ item.label }}</p></label></RadioGroup></fieldset>
</template>
