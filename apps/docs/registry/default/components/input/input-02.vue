<script setup lang="ts">
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-02';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Required input <span class="text-destructive">*</span></Label><Input :id="id" placeholder="Email" type="email" required /></div>
</template>
