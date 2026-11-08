<script setup lang="ts">
import { ref } from 'vue'
import { DataTable } from '@timui/vue'

const columns = [{ id: 'name', header: 'Name' }]
const rows = [
  { id: '2', cells: { name: 'Grace' } },
  { id: '1', cells: { name: 'Ada' } },
]



const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="grid gap-8">
    <DataTable @click="onDemoClick" caption="People" :columns="columns" :rows="rows" />
    <DataTable caption="Empty" :columns="columns" :rows="[]" empty-label="Nothing here" />
  </div>
</template>
