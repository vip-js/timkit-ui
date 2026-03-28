<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';



const checked = ref<boolean | 'indeterminate'>('indeterminate');


const id = 'checkbox-02';


function setChecked(next: typeof checked.value | ((prev: typeof checked.value) => typeof checked.value)) {
  checked.value = typeof next === 'function'
    ? (next as (prev: typeof checked.value) => typeof checked.value)(checked.value)
    : next;
}

</script>

<template>
  <div class="flex items-center gap-2"><Checkbox :id="id" :checked="checked" :onCheckedChange="setChecked" /><Label :htmlFor="id">Indeterminate checkbox</Label></div>
</template>
