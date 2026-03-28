<script setup lang="ts">
import { ref } from 'vue';
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';



const checked = ref<boolean>(true);


const id = 'switch-08';


function setChecked(next: typeof checked.value | ((prev: typeof checked.value) => typeof checked.value)) {
  checked.value = typeof next === 'function'
    ? (next as (prev: typeof checked.value) => typeof checked.value)(checked.value)
    : next;
}

</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" :checked="checked" :onCheckedChange="setChecked" aria-label="Toggle switch" /><Label :htmlFor="id" class="text-sm font-medium"><template v-if="checked">
{{ 'On' }}
</template>
<template v-else>
{{ 'Off' }}
</template></Label></div>
</template>
