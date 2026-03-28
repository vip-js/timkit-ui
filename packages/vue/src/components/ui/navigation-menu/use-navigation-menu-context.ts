import { inject, provide, type InjectionKey, type Ref } from 'vue'

export type NavigationMenuRootContextValue = {
  openItem: Ref<string | null>
  setOpenItem: (value: string | null) => void
  activeItem: Ref<string | null>
  setActiveItem: (value: string | null) => void
  userSelected: Ref<boolean>
  setUserSelected: (value: boolean) => void
  viewport: Ref<boolean>
}

export type NavigationMenuItemContextValue = {
  value: Ref<string>
  triggerId: Ref<string>
  contentId: Ref<string>
  open: Ref<boolean>
  setOpen: (open: boolean) => void
}

const navigationMenuRootContextKey: InjectionKey<NavigationMenuRootContextValue> = Symbol(
  'navigationMenuRootContext'
)
const navigationMenuItemContextKey: InjectionKey<NavigationMenuItemContextValue> = Symbol(
  'navigationMenuItemContext'
)

export function provideNavigationMenuRootContext(value: NavigationMenuRootContextValue) {
  provide(navigationMenuRootContextKey, value)
}

export function useNavigationMenuRootContext() {
  return inject(navigationMenuRootContextKey, null)
}

export function provideNavigationMenuItemContext(value: NavigationMenuItemContextValue) {
  provide(navigationMenuItemContextKey, value)
}

export function useNavigationMenuItemContext() {
  return inject(navigationMenuItemContextKey, null)
}
