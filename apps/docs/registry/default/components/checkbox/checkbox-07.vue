<script setup lang="ts">
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'checkbox-07';

</script>

<template>
  <div class="flex items-center gap-2"><Checkbox :id="id" /><Label :htmlFor="id">I agree to the{{ ' ' }}<a class="underline" href="https://ui.timkit.cn" target="_blank">terms of service
        </a></Label></div>
</template>
