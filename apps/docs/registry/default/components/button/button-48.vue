<script setup lang="ts">
import { ChromeIcon, FacebookIcon, GithubIcon, TwitterIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
</script>

<template>
  <div class="flex flex-col gap-2">
    <Button class="bg-[#DB4437] text-white after:flex-1 hover:bg-[#DB4437]/90"><span class="pointer-events-none me-2 flex-1"><ChromeIcon class="opacity-60" :size="16" aria-hidden="true" /></span>Login with Google</Button>
    <Button class="bg-[#14171a] text-white after:flex-1 hover:bg-[#14171a]/90"><span class="pointer-events-none me-2 flex-1"><TwitterIcon class="opacity-60" :size="16" aria-hidden="true" /></span>Login with X</Button>
    <Button class="bg-[#1877f2] text-white after:flex-1 hover:bg-[#1877f2]/90"><span class="pointer-events-none me-2 flex-1"><FacebookIcon class="opacity-60" :size="16" aria-hidden="true" /></span>Login with Facebook</Button>
    <Button class="bg-[#333333] text-white after:flex-1 hover:bg-[#333333]/90"><span class="pointer-events-none me-2 flex-1"><GithubIcon class="opacity-60" :size="16" aria-hidden="true" /></span>Login with GitHub</Button>
  </div>
</template>
