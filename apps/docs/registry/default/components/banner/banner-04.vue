<script setup lang="ts">
import { Banner, BannerActions, BannerContent, BannerDescription, BannerIcon } from '@/components/ui/banner'
</script>

<template>
  <Banner class="dark bg-muted text-foreground px-4 py-3">
    <BannerContent class="flex-col justify-between gap-2 md:flex-row">
      <div class="flex grow gap-3">
        <BannerIcon class="mt-0.5 opacity-60">
          <svg
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
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </BannerIcon>
        <div class="flex grow flex-col justify-between gap-2 md:flex-row md:items-center">
          <BannerDescription class="text-sm text-foreground">
            We just added something awesome to make your experience even better.
          </BannerDescription>
          <BannerActions class="text-sm">
            <a href="#" class="group text-sm font-medium whitespace-nowrap">
              Learn more
              <svg
                class="ms-1 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
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
                <path d="M5 12h14" />
                <path d="m13 5 7 7-7 7" />
              </svg>
            </a>
          </BannerActions>
        </div>
      </div>
    </BannerContent>
  </Banner>
</template>
