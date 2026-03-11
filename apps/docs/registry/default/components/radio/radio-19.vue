<script setup lang="ts">
import { CheckIcon, MinusIcon } from 'lucide-vue-next';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group-item';



</script>

<template>
  <fieldset class="space-y-4"><legend class="text-foreground text-sm leading-none font-medium">Choose a theme</legend><RadioGroup class="flex gap-3" default-value="1"><label v-for="(item, index) in items" :key="index" :key="`${id}-${item.value}`"><RadioGroupItem :id="`${id}-${item.value}`" :value="item.value" class="peer sr-only after:absolute after:inset-0" /><img :src="item.image" :alt="item.label" :width="88" :height="70" class="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50" /><span class="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1"><CheckIcon :size="16" class="group-peer-data-[state=unchecked]:hidden" aria-hidden="true" /><MinusIcon :size="16" class="group-peer-data-[state=checked]:hidden" aria-hidden="true" /><span class="text-xs font-medium">{{ item.label }}</span></span></label></RadioGroup></fieldset>
</template>
