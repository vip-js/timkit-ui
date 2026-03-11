export type MultiselectOption = {
  /**
   * The controlled value of the component.
   */
  value: string
  /**
   * The text label displayed alongside or within the component.
   */
  label: string
  disable?: boolean
  /**
   * When `true`, forces the component position to remain fixed within its container.
   */
  fixed?: boolean
  [key: string]: string | number | boolean | null | undefined | object
}

export type MultiselectProps = {
  /**
   * The controlled value of the component.
   */
  value?: MultiselectOption[]
  /**
   * The initial list of given options.
   */
  defaultOptions?: MultiselectOption[]
  /**
   * The list of available options.
   */
  options?: MultiselectOption[]
  /**
   * Short hint displayed in the input before the user enters a value.
   */
  placeholder?: string
  /**
   * The delay in milliseconds before the component responds to the interaction.
   */
  delay?: number
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
  /**
   * The maximum number of items that can be selected.
   */
  maxSelected?: number
  /**
   * If `true`, masks the placeholder string when a selection is made.
   */
  hidePlaceholderWhenSelected?: boolean
  /**
   * The property key used to group options.
   */
  groupBy?: string
  /**
   * If `true`, automatically focuses or selects the first item.
   */
  selectFirstItem?: boolean
  /**
   * When `true`, allows the user to manually create options that are not in the list.
   */
  creatable?: boolean
  /**
   * When `true`, automatically triggers a search when the input is focused.
   */
  triggerSearchOnFocus?: boolean
  /**
   * When `true`, hides the clear all interactions button.
   */
  hideClearAllButton?: boolean
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (options: MultiselectOption[]) => void
  /**
   * Callback fired when the user initiates a search request.
   */
  onSearch?: (value: string) => Promise<MultiselectOption[]>
  /**
   * Callback fired synchronously on each keystroke of a search request.
   */
  onSearchSync?: (value: string) => MultiselectOption[]
  /**
   * Callback fired when the user attempts to select more items than allowed.
   */
  onMaxSelected?: (count: number) => void
}

export type MultiselectVueProps = {
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: MultiselectOption[]
  /**
   * The initial list of given options.
   */
  defaultOptions?: MultiselectOption[]
  /**
   * The list of available options.
   */
  options?: MultiselectOption[]
  /**
   * Short hint displayed in the input before the user enters a value.
   */
  placeholder?: string
  /**
   * The delay in milliseconds before the component responds to the interaction.
   */
  delay?: number
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
  /**
   * The maximum number of items that can be selected.
   */
  maxSelected?: number
  /**
   * If `true`, masks the placeholder string when a selection is made.
   */
  hidePlaceholderWhenSelected?: boolean
  /**
   * The property key used to group options.
   */
  groupBy?: string
  /**
   * If `true`, automatically focuses or selects the first item.
   */
  selectFirstItem?: boolean
  /**
   * When `true`, allows the user to manually create options that are not in the list.
   */
  creatable?: boolean
  /**
   * When `true`, automatically triggers a search when the input is focused.
   */
  triggerSearchOnFocus?: boolean
  /**
   * When `true`, hides the clear all interactions button.
   */
  hideClearAllButton?: boolean
  /**
   * Callback fired when the user initiates a search request.
   */
  onSearch?: (value: string) => Promise<MultiselectOption[]>
  /**
   * Callback fired synchronously on each keystroke of a search request.
   */
  onSearchSync?: (value: string) => MultiselectOption[]
  /**
   * Callback fired when the user attempts to select more items than allowed.
   */
  onMaxSelected?: (count: number) => void
}
