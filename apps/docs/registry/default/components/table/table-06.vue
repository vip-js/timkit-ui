<script setup lang="ts">
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table-body';
import { TableCell } from '@/components/ui/table-cell';
import { TableHead } from '@/components/ui/table-head';
import { TableHeader } from '@/components/ui/table-header';
import { TableRow } from '@/components/ui/table-row';



</script>

<template>
  <div><div class="bg-background overflow-hidden rounded-md border"><Table><TableHeader><TableRow class="bg-muted/50"><TableHead class="h-9 py-2">Name</TableHead><TableHead class="h-9 py-2">Release Year</TableHead><TableHead class="h-9 py-2">Developer</TableHead><TableHead class="h-9 py-2">Typing</TableHead><TableHead class="h-9 py-2">Paradigm</TableHead><TableHead class="h-9 py-2">Extension</TableHead><TableHead class="h-9 py-2">Latest Version</TableHead><TableHead class="h-9 py-2">Popularity</TableHead></TableRow></TableHeader><TableBody><TableRow v-for="(language, index) in programmingLanguages" :key="index" :key="language.id"><TableCell class="py-2 font-medium">{{ language.name }}</TableCell><TableCell class="py-2">{{ language.releaseYear }}</TableCell><TableCell class="py-2">{{ language.developer }}</TableCell><TableCell class="py-2">{{ language.typing }}</TableCell><TableCell class="py-2">{{ language.paradigm }}</TableCell><TableCell class="py-2">{{ language.extension }}</TableCell><TableCell class="py-2">{{ language.latestVersion }}</TableCell><TableCell class="py-2">{{ language.popularity }}</TableCell></TableRow></TableBody></Table></div><p class="text-muted-foreground mt-4 text-center text-sm">Dense table</p></div>
</template>
