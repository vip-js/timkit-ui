<script setup lang="ts">
import { ChromeIcon, FacebookIcon, GithubIcon, TwitterIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
</script>

<template>
  <div class="inline-flex flex-wrap gap-2">
    <Button variant="outline" aria-label="Login with Google" size="icon"><ChromeIcon :size="16" aria-hidden="true" /></Button>
    <Button variant="outline" aria-label="Login with Facebook" size="icon"><FacebookIcon :size="16" aria-hidden="true" /></Button>
    <Button variant="outline" aria-label="Login with X" size="icon"><TwitterIcon :size="16" aria-hidden="true" /></Button>
    <Button variant="outline" aria-label="Login with GitHub" size="icon"><GithubIcon :size="16" aria-hidden="true" /></Button>
  </div>
</template>
