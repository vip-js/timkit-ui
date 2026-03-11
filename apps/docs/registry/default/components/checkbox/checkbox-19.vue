<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';



</script>

<template>
  <fieldset class="space-y-4"><legend class="text-foreground text-sm leading-none font-medium">Days of the week</legend><div class="flex gap-1.5"><label v-for="(item, index) in items" :key="index" :key="`${id}-${item.value}`" class="border-input has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary has-data-[state=checked]:text-primary-foreground has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 cursor-pointer flex-col items-center justify-center gap-3 rounded-full border text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"><Checkbox :id="`${id}-${item.value}`" :value="item.value" class="sr-only after:absolute after:inset-0" :defaultChecked="item.defaultChecked" :disabled="item.disabled" /><span aria-hidden="true" class="text-sm font-medium">{{ item.label[0] }}</span><span class="sr-only">{{ item.label }}</span></label></div></fieldset>
</template>
