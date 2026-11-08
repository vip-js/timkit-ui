<script setup lang="ts">
import { ref } from 'vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@timui/vue'



const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Table @click="onDemoClick">
    <TableHeader>
      <TableRow>
        <TableHead>Framework</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>React / Vue</TableCell>
        <TableCell>Aligned</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>HTML / Weapp</TableCell>
        <TableCell>Tracked in reports</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
