<script setup lang="ts">
import { ref } from 'vue';
import { Banner } from '@timui/vue';
import { BannerActions } from '@timui/vue';
import { BannerContent } from '@timui/vue';
import { BannerDescription } from '@timui/vue';
import { BannerIcon } from '@timui/vue';
import { Button } from '@timui/vue';



const isVisible = ref(true);


function setIsVisible(next: typeof isVisible.value | ((prev: typeof isVisible.value) => typeof isVisible.value)) {
  isVisible.value = typeof next === 'function'
    ? (next as (prev: typeof isVisible.value) => typeof isVisible.value)(isVisible.value)
    : next;
}

</script>

<template>
  <Banner class="dark bg-muted text-foreground px-4 py-3 md:py-2"><BannerContent class="gap-2 md:items-center"><div class="flex grow gap-3 md:items-center"><BannerIcon class="opacity-60 max-md:mt-0.5"><svg :width="16" :height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg></BannerIcon><div class="flex grow flex-col justify-between gap-3 md:flex-row md:items-center"><BannerDescription class="text-sm text-foreground">It&lsquo;s live and ready to use! Start exploring the latest addition to your toolkit.
            </BannerDescription><BannerActions class="flex gap-2 max-md:flex-wrap"><Button size="sm" class="text-sm">Download
              </Button><Button variant="link" size="sm" class="text-sm">Learn more
              </Button></BannerActions></div></div><BannerActions class="shrink-0"><Button variant="ghost" class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent" @click="setIsVisible(false)" aria-label="Close banner"><svg :width="16" :height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true"><path d="M18 6 6 18" /><path d="M6 6 18 18" /></svg></Button></BannerActions></BannerContent></Banner>
</template>
