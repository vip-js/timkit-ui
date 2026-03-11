<script setup lang="ts">
import { ClubIcon, DiamondIcon, HeartIcon, LucideIcon, SpadeIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover';



</script>

<template>
  <div class="flex flex-col gap-4"><Popover @update:open="{
          if (open) setCurrentTip(0)
        }"><div class="grid grid-cols-2 place-items-center gap-4"><Card v-for="(step, index) in tourSteps" :key="index" :key="step.title" :number="index" :isActive="currentTip === index" /></div><PopoverTrigger as-child><Button variant="outline">Start tour</Button></PopoverTrigger><PopoverContent class="max-w-[280px] py-3 shadow-none" :side="currentTip % 2 === 0 ? 'left' : 'right'" :showArrow="true"><div class="space-y-3"><div class="space-y-1"><p class="text-[13px] font-medium">{{ tourSteps[currentTip].title }}</p><p class="text-muted-foreground text-xs">{{ tourSteps[currentTip].description }}</p></div><div class="flex items-center justify-between gap-2"><span class="text-muted-foreground text-xs">{{ currentTip + 1 }}/{{ tourSteps.length }}</span><button class="text-xs font-medium hover:underline" @click="handleNavigation">{{ currentTip === tourSteps.length - 1 ? 'Start over' : 'Next' }}</button></div></div></PopoverContent></Popover></div>
</template>
