<script setup lang="ts">
import { Avatar, AvatarImage } from '@timui/vue'

const avatars = [
  { src: '/avatar-80-03.jpg', alt: 'Avatar 01' },
  { src: '/avatar-80-04.jpg', alt: 'Avatar 02' },
  { src: '/avatar-80-05.jpg', alt: 'Avatar 03' },
  { src: '/avatar-80-06.jpg', alt: 'Avatar 04' },
]
</script>

<template>
  <div class="bg-background flex items-center rounded-full border p-1 shadow-sm">
    <div class="flex -space-x-1.5">
      <Avatar v-for="avatar in avatars" :key="avatar.src" class="size-5 ring-1 ring-background">
        <AvatarImage :src="avatar.src" :alt="avatar.alt" />
      </Avatar>
    </div>
    <p class="text-muted-foreground px-2 text-xs">
      Trusted by <strong class="text-foreground font-medium">60K+</strong> developers.
    </p>
  </div>
</template>
