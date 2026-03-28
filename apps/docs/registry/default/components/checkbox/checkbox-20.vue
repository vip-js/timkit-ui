<script setup lang="ts">
import { ref } from 'vue'
import { MoonIcon, SunIcon } from 'lucide-vue-next'
import { Checkbox } from '@timui/vue'
import { Label } from '@timui/vue'

const id = 'checkbox-20'
const isDark = ref(false)

function setChecked(checked: boolean | 'indeterminate') {
  isDark.value = checked === true
}
</script>

<template>
  <fieldset class="space-y-4">
    <legend class="text-foreground text-sm leading-none font-medium">Dark mode toggle checkbox</legend>
    <div class="flex items-center gap-2">
      <Checkbox :id="id" :checked="isDark" :onCheckedChange="setChecked" />
      <Label :htmlFor="id" class="inline-flex items-center gap-2">
        <span class="border-input bg-background inline-flex size-9 items-center justify-center rounded-md border">
          <MoonIcon v-if="isDark" :size="16" aria-hidden="true" />
          <SunIcon v-else :size="16" aria-hidden="true" />
        </span>
        <span class="text-sm">{{ isDark ? 'Dark' : 'Light' }} mode</span>
      </Label>
    </div>
  </fieldset>
</template>
