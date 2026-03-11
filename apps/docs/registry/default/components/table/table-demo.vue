<script setup lang="ts">
import Table from '@/components/ui/table/table.vue'
import TableBody from '@/components/ui/table/table-body.vue'
import TableCell from '@/components/ui/table/table-cell.vue'
import TableHead from '@/components/ui/table/table-head.vue'
import TableHeader from '@/components/ui/table/table-header.vue'
import TableRow from '@/components/ui/table/table-row.vue'
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
