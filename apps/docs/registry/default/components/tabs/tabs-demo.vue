<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@timui/vue'

const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Tabs default-value="overview" class="w-full max-w-md">
    <TabsList>
      <TabsTrigger @click="onDemoClick" value="overview">Overview</TabsTrigger>
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
