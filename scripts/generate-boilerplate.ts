import fs from 'fs'
import path from 'path'
import { UCS } from '../packages/core/src'
import {
  buttonSchema,
  badgeSchema,
  toggleSchema,
  toastSchema,
  navigationMenuSchema,
  inputSchema,
  textareaSchema,
  checkboxSchema,
  checkboxTreeSchema,
  switchSchema,
  sliderSchema,
  radioGroupSchema,
  accordionSchema,
  tabsSchema,
  collapsibleSchema,
  cardSchema,
  breadcrumbSchema,
  paginationSchema,
  separatorSchema,
  timelineSchema,
  stepperSchema,
  navbarSchema,
  dialogSchema,
  sheetSchema,
  popoverSchema,
  tooltipSchema,
  hoverCardSchema,
  alertSchema,
  bannerSchema,
  notificationSchema,
  avatarSchema,
  progressSchema,
  selectSchema,
  selectNativeSchema,
  comboboxSchema,
  multiselectSchema,
  tagsInputSchema,
  calendarSchema,
  datePickerSchema,
  tableSchema,
  treeSchema,
  scrollAreaSchema,
  resizableSchema,
  imageCropperSchema,
  datefieldSchema,
  dropdownMenuSchema,
  labelSchema,
  toggleGroupSchema,
  alertDialogSchema,
  commandSchema
} from '../packages/core/src'

const schemas: Record<string, UCS> = {
  button: buttonSchema as UCS,
  badge: badgeSchema as UCS,
  toggle: toggleSchema as UCS,
  toast: toastSchema as UCS,
  'navigation-menu': navigationMenuSchema as UCS,
  input: inputSchema as UCS,
  textarea: textareaSchema as UCS,
  checkbox: checkboxSchema as UCS,
  'checkbox-tree': checkboxTreeSchema as UCS,
  switch: switchSchema as UCS,
  slider: sliderSchema as UCS,
  'radio-group': radioGroupSchema as UCS,
  accordion: accordionSchema as UCS,
  tabs: tabsSchema as UCS,
  collapsible: collapsibleSchema as UCS,
  card: cardSchema as UCS,
  breadcrumb: breadcrumbSchema as UCS,
  pagination: paginationSchema as UCS,
  separator: separatorSchema as UCS,
  timeline: timelineSchema as UCS,
  stepper: stepperSchema as UCS,
  navbar: navbarSchema as UCS,
  dialog: dialogSchema as UCS,
  sheet: sheetSchema as UCS,
  popover: popoverSchema as UCS,
  tooltip: tooltipSchema as UCS,
  'hover-card': hoverCardSchema as UCS,
  alert: alertSchema as UCS,
  banner: bannerSchema as UCS,
  notification: notificationSchema as UCS,
  avatar: avatarSchema as UCS,
  progress: progressSchema as UCS,
  select: selectSchema as UCS,
  'select-native': selectNativeSchema as UCS,
  combobox: comboboxSchema as UCS,
  multiselect: multiselectSchema as UCS,
  'tags-input': tagsInputSchema as UCS,
  calendar: calendarSchema as UCS,
  'date-picker': datePickerSchema as UCS,
  table: tableSchema as UCS,
  tree: treeSchema as UCS,
  'scroll-area': scrollAreaSchema as UCS,
  resizable: resizableSchema as UCS,
  'image-cropper': imageCropperSchema as UCS,
  datefield: datefieldSchema as UCS,
  'dropdown-menu': dropdownMenuSchema as UCS,
  label: labelSchema as UCS,
  'toggle-group': toggleGroupSchema as UCS,
  'alert-dialog': alertDialogSchema as UCS,
  command: commandSchema as UCS,
}


const OUTPUT_DIR = path.join(process.cwd(), 'temp-boilerplate')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR)
}

