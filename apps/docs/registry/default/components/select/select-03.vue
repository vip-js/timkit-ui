<script setup lang="ts">
import { ClockIcon } from 'lucide-vue-next';
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';





const id = 'select-03';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with icon (native)</Label><div class="group relative"><SelectNative :id="id" class="ps-9"><option value="1">00:00 AM - 11:59 PM</option><option value="2">01:00 AM - 12:59 PM</option><option value="3">02:00 AM - 01:59 PM</option><option value="4">03:00 AM - 02:59 PM</option></SelectNative><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 group-has-[select[disabled]]:opacity-50"><ClockIcon :size="16" aria-hidden="true" /></div></div></div>
</template>
