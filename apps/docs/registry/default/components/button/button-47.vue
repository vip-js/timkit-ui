<script setup lang="ts">
import { ChromeIcon, FacebookIcon, GithubIcon, TwitterIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
</script>

<template>
  <div class="flex flex-col gap-2">
    <Button variant="outline"><ChromeIcon class="me-1 text-[#DB4437] dark:text-white/60" :size="16" aria-hidden="true" />Login with Google</Button>
    <Button variant="outline"><TwitterIcon class="me-1 text-[#14171a] dark:text-white/60" :size="16" aria-hidden="true" />Login with X</Button>
    <Button variant="outline"><FacebookIcon class="me-1 text-[#1877f2] dark:text-white/60" :size="16" aria-hidden="true" />Login with Facebook</Button>
    <Button variant="outline"><GithubIcon class="me-1 text-[#333333] dark:text-white/60" :size="16" aria-hidden="true" />Login with GitHub</Button>
  </div>
</template>
