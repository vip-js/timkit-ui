<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@timui/vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue';




</script>

<template>
  <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Databases</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><Select default-value="1"><SelectTrigger id="select-database" class="relative gap-2 ps-9" aria-label="Select database"><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 group-has-[select[disabled]]:opacity-50"><svg :width="16" :height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5" /><path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6" /></svg></div><SelectValue placeholder="Select database" /></SelectTrigger><SelectContent><SelectItem value="1">Orion</SelectItem><SelectItem value="2">Sigma</SelectItem><SelectItem value="3">Dorado</SelectItem></SelectContent></Select></BreadcrumbItem></BreadcrumbList></Breadcrumb>
</template>
