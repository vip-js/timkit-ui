<script setup lang="ts">
import { Banner, BannerActions, BannerContent, BannerDescription, BannerIcon, BannerTitle } from '@/components/ui/banner'
import { Button } from '@/components/ui/button'
</script>

<template>
  <Banner class="dark bg-muted text-foreground px-4 py-3">
    <BannerContent class="gap-2 md:items-center">
      <div class="flex grow gap-3 md:items-center">
        <BannerIcon class="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5">
          <svg
            class="opacity-80"
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
            <path d="M4.5 16.5c-1.5-1.5-1-4.5 1-6.5 2-2 9-5 13-5 0 4-3 11-5 13-2 2-5 2.5-6.5 1L4 20l.5-3.5z" />
            <path d="M15 9 9 15" />
          </svg>
        </BannerIcon>
        <div class="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
          <div class="space-y-0.5">
            <BannerTitle>Boost your experience with Timkit UI</BannerTitle>
            <BannerDescription class="text-sm">
              The new feature is live! Try it out and let us know what you think.
            </BannerDescription>
          </div>
          <BannerActions class="flex gap-2 max-md:flex-wrap">
            <Button size="sm" class="text-sm">Try now</Button>
          </BannerActions>
        </div>
      </div>
      <BannerActions class="shrink-0">
        <Button
          variant="ghost"
          class="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          aria-label="Close banner"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="M6 6 18 18" />
          </svg>
        </Button>
      </BannerActions>
    </BannerContent>
  </Banner>
</template>
