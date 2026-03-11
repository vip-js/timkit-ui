<script setup lang="ts">
import { MinusIcon, PlusIcon, Volume1Icon, Volume2Icon, VolumeIcon, VolumeXIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';



</script>

<template>
  <div class="inline-flex items-center" role="group" aria-labelledby="volume-control"><span id="volume-control" class="sr-only">Volume Control
      </span><Button class="rounded-full" variant="outline" size="icon" aria-label="Decrease volume" @click="decreaseVolume" :disabled="volume === 0"><MinusIcon :size="16" aria-hidden="true" /></Button><div class="flex items-center px-3 text-sm font-medium tabular-nums" aria-live="polite"><Icon class="opacity-60" :size="16" aria-hidden="true" /><span class="ms-2" :aria-label="`Current volume is ${volume}`">{{ volume }}</span></div><Button class="rounded-full" variant="outline" size="icon" aria-label="Increase volume" @click="increaseVolume" :disabled="volume === 6"><PlusIcon :size="16" aria-hidden="true" /></Button></div>
</template>
