<script setup lang="ts">
import Tabs from '@/components/ui/tabs/tabs.vue'
import TabsContent from '@/components/ui/tabs/tabs-content.vue'
import TabsList from '@/components/ui/tabs/tabs-list.vue'
import TabsTrigger from '@/components/ui/tabs/tabs-trigger.vue'
</script>

<template>
  <Tabs default-value="overview" class="w-full max-w-md">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="docs">Docs</TabsTrigger>
      <TabsTrigger value="qa">QA</TabsTrigger>
    </TabsList>
    <TabsContent value="overview" class="text-muted-foreground mt-4 text-sm">
      Shared core props keep React and Vue behavior aligned.
    </TabsContent>
    <TabsContent value="docs" class="text-muted-foreground mt-4 text-sm">
      P2 adds multi-framework docs samples for every component family.
    </TabsContent>
    <TabsContent value="qa" class="text-muted-foreground mt-4 text-sm">
      CI reports now show demo gaps separately from implementation gaps.
    </TabsContent>
  </Tabs>
</template>
