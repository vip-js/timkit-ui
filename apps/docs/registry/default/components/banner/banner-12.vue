<script setup lang="ts">
import { Banner, BannerActions, BannerContent, BannerDescription } from '@/components/ui/banner'
import { Button } from '@/components/ui/button'
</script>

<template>
  <Banner class="bg-muted px-4 py-3 md:py-2">
    <BannerContent class="flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <BannerDescription class="text-sm text-foreground">
        <span class="font-medium">v2.1.0</span>
        <span class="text-muted-foreground mx-2">•</span>
        New features and improvements available
      </BannerDescription>
      <BannerActions>
        <Button size="sm" variant="outline" class="min-w-24">
          <svg
            class="-ms-0.5"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          Update now
        </Button>
      </BannerActions>
    </BannerContent>
  </Banner>
</template>
