<script setup lang="ts">
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
</script>
<template>
<header class="border-b px-4 md:px-6">
    <div class="flex h-16 items-center justify-between gap-4">
      <div class="flex items-center gap-6">
        <a href="#" class="text-primary hover:text-primary/90">
          <Logo />
        </a>
        <NavigationMenu class="max-md:hidden">
          <NavigationMenuList class="gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink
                class="text-muted-foreground hover:text-primary py-1.5 font-medium"
                href="#"
                active
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                class="text-muted-foreground hover:text-primary py-1.5 font-medium"
                href="#"
              >
                Features
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                class="text-muted-foreground hover:text-primary py-1.5 font-medium"
                href="#"
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                class="text-muted-foreground hover:text-primary py-1.5 font-medium"
                href="#"
              >
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div class="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" class="text-sm">
          <a href="#">Sign In</a>
        </Button>
        <Button asChild size="sm" class="text-sm">
          <a href="#">Get Started</a>
        </Button>
      </div>
    </div>
  </header>
</template>
