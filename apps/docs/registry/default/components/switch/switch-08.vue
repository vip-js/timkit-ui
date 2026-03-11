<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';



</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" :checked="checked" :onCheckedChange="setChecked" aria-label="Toggle switch" /><Label :htmlFor="id" class="text-sm font-medium">{{ checked ? 'On' : 'Off' }}</Label></div>
</template>
