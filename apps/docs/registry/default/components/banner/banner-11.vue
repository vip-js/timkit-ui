<script setup lang="ts">
import { Banner } from '@timui/vue';
import { BannerContent } from '@timui/vue';
import { BannerDescription } from '@timui/vue';
import { BannerIcon } from '@timui/vue';




</script>

<template>
  <Banner class="border-b px-4 py-3"><BannerContent class="justify-center"><BannerIcon class="mr-1 text-base leading-none">📫</BannerIcon><BannerDescription class="text-sm text-foreground text-center">Subscribe to our newsletter and get 10% off your first order!{{ ' ' }}<span class="text-muted-foreground mx-1">·</span>{{ ' ' }}<a href="#" class="font-medium underline hover:no-underline">Subscribe
          </a></BannerDescription></BannerContent></Banner>
</template>
