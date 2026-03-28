<script setup lang="ts">
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-53';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Read-only input</Label><Input :id="id" class="read-only:bg-muted" default-value="This is a read-only input" readOnly placeholder="Email" type="email" /></div>
</template>
