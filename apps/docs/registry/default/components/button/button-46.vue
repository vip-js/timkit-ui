<script setup lang="ts">
import { ChromeIcon, FacebookIcon, GithubIcon, TwitterIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button class="flex-1" variant="outline" aria-label="Login with Google" size="icon"><ChromeIcon class="dark:text-primary text-[#DB4437]" :size="16" aria-hidden="true" /></Button>
    <Button class="flex-1" variant="outline" aria-label="Login with Facebook" size="icon"><FacebookIcon class="dark:text-primary text-[#1877f2]" :size="16" aria-hidden="true" /></Button>
    <Button class="flex-1" variant="outline" aria-label="Login with X" size="icon"><TwitterIcon class="dark:text-primary text-[#14171a]" :size="16" aria-hidden="true" /></Button>
    <Button class="flex-1" variant="outline" aria-label="Login with GitHub" size="icon"><GithubIcon class="dark:text-primary text-black" :size="16" aria-hidden="true" /></Button>
  </div>
</template>
