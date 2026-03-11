<script setup lang="ts">
import { MoonIcon, SunIcon } from 'lucide-vue-next';
import { Switch } from '@/components/ui/switch';



</script>

<template>
  <div class="group inline-flex items-center gap-2" :data-state="checked ? 'checked' : 'unchecked'"><span :id="`${id}-off`" class="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium" :aria-controls="id" @click="setChecked(false)"><MoonIcon :size="16" aria-hidden="true" /></span><Switch :id="id" :checked="checked" :onCheckedChange="toggleSwitch" :aria-labelledby="`${id}-off ${id}-on`" aria-label="Toggle between dark and light mode" /><span :id="`${id}-on`" class="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium" :aria-controls="id" @click="setChecked(true)"><SunIcon :size="16" aria-hidden="true" /></span></div>
</template>
