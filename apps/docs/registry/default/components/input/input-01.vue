<script setup lang="ts">
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-01';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Simple input</Label><Input :id="id" placeholder="Email" type="email" /></div>
</template>
