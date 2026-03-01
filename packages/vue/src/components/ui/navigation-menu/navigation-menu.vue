<script setup lang="ts">
import type { AssertNoExtraKeys, NavigationMenuProps } from "@timui/core";
import { cn, navigationMenuVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";
import NavigationMenuViewport from "./navigation-menu-viewport.vue";

type Props = NavigationMenuProps & { class?: HTMLAttributes["class"] };
type _NavigationMenuPropsGuard = AssertNoExtraKeys<
  Props,
  NavigationMenuProps & { class?: HTMLAttributes["class"] }
>;

const props = defineProps<Props>();
</script>

<template>
  <nav
    data-slot="navigation-menu"
    :class="
      cn(navigationMenuVariants(), props.class)
    "
  >
    <slot />
    <NavigationMenuViewport />
  </nav>
</template>
