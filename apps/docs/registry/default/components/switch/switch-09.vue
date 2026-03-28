<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@timui/vue';



const checked = ref(false);


function setChecked(next: typeof checked.value | ((prev: typeof checked.value) => typeof checked.value)) {
  checked.value = typeof next === 'function'
    ? (next as (prev: typeof checked.value) => typeof checked.value)(checked.value)
    : next;
}


const id = 'switch-09';

</script>

<template>
  <div class="group inline-flex items-center gap-2" :data-state="checked ? 'checked' : 'unchecked'"><span :id="`${id}-off`" class="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium" :aria-controls="id" @click="setChecked(false)">Off
      </span><Switch :id="id" :checked="checked" :onCheckedChange="toggleSwitch" :aria-labelledby="`${id}-off ${id}-on`" /><span :id="`${id}-on`" class="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium" :aria-controls="id" @click="setChecked(true)">On
      </span></div>
</template>
