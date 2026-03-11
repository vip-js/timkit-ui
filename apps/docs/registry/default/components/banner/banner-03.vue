<script setup lang="ts">
import { Banner } from '@/components/ui/banner';
import { BannerContent } from '@/components/ui/banner-content';
import { BannerDescription } from '@/components/ui/banner-description';
import { BannerIcon } from '@/components/ui/banner-icon';



</script>

<template>
  <Banner class="dark bg-muted text-foreground px-4 py-3"><BannerContent class="justify-center"><BannerIcon class="me-3 -mt-0.5 opacity-60"><svg :width="16" :height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg></BannerIcon><BannerDescription class="text-sm text-foreground text-center">Get the most out of your app with real-time updates and analytics{{ ' ' }}<span class="text-muted-foreground">·</span>{{ ' ' }}<a href="#" class="font-medium underline hover:no-underline">Upgrade
          </a></BannerDescription></BannerContent></Banner>
</template>
