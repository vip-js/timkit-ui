<script setup lang="ts">
import { ChevronsUpDown } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';



</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button variant="ghost" class="p-0 hover:bg-transparent"><span class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">{{ selectedProject.charAt(0).toUpperCase() }}</span><div class="flex flex-col gap-0.5 leading-none"><span class="">{{ selectedProject }}</span></div><ChevronsUpDown :size="14" class="text-muted-foreground/80" /></Button></DropdownMenuTrigger><DropdownMenuContent align="start"><DropdownMenuItem v-for="(project, index) in teams" :key="index" :key="project" :onSelect="() => setSelectedProject(project)">{{ project }}</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
</template>
