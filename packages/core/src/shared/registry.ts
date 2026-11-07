import { accordionSchema } from '../components/accordion/schema'
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
import { formSchema } from '../components/form/schema'
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

// Getters, not an object literal. esbuild's `export { default as schema }`
// live bindings are assigned after this module's body, so a literal would
// capture `undefined` for the last schema in the chunk.
const schema = <T>(get: () => T) => ({ enumerable: true, get })

export const ucsRegistry = Object.defineProperties({} as UCSRegistry, {
  button: schema(() => buttonSchema),
  badge: schema(() => badgeSchema),
  toggle: schema(() => toggleSchema),
  toast: schema(() => toastSchema),
  'navigation-menu': schema(() => navigationMenuSchema),
  input: schema(() => inputSchema),
  textarea: schema(() => textareaSchema),
  checkbox: schema(() => checkboxSchema),
  'checkbox-tree': schema(() => checkboxTreeSchema),
  switch: schema(() => switchSchema),
  slider: schema(() => sliderSchema),
  'radio-group': schema(() => radioGroupSchema),
  accordion: schema(() => accordionSchema),
  tabs: schema(() => tabsSchema),
  collapsible: schema(() => collapsibleSchema),
  card: schema(() => cardSchema),
  breadcrumb: schema(() => breadcrumbSchema),
  pagination: schema(() => paginationSchema),
  separator: schema(() => separatorSchema),
  timeline: schema(() => timelineSchema),
  stepper: schema(() => stepperSchema),
  navbar: schema(() => navbarSchema),
  dialog: schema(() => dialogSchema),
  form: schema(() => formSchema),
  sheet: schema(() => sheetSchema),
  popover: schema(() => popoverSchema),
  tooltip: schema(() => tooltipSchema),
  'hover-card': schema(() => hoverCardSchema),
  alert: schema(() => alertSchema),
  banner: schema(() => bannerSchema),
  notification: schema(() => notificationSchema),
  'number-field': schema(() => numberFieldSchema),
  avatar: schema(() => avatarSchema),
  progress: schema(() => progressSchema),
  select: schema(() => selectSchema),
  'select-native': schema(() => selectNativeSchema),
  combobox: schema(() => comboboxSchema),
  multiselect: schema(() => multiselectSchema),
  'tags-input': schema(() => tagsInputSchema),
  calendar: schema(() => calendarSchema),
  'date-picker': schema(() => datePickerSchema),
  table: schema(() => tableSchema),
  tree: schema(() => treeSchema),
  'scroll-area': schema(() => scrollAreaSchema),
  resizable: schema(() => resizableSchema),
  'image-cropper': schema(() => imageCropperSchema),
  datefield: schema(() => datefieldSchema),
  'dropdown-menu': schema(() => dropdownMenuSchema),
  label: schema(() => labelSchema),
  'toggle-group': schema(() => toggleGroupSchema),
  'alert-dialog': schema(() => alertDialogSchema),
  command: schema(() => commandSchema),
})

export type UcsRegistry = typeof ucsRegistry
