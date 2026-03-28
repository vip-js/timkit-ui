<script setup lang="ts">
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'checkbox-05';

</script>

<template>
  <div class="flex items-center gap-2"><Checkbox :id="id" defaultChecked /><Label :htmlFor="id" class="peer-data-[state=checked]:line-through">Simple todo item
      </Label></div>
</template>
