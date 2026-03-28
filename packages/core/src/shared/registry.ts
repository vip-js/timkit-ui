import { accordionSchema } from '../components/accordion'
import { alertSchema } from '../components/alert'
import { alertDialogSchema } from '../components/alert-dialog'
import { avatarSchema } from '../components/avatar'
import { badgeSchema } from '../components/badge'
import { bannerSchema } from '../components/banner'
import { breadcrumbSchema } from '../components/breadcrumb'
import { buttonSchema } from '../components/button'
import { calendarSchema } from '../components/calendar'
import { cardSchema } from '../components/card'
import { checkboxSchema } from '../components/checkbox'
import { checkboxTreeSchema } from '../components/checkbox-tree'
import { collapsibleSchema } from '../components/collapsible'
import { comboboxSchema } from '../components/combobox'
import { commandSchema } from '../components/command'
import { datePickerSchema } from '../components/date-picker'
import { datefieldSchema } from '../components/datefield'
import { dialogSchema } from '../components/dialog'
import { dropdownMenuSchema } from '../components/dropdown-menu'
import { hoverCardSchema } from '../components/hover-card'
import { imageCropperSchema } from '../components/image-cropper'
import { inputSchema } from '../components/input'
import { labelSchema } from '../components/label'
import { multiselectSchema } from '../components/multiselect'
import { navbarSchema } from '../components/navbar'
import { navigationMenuSchema } from '../components/navigation-menu'
import { notificationSchema } from '../components/notification'
import { numberFieldSchema } from '../components/number-field'
import { paginationSchema } from '../components/pagination'
import { popoverSchema } from '../components/popover'
import { progressSchema } from '../components/progress'
import { radioGroupSchema } from '../components/radio-group'
import { resizableSchema } from '../components/resizable'
import { scrollAreaSchema } from '../components/scroll-area'
import { selectSchema } from '../components/select'
import { selectNativeSchema } from '../components/select-native'
import { separatorSchema } from '../components/separator'
import { sheetSchema } from '../components/sheet'
import { sliderSchema } from '../components/slider'
import { stepperSchema } from '../components/stepper'
import { switchSchema } from '../components/switch'
import { tableSchema } from '../components/table'
import { tabsSchema } from '../components/tabs'
import { tagsInputSchema } from '../components/tags-input'
import { textareaSchema } from '../components/textarea'
import { timelineSchema } from '../components/timeline'
import { toastSchema } from '../components/toast'
import { toggleSchema } from '../components/toggle'
import { toggleGroupSchema } from '../components/toggle-group'
import { tooltipSchema } from '../components/tooltip'
import { treeSchema } from '../components/tree'
import type { UCSRegistry } from './ucs'

export const ucsRegistry: UCSRegistry = {
  button: buttonSchema,
  badge: badgeSchema,
  toggle: toggleSchema,
  toast: toastSchema,
  'navigation-menu': navigationMenuSchema,
  input: inputSchema,
  textarea: textareaSchema,
  checkbox: checkboxSchema,
  'checkbox-tree': checkboxTreeSchema,
  switch: switchSchema,
  slider: sliderSchema,
  'radio-group': radioGroupSchema,
  accordion: accordionSchema,
  tabs: tabsSchema,
  collapsible: collapsibleSchema,
  card: cardSchema,
  breadcrumb: breadcrumbSchema,
  pagination: paginationSchema,
  separator: separatorSchema,
  timeline: timelineSchema,
  stepper: stepperSchema,
  navbar: navbarSchema,
  dialog: dialogSchema,
  sheet: sheetSchema,
  popover: popoverSchema,
  tooltip: tooltipSchema,
  'hover-card': hoverCardSchema,
  alert: alertSchema,
  banner: bannerSchema,
  notification: notificationSchema,
  'number-field': numberFieldSchema,
  avatar: avatarSchema,
  progress: progressSchema,
  select: selectSchema,
  'select-native': selectNativeSchema,
  combobox: comboboxSchema,
  multiselect: multiselectSchema,
  'tags-input': tagsInputSchema,
  calendar: calendarSchema,
  'date-picker': datePickerSchema,
  table: tableSchema,
  tree: treeSchema,
  'scroll-area': scrollAreaSchema,
  resizable: resizableSchema,
  'image-cropper': imageCropperSchema,
  datefield: datefieldSchema,
  'dropdown-menu': dropdownMenuSchema,
  label: labelSchema,
  'toggle-group': toggleGroupSchema,
  'alert-dialog': alertDialogSchema,
  command: commandSchema,
}

export type UcsRegistry = typeof ucsRegistry
