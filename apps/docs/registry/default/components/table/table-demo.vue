<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@timui/vue'
</script>

<template>
  <Table>
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
