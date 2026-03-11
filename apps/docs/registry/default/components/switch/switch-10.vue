<script setup lang="ts">
import { MoonIcon, SunIcon } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';



</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" :checked="checked" :onCheckedChange="setChecked" aria-label="Toggle switch" /><Label :htmlFor="id"><span class="sr-only">Toggle switch</span>{{ checked ? (
          <SunIcon size={16} aria-hidden="true" />
        ) : (
          <MoonIcon size={16} aria-hidden="true" />
        ) }}</Label></div>
</template>
