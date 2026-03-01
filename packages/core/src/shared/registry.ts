import { buttonSchema } from '../components/button'
import { badgeSchema } from '../components/badge'
import { toggleSchema } from '../components/toggle'
import { toastSchema } from '../components/toast'
import { navigationMenuSchema } from '../components/navigation-menu'
import { inputSchema } from '../components/input'
import { textareaSchema } from '../components/textarea'
import { checkboxSchema } from '../components/checkbox'
import { checkboxTreeSchema } from '../components/checkbox-tree'
import { switchSchema } from '../components/switch'
import { sliderSchema } from '../components/slider'
import { radioGroupSchema } from '../components/radio-group'
import { accordionSchema } from '../components/accordion'
import { tabsSchema } from '../components/tabs'
import { collapsibleSchema } from '../components/collapsible'
import { cardSchema } from '../components/card'
import { breadcrumbSchema } from '../components/breadcrumb'
import { paginationSchema } from '../components/pagination'
import { separatorSchema } from '../components/separator'
import { timelineSchema } from '../components/timeline'
import { stepperSchema } from '../components/stepper'
import { navbarSchema } from '../components/navbar'
import { dialogSchema } from '../components/dialog'
import { sheetSchema } from '../components/sheet'
import { popoverSchema } from '../components/popover'
import { tooltipSchema } from '../components/tooltip'
import { hoverCardSchema } from '../components/hover-card'
import { alertSchema } from '../components/alert'
import { bannerSchema } from '../components/banner'
import { notificationSchema } from '../components/notification'
import { avatarSchema } from '../components/avatar'
import { progressSchema } from '../components/progress'
import { selectSchema } from '../components/select'
import { selectNativeSchema } from '../components/select-native'
import { comboboxSchema } from '../components/combobox'
import { multiselectSchema } from '../components/multiselect'
import { tagsInputSchema } from '../components/tags-input'
import { calendarSchema } from '../components/calendar'
import { datePickerSchema } from '../components/date-picker'
import { tableSchema } from '../components/table'
import { treeSchema } from '../components/tree'
import { scrollAreaSchema } from '../components/scroll-area'
import { resizableSchema } from '../components/resizable'
import { imageCropperSchema } from '../components/image-cropper'
import { datefieldSchema } from '../components/datefield'
import { dropdownMenuSchema } from '../components/dropdown-menu'
import { labelSchema } from '../components/label'
import { toggleGroupSchema } from '../components/toggle-group'
import { alertDialogSchema } from '../components/alert-dialog'
import { commandSchema } from '../components/command'
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
