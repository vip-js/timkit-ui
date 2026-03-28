<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  MinusIcon,
  PlusIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeIcon,
  VolumeXIcon,
} from 'lucide-vue-next'
import { Button } from '@timui/vue'

const volume = ref(3)

const decreaseVolume = () => {
  volume.value = Math.max(0, volume.value - 1)
}

const increaseVolume = () => {
  volume.value = Math.min(6, volume.value + 1)
}

const volumeIcon = computed(() => {
  if (volume.value === 0) return VolumeXIcon
  if (volume.value < 3) return VolumeIcon
  if (volume.value < 5) return Volume1Icon
  return Volume2Icon
})
</script>

<template>
  <div class="inline-flex items-center" role="group" aria-labelledby="volume-control">
    <span id="volume-control" class="sr-only">Volume Control</span>
    <Button
      class="rounded-full"
      variant="outline"
      size="icon"
      aria-label="Decrease volume"
      :disabled="volume === 0"
      @click="decreaseVolume"
    >
      <MinusIcon :size="16" aria-hidden="true" />
    </Button>
    <div class="flex items-center px-3 text-sm font-medium tabular-nums" aria-live="polite">
      <component :is="volumeIcon" class="opacity-60" :size="16" aria-hidden="true" />
      <span class="ms-2" :aria-label="`Current volume is ${volume}`">{{ volume }}</span>
    </div>
    <Button
      class="rounded-full"
      variant="outline"
      size="icon"
      aria-label="Increase volume"
      :disabled="volume === 6"
      @click="increaseVolume"
    >
      <PlusIcon :size="16" aria-hidden="true" />
    </Button>
  </div>
</template>
