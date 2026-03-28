<script setup lang="ts">
import { MailIcon } from 'lucide-vue-next';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-10';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with end icon</Label><div class="relative"><Input :id="id" class="peer pe-9" placeholder="Email" type="email" /><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50"><MailIcon :size="16" aria-hidden="true" /></div></div></div>
</template>
