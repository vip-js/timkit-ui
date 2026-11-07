<script setup lang="ts">
import { ref } from 'vue'
import { AgentMessage, ApprovalCard } from '@timui/vue'
const status = ref<'pending' | 'approved' | 'rejected'>('pending')
</script>

<template>
  <div class="space-y-3">
    <AgentMessage role="user">Refund order 1842.</AgentMessage>
    <ApprovalCard
      title="Refund 48 dollars"
      description="Wait for a person before sending the refund."
      :status="status"
      @approve="status = 'approved'"
      @reject="status = 'rejected'"
    />
  </div>
</template>
