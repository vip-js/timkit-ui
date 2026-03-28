<script setup lang="ts">
import { AtomIcon, GlobeIcon, RocketIcon } from 'lucide-vue-next'
import { Label } from '@timui/vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue'

const id = 'select-34'
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Options with icon</Label>
    <Select default-value="3">
      <SelectTrigger :id="id" class="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectContent class="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
        <SelectItem value="1">
          <AtomIcon :size="16" aria-hidden="true" />
          <span class="truncate">React</span>
        </SelectItem>
        <SelectItem value="2">
          <RocketIcon :size="16" aria-hidden="true" />
          <span class="truncate">Next.js</span>
        </SelectItem>
        <SelectItem value="3">
          <GlobeIcon :size="16" aria-hidden="true" />
          <span class="truncate">Gatsby</span>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
