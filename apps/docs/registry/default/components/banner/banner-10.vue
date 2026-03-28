<script setup lang="ts">
import { ref } from 'vue';
import { Banner } from '@timui/vue';
import { BannerActions } from '@timui/vue';
import { BannerContent } from '@timui/vue';
import { BannerDescription } from '@timui/vue';
import { BannerIcon } from '@timui/vue';
import { BannerTitle } from '@timui/vue';
import { Button } from '@timui/vue';



const isVisible = ref(true);
const timeLeft = ref<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });


function setIsVisible(next: typeof isVisible.value | ((prev: typeof isVisible.value) => typeof isVisible.value)) {
  isVisible.value = typeof next === 'function'
    ? (next as (prev: typeof isVisible.value) => typeof isVisible.value)(isVisible.value)
    : next;
}

</script>

<template>
  <Banner class="dark bg-muted text-foreground px-4 py-3"><BannerContent class="gap-2 md:items-center"><div class="flex grow gap-3 md:items-center"><BannerIcon class="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"><svg class="opacity-80" :width="16" :height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7z" /><path d="m9 9 6 6" /><circle cx="9" cy="9" r="1" /><circle cx="15" cy="15" r="1" /></svg></BannerIcon><div class="flex grow flex-col justify-between gap-3 md:flex-row md:items-center"><div class="space-y-0.5"><BannerTitle>Black Friday Sale!</BannerTitle><BannerDescription class="text-sm">It kicks off today and is available for just 24 hours—don&lsquo;t miss out!
              </BannerDescription></div><BannerActions class="flex gap-3 max-md:flex-wrap"><div class="divide-primary-foreground bg-primary/15 flex items-center divide-x rounded-md text-sm tabular-nums"><span v-if="timeLeft.days > 0" class="flex h-8 items-center justify-center p-2">{{ timeLeft.days }}<span class="text-muted-foreground">d</span></span><span class="flex h-8 items-center justify-center p-2">{{ timeLeft.hours.toString().padStart(2, '0') }}<span class="text-muted-foreground">h</span></span><span class="flex h-8 items-center justify-center p-2">{{ timeLeft.minutes.toString().padStart(2, '0') }}<span class="text-muted-foreground">m</span></span><span class="flex h-8 items-center justify-center p-2">{{ timeLeft.seconds.toString().padStart(2, '0') }}<span class="text-muted-foreground">s</span></span></div><Button size="sm" class="text-sm">Buy now
              </Button></BannerActions></div></div><BannerActions class="shrink-0"><Button variant="ghost" class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent" @click="setIsVisible(false)" aria-label="Close banner"><svg :width="16" :height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true"><path d="M18 6 6 18" /><path d="M6 6 18 18" /></svg></Button></BannerActions></BannerContent></Banner>
</template>
