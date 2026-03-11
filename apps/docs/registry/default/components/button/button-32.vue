<script setup lang="ts">
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-vue-next';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { ToggleGroupItem } from '@/components/ui/toggle-group-item';



</script>

<template>
  <ToggleGroup class="divide-background inline-flex divide-x" type="single" :value="value" @update:modelValue="{
        if (value) setValue(value)
      }"><ToggleGroupItem class="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground" aria-label="Align Left" value="left"><AlignLeftIcon :size="16" aria-hidden="true" /></ToggleGroupItem><ToggleGroupItem class="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground" aria-label="Align Center" value="center"><AlignCenterIcon :size="16" aria-hidden="true" /></ToggleGroupItem><ToggleGroupItem class="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground" aria-label="Align Right" value="right"><AlignRightIcon :size="16" aria-hidden="true" /></ToggleGroupItem><ToggleGroupItem class="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground" aria-label="Align Justify" value="justify"><AlignJustifyIcon :size="16" aria-hidden="true" /></ToggleGroupItem></ToggleGroup>
</template>
