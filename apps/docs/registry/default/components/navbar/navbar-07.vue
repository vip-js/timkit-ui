<script setup lang="ts">
import { ref } from 'vue';
import { ChevronsUpDown } from 'lucide-vue-next';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@timui/vue';
import { Button } from '@timui/vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@timui/vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue';
import Logo from '@/registry/default/components/navbar-components/logo.vue';
import NotificationMenu from '@/registry/default/components/navbar-components/notification-menu.vue';
import UserMenu from '@/registry/default/components/navbar-components/user-menu.vue';

const projectValue = ref('1');

</script>

<template>
  <header class="border-b px-4 md:px-6"><div class="flex h-16 items-center justify-between gap-4"><div class="flex items-center gap-2"><Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#" class="text-foreground"><Logo /></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator>/ </BreadcrumbSeparator><BreadcrumbItem class="md:hidden"><DropdownMenu><DropdownMenuTrigger class="hover:text-foreground"><BreadcrumbEllipsis /><span class="sr-only">Toggle menu</span></DropdownMenuTrigger><DropdownMenuContent align="start"><DropdownMenuItem as-child><a href="#">Personal Account</a></DropdownMenuItem><DropdownMenuItem as-child><a href="#">Projects</a></DropdownMenuItem></DropdownMenuContent></DropdownMenu></BreadcrumbItem><BreadcrumbItem class="max-md:hidden"><BreadcrumbLink href="#">Personal Account</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator class="max-md:hidden">/ </BreadcrumbSeparator><BreadcrumbItem class="max-md:hidden"><BreadcrumbLink href="#">Projects</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator>/ </BreadcrumbSeparator><BreadcrumbItem><Select v-model="projectValue"><SelectTrigger aria-label="Select project" as-child><Button variant="ghost" class="focus-visible:bg-accent text-foreground h-8 px-1.5 focus-visible:ring-0"><SelectValue placeholder="Select project" /><ChevronsUpDown :size="14" class="text-muted-foreground/80" /></Button></SelectTrigger><SelectContent class="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2"><SelectItem value="1">Main project</SelectItem><SelectItem value="2">Origin project</SelectItem></SelectContent></Select></BreadcrumbItem></BreadcrumbList></Breadcrumb></div><div class="flex items-center gap-4"><NotificationMenu /><UserMenu /></div></div></header>
</template>
