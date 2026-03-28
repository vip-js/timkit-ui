<script setup lang="ts">
import { ref } from 'vue';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue';



const currentTip = ref(0);

</script>

<template>
  <Popover><PopoverTrigger as-child><Button variant="outline">Tooltip-like with nav</Button></PopoverTrigger><PopoverContent class="max-w-[280px] py-3 shadow-none" side="top"><div class="space-y-3"><div class="space-y-1"><p class="text-[13px] font-medium">{{ tips[currentTip].title }}</p><p class="text-muted-foreground text-xs">{{ tips[currentTip].description }}</p></div><div class="flex items-center justify-between"><span class="text-muted-foreground text-xs">{{ currentTip + 1 }}/{{ tips.length }}</span><div class="flex gap-0.5"><Button size="icon" variant="ghost" class="size-6" @click="handlePrev" :disabled="isFirstTip" aria-label="Previous tip"><ArrowLeftIcon :size="14" aria-hidden="true" /></Button><Button size="icon" variant="ghost" class="size-6" @click="handleNext" :disabled="isLastTip" aria-label="Next tip"><ArrowRightIcon :size="14" aria-hidden="true" /></Button></div></div></div></PopoverContent></Popover>
</template>
