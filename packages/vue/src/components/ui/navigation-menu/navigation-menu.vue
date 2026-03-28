<script setup lang="ts">
import type { AssertNoExtraKeys, NavigationMenuProps } from '@timui/core'
import { cn, navigationMenuVariants } from '@timui/core'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  type HTMLAttributes,
} from 'vue'

import NavigationMenuViewport from './navigation-menu-viewport.vue'
import { provideNavigationMenuRootContext } from './use-navigation-menu-context'

type Props = NavigationMenuProps & { class?: HTMLAttributes['class']; viewport?: boolean }
type _NavigationMenuPropsGuard = AssertNoExtraKeys<
  Props,
  NavigationMenuProps & { class?: HTMLAttributes['class']; viewport?: boolean }
>

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  viewport: true,
})

const rootRef = ref<HTMLElement | null>(null)
const openItem = ref<string | null>(null)
const activeItem = ref<string | null>(null)
const userSelected = ref(false)
const viewport = computed(() => props.viewport ?? true)

const setOpenItem = (value: string | null) => {
  openItem.value = value
}

const setActiveItem = (value: string | null) => {
  activeItem.value = value
}

const setUserSelected = (value: boolean) => {
  userSelected.value = value
}

const onPointerDown = (event: PointerEvent) => {
  const target = event.target
  if (!(target instanceof Node)) return
  if (!rootRef.value?.contains(target)) {
    setOpenItem(null)
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
})

provideNavigationMenuRootContext({
  openItem,
  setOpenItem,
  activeItem,
  setActiveItem,
  userSelected,
  setUserSelected,
  viewport,
})
</script>

<template>
  <nav
    ref="rootRef"
    data-slot="navigation-menu"
    :data-orientation="props.orientation"
    :class="
      cn(navigationMenuVariants(), props.class)
    "
  >
    <slot />
    <NavigationMenuViewport v-if="props.viewport" />
  </nav>
</template>
