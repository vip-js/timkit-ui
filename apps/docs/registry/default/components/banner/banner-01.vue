<script setup lang="ts">
import { Banner, BannerActions, BannerContent, BannerDescription } from '@/components/ui/banner'
import { Button } from '@/components/ui/button'
</script>

<template>
  <Banner class="bg-background z-50 rounded-md border px-4 py-3 shadow-lg">
    <BannerContent class="flex-col justify-between gap-3 md:flex-row md:items-center">
      <BannerDescription class="text-sm text-foreground">
        We use cookies to improve your experience, analyze site usage, and show personalized
        content.
      </BannerDescription>
      <BannerActions class="flex gap-2 max-md:flex-wrap">
        <Button size="sm">Accept</Button>
        <Button variant="outline" size="sm">Decline</Button>
      </BannerActions>
    </BannerContent>
  </Banner>
</template>