function generateReact(ucs: UCS): string {
  const propsName = `${ucs.title}Props`
  const props = (ucs.props || []).map(p => {
    const isEvent = p.type === 'event' || p.name.startsWith('on')
    if (isEvent) {
      return `  ${p.name}${p.required ? '' : '?'}: (event: { readonly type: string; detail: object }) => void`
    }
    return `  ${p.name}${p.required ? '' : '?'}: ${p.type === 'enum' ? (p.values?.map(v => `'${v}'`).join(' | ')) : p.type}`
  }).join('\n')

  return `
import * as React from "react"
import { cn } from "@/lib/utils"
import { ${ucs.name}Variants } from "@/lib/utils"

export interface ${propsName} extends React.ButtonHTMLAttributes<HTMLButtonElement> {
${props}
}

const ${ucs.title} = React.forwardRef<HTMLButtonElement, ${propsName}>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(${ucs.name}Variants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
${ucs.title}.displayName = "${ucs.title}"

export { ${ucs.title} }
`
}

function generateVue(ucs: UCS): string {
  const propsValues = ucs.props || []
  const props = propsValues
    .filter(p => p.type !== 'event')
    .map(p => `  ${p.name}: { type: ${p.type === 'string' ? 'String' : p.type === 'boolean' ? 'Boolean' : 'Object'}, default: ${JSON.stringify(p.defaultValue)} }`)
    .join(',\n')

  const emits = propsValues
    .filter(p => p.type === 'event' || p.name.startsWith('on'))
    .map(p => `  '${p.name.startsWith('on') ? p.name.slice(2).toLowerCase() : p.name}'`)
    .join(',\n')

  return `
<script setup lang="ts">
import { cn } from "@/lib/utils"
import { ${ucs.name}Variants } from "@/lib/utils"

const props = defineProps({
${props}
})

const emit = defineEmits([
${emits}
])
</script>

<template>
  <button :class="cn(${ucs.name}Variants({ variant: props.variant, size: props.size }), $attrs.class)">
    <slot />
  </button>
</template>
`
}

function generateWeapp(ucs: UCS): { wxml: string, ts: string } {
  const propsValues = ucs.props || []
  const properties = propsValues
    .filter(p => p.type !== 'event')
    .map(p => `    ${p.name}: { type: ${p.type === 'string' ? 'String' : p.type === 'boolean' ? 'Boolean' : 'String'}, value: ${JSON.stringify(p.defaultValue)} }`)
    .join(',\n')

  const wxml = `<button class="{{baseClass}} {{extClass}}" bindtap="handleTap">
  <slot></slot>
</button>`

  const ts = `import { ${ucs.name}Variants } from '../utils'

Component({
  externalClasses: ['ext-class'],
  properties: {
${properties}
  },
  data: {
    baseClass: '',
  },
  observers: {
    '${(ucs.props || []).filter(p => p.type !== 'event').map(p => p.name).join(', ')}': function() {
       this.setData({
         baseClass: ${ucs.name}Variants(this.properties)
       })
    }
  },
  methods: {
    handleTap(e: object) {
      // Mapping Press to native tap
      this.triggerEvent('press', e)
    }
  }
})`

  return { wxml, ts }
}


async function main() {
  const componentName = process.argv[2]
  const ucs = schemas[componentName]

  if (!ucs) {
    console.error(`Component ${componentName} not found in schemas.`)
    process.exit(1)
  }

  const compDir = path.join(OUTPUT_DIR, componentName)
  if (!fs.existsSync(compDir)) fs.mkdirSync(compDir)

  // React
  fs.writeFileSync(path.join(compDir, `${componentName}.tsx`), generateReact(ucs))

  // Vue
  fs.writeFileSync(path.join(compDir, `${componentName}.vue`), generateVue(ucs))

  // WeApp
  const weapp = generateWeapp(ucs)
  fs.writeFileSync(path.join(compDir, `${componentName}.wxml`), weapp.wxml)
  fs.writeFileSync(path.join(compDir, `${componentName}.ts`), weapp.ts)

  console.log(`✅ Generated boilerplate for ${componentName} in ${compDir}`)
}

main()
