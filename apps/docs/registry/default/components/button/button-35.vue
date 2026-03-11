<script setup lang="ts">
import { ToggleGroup } from '@/components/ui/toggle-group';
import { ToggleGroupItem } from '@/components/ui/toggle-group-item';



</script>

<template>
  <ToggleGroup type="single" variant="outline" :value="value" @update:modelValue="{
        if (value) setValue(value)
      }"><ToggleGroupItem class="flex-1" value="left">Left
      </ToggleGroupItem><ToggleGroupItem class="flex-1" value="center">Center
      </ToggleGroupItem><ToggleGroupItem class="flex-1" value="right">Right
      </ToggleGroupItem></ToggleGroup>
</template>
