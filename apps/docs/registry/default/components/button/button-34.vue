<script setup lang="ts">
import { ToggleGroup } from '@/components/ui/toggle-group';
import { ToggleGroupItem } from '@/components/ui/toggle-group-item';



</script>

<template>
  <ToggleGroup variant="outline" class="inline-flex" type="single"><ToggleGroupItem value="left">Left</ToggleGroupItem><ToggleGroupItem value="center">Center</ToggleGroupItem><ToggleGroupItem value="right">Right</ToggleGroupItem></ToggleGroup>
</template>
