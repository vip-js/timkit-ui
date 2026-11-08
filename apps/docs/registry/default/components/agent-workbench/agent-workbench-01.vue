<script setup lang="ts">
import { ref } from 'vue'
const status = ref<'pending' | 'approved' | 'rejected'>('pending')
</script>

<template>
  <div class="space-y-3">
    <article data-slot="agent-message" data-role="user" class="rounded-lg border px-3 py-2 text-sm">
      <p class="text-xs font-medium">You</p>
      <p>Refund order 1842.</p>
    </article>
    <section data-slot="approval-card" :data-status="status" class="grid gap-3 rounded-lg border p-3 text-sm">
      <div class="grid gap-1">
        <h3 class="font-medium leading-6">Refund 48 dollars</h3>
        <p class="leading-6 text-muted-foreground">Wait for a person before sending the refund.</p>
      </div>
      <div v-if="status === 'pending'" class="flex flex-wrap gap-2" role="group" aria-label="Approval actions">
        <button type="button" class="min-h-11 rounded-lg border px-4 font-medium" @click="status = 'rejected'">Reject</button>
        <button type="button" class="min-h-11 rounded-lg bg-primary px-4 font-medium text-primary-foreground" @click="status = 'approved'">Approve</button>
      </div>
      <p v-else aria-live="polite" class="text-xs font-medium">Receipt: {{ status === 'approved' ? 'Approved' : 'Rejected' }}</p>
    </section>
  </div>
</template>
