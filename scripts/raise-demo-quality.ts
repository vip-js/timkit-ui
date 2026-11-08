import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')

const compatibilityAliases: Record<string, string> = {
  datefield: 'date-field',
  'datefield-rac': 'date-field',
  'calendar-rac': 'calendar',
  sonner: 'toast',
  'multiple-selector': 'multiselect',
  'image-cropper': 'cropper',
}

const describeRegistryItem = (name: string, type?: string, group?: string) => {
  const label = name.replace(/[-_]/g, ' ')
  const alias = compatibilityAliases[name]
  if (alias) return `${label} is a compatibility alias. Prefer ${alias}.`
  if (type === 'registry:ui') {
    return `${label} primitive with one recommended entry. Read /agent/${name}.json before writing code.`
  }
  if (type === 'registry:component' || type === 'registry:block' || type === 'registry:page') {
    return `${label} demo for ${group || label}. Copy the composition, then wire state in the app.`
  }
  return `${label} registry item.`
}
const DEMO_ROOT = path.join(ROOT, 'apps/docs/registry/default/components')
const INDEX_PATH = path.join(ROOT, 'apps/docs/data/registry-index.json')

type TagSpec = { tag: string; attrs?: string; className?: string; void?: boolean }

const buttonClass =
  'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'
const inputClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm'
const cardClass = 'rounded-xl border bg-card text-card-foreground'

const TAGS: Record<string, TagSpec> = {
  Button: { tag: 'button', attrs: 'type="button" data-slot="button"', className: buttonClass },
  Input: { tag: 'input', attrs: 'data-slot="input"', className: inputClass, void: true },
  Textarea: { tag: 'textarea', attrs: 'data-slot="textarea"', className: inputClass },
  Label: { tag: 'label', attrs: 'data-slot="label"' },
  Checkbox: { tag: 'input', attrs: 'type="checkbox" data-slot="checkbox"', void: true },
  Switch: { tag: 'input', attrs: 'type="checkbox" role="switch" data-slot="switch"', void: true },
  Slider: { tag: 'input', attrs: 'type="range" data-slot="slider"', void: true },
  RadioGroup: { tag: 'div', attrs: 'role="radiogroup" data-slot="radio-group"' },
  RadioGroupItem: { tag: 'input', attrs: 'type="radio" data-slot="radio-group-item"', void: true },
  Accordion: { tag: 'div', attrs: 'data-slot="accordion"' },
  AccordionItem: { tag: 'details', attrs: 'data-slot="accordion-item" open' },
  AccordionTrigger: { tag: 'summary', attrs: 'data-slot="accordion-trigger"' },
  AccordionContent: { tag: 'div', attrs: 'data-slot="accordion-content"' },
  Dialog: { tag: 'dialog', attrs: 'open data-slot="dialog"' },
  DialogTrigger: { tag: 'button', attrs: 'type="button" data-slot="dialog-trigger"', className: buttonClass },
  DialogContent: { tag: 'div', attrs: 'data-slot="dialog-content"' },
  DialogHeader: { tag: 'header', attrs: 'data-slot="dialog-header"' },
  DialogTitle: { tag: 'h2', attrs: 'data-slot="dialog-title"' },
  DialogDescription: { tag: 'p', attrs: 'data-slot="dialog-description"' },
  DialogFooter: { tag: 'footer', attrs: 'data-slot="dialog-footer"' },
  AlertDialog: { tag: 'dialog', attrs: 'open role="alertdialog"' },
  AlertDialogTrigger: { tag: 'button', attrs: 'type="button"', className: buttonClass },
  AlertDialogContent: { tag: 'div' },
  AlertDialogHeader: { tag: 'header' },
  AlertDialogTitle: { tag: 'h2' },
  AlertDialogDescription: { tag: 'p' },
  AlertDialogFooter: { tag: 'footer' },
  AlertDialogAction: { tag: 'button', attrs: 'type="button"', className: buttonClass },
  AlertDialogCancel: { tag: 'button', attrs: 'type="button"' },
  Card: { tag: 'section', attrs: 'data-slot="card"', className: cardClass },
  CardHeader: { tag: 'header', attrs: 'data-slot="card-header"' },
  CardTitle: { tag: 'h3', attrs: 'data-slot="card-title"' },
  CardDescription: { tag: 'p', attrs: 'data-slot="card-description"' },
  CardContent: { tag: 'div', attrs: 'data-slot="card-content"' },
  CardFooter: { tag: 'footer', attrs: 'data-slot="card-footer"' },
  Badge: { tag: 'span', attrs: 'data-slot="badge"' },
  Avatar: { tag: 'span', attrs: 'data-slot="avatar"' },
  AvatarImage: { tag: 'img', attrs: 'alt="" data-slot="avatar-image"', void: true },
  AvatarFallback: { tag: 'span', attrs: 'data-slot="avatar-fallback"' },
  Tabs: { tag: 'div', attrs: 'data-slot="tabs"' },
  TabsList: { tag: 'div', attrs: 'role="tablist" data-slot="tabs-list"' },
  TabsTrigger: { tag: 'button', attrs: 'type="button" role="tab" data-slot="tabs-trigger"' },
  TabsContent: { tag: 'div', attrs: 'role="tabpanel" data-slot="tabs-content"' },
  Select: { tag: 'select', attrs: 'data-slot="select"' },
  SelectTrigger: { tag: 'button', attrs: 'type="button" data-slot="select-trigger"' },
  SelectValue: { tag: 'span', attrs: 'data-slot="select-value"' },
  SelectContent: { tag: 'div', attrs: 'data-slot="select-content"' },
  SelectItem: { tag: 'option', attrs: 'data-slot="select-item"' },
  SelectGroup: { tag: 'optgroup' },
  SelectLabel: { tag: 'label' },
  Table: { tag: 'table', attrs: 'data-slot="table"' },
  TableHeader: { tag: 'thead' },
  TableBody: { tag: 'tbody' },
  TableFooter: { tag: 'tfoot' },
  TableRow: { tag: 'tr' },
  TableHead: { tag: 'th' },
  TableCell: { tag: 'td' },
  TableCaption: { tag: 'caption' },
  Alert: { tag: 'div', attrs: 'role="alert" data-slot="alert"' },
  AlertTitle: { tag: 'h5', attrs: 'data-slot="alert-title"' },
  AlertDescription: { tag: 'p', attrs: 'data-slot="alert-description"' },
  Separator: { tag: 'hr', attrs: 'data-slot="separator"', void: true },
  Progress: { tag: 'progress', attrs: 'data-slot="progress"' },
  Tooltip: { tag: 'span', attrs: 'data-slot="tooltip"' },
  TooltipTrigger: { tag: 'button', attrs: 'type="button" data-slot="tooltip-trigger"' },
  TooltipContent: { tag: 'span', attrs: 'role="tooltip" data-slot="tooltip-content"' },
  Popover: { tag: 'div', attrs: 'data-slot="popover"' },
  PopoverTrigger: { tag: 'button', attrs: 'type="button" data-slot="popover-trigger"' },
  PopoverContent: { tag: 'div', attrs: 'data-slot="popover-content"' },
  HoverCard: { tag: 'span' },
  HoverCardTrigger: { tag: 'button', attrs: 'type="button"' },
  HoverCardContent: { tag: 'div' },
  Sheet: { tag: 'dialog', attrs: 'open data-slot="sheet"' },
  SheetTrigger: { tag: 'button', attrs: 'type="button"', className: buttonClass },
  SheetContent: { tag: 'div', attrs: 'data-slot="sheet-content"' },
  SheetHeader: { tag: 'header' },
  SheetTitle: { tag: 'h2' },
  SheetDescription: { tag: 'p' },
  SheetFooter: { tag: 'footer' },
  SheetClose: { tag: 'button', attrs: 'type="button"' },
  DropdownMenu: { tag: 'div', attrs: 'data-slot="dropdown-menu"' },
  DropdownMenuTrigger: { tag: 'button', attrs: 'type="button" aria-haspopup="menu"' },
  DropdownMenuContent: { tag: 'div', attrs: 'role="menu"' },
  DropdownMenuItem: { tag: 'button', attrs: 'type="button" role="menuitem"' },
  DropdownMenuLabel: { tag: 'div' },
  DropdownMenuSeparator: { tag: 'hr', void: true },
  DropdownMenuGroup: { tag: 'div', attrs: 'role="group"' },
  DropdownMenuShortcut: { tag: 'span' },
  Collapsible: { tag: 'details', attrs: 'open data-slot="collapsible"' },
  CollapsibleTrigger: { tag: 'summary' },
  CollapsibleContent: { tag: 'div' },
  Breadcrumb: { tag: 'nav', attrs: 'aria-label="Breadcrumb"' },
  BreadcrumbList: { tag: 'ol' },
  BreadcrumbItem: { tag: 'li' },
  BreadcrumbLink: { tag: 'a', attrs: 'href="#"' },
  BreadcrumbPage: { tag: 'span', attrs: 'aria-current="page"' },
  BreadcrumbSeparator: { tag: 'li', attrs: 'aria-hidden="true"' },
  BreadcrumbEllipsis: { tag: 'li', attrs: 'aria-hidden="true"' },
  Pagination: { tag: 'nav', attrs: 'aria-label="Pagination"' },
  PaginationContent: { tag: 'ul' },
  PaginationItem: { tag: 'li' },
  PaginationLink: { tag: 'a', attrs: 'href="#"' },
  PaginationPrevious: { tag: 'a', attrs: 'href="#" rel="prev"' },
  PaginationNext: { tag: 'a', attrs: 'href="#" rel="next"' },
  NavigationMenu: { tag: 'nav', attrs: 'aria-label="Main"' },
  NavigationMenuList: { tag: 'ul' },
  NavigationMenuItem: { tag: 'li' },
  NavigationMenuTrigger: { tag: 'button', attrs: 'type="button"' },
  NavigationMenuContent: { tag: 'div' },
  NavigationMenuLink: { tag: 'a', attrs: 'href="#"' },
  Navbar: { tag: 'nav', attrs: 'aria-label="Main"' },
  NavbarBrand: { tag: 'a', attrs: 'href="#"' },
  NavbarContent: { tag: 'div' },
  NavbarItem: { tag: 'a', attrs: 'href="#"' },
  Command: { tag: 'div', attrs: 'role="listbox"' },
  CommandInput: { tag: 'input', attrs: 'type="search"', className: inputClass, void: true },
  CommandList: { tag: 'ul' },
  CommandEmpty: { tag: 'p' },
  CommandGroup: { tag: 'li' },
  CommandItem: { tag: 'button', attrs: 'type="button" role="option"' },
  CommandSeparator: { tag: 'hr', void: true },
  Toggle: { tag: 'button', attrs: 'type="button" aria-pressed="false"', className: buttonClass },
  ToggleGroup: { tag: 'div', attrs: 'role="group"' },
  ToggleGroupItem: { tag: 'button', attrs: 'type="button"' },
  Banner: { tag: 'div', attrs: 'role="status"' },
  BannerTitle: { tag: 'h3' },
  BannerDescription: { tag: 'p' },
  Notification: { tag: 'div', attrs: 'role="status"' },
  NotificationTitle: { tag: 'h3' },
  NotificationDescription: { tag: 'p' },
  Timeline: { tag: 'ol' },
  TimelineItem: { tag: 'li' },
  TimelineTitle: { tag: 'h3' },
  TimelineDescription: { tag: 'p' },
  Stepper: { tag: 'div', attrs: 'role="group" aria-label="Stepper"' },
  Skeleton: { tag: 'div', attrs: 'aria-hidden="true"' },
  ScrollArea: { tag: 'div' },
  ResizablePanelGroup: { tag: 'div' },
  ResizablePanel: { tag: 'div' },
  ResizableHandle: { tag: 'div', attrs: 'role="separator"' },
}

const walk = (dir: string, acc: string[] = []): string[] => {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else acc.push(full)
  }
  return acc
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const escapeText = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const findTagEnd = (html: string, start: number) => {
  let quote = ''
  for (let i = start; i < html.length; i++) {
    const char = html[i]
    if (quote) {
      if (char === quote) quote = ''
    } else if (char === '"' || char === "'") quote = char
    else if (char === '>') return i
  }
  return -1
}

const findMatchingClose = (html: string, from: number, tag: string) => {
  let depth = 1
  let index = from
  while (index < html.length) {
    const nextOpen = html.indexOf(`<${tag}`, index)
    const nextClose = html.indexOf(`</${tag}`, index)
    if (nextClose < 0) return null
    if (nextOpen >= 0 && nextOpen < nextClose) {
      const end = findTagEnd(html, nextOpen)
      const token = end > nextOpen ? html.slice(nextOpen, end + 1) : ''
      if (new RegExp(`^<${tag}\\b`).test(token) && !/\/\s*>$/.test(token)) depth += 1
      index = (end >= 0 ? end : nextOpen) + 1
      continue
    }
    depth -= 1
    const end = findTagEnd(html, nextClose)
    if (depth === 0 && end >= 0) return { start: nextClose, end }
    index = (end >= 0 ? end : nextClose) + 1
  }
  return null
}

const extractData = (script: string): Record<string, unknown> => {
  let code = script
    .replace(/import[\s\S]*?from\s*['"][^'"]+['"]\s*;?/g, '')
    .replace(/import\s*['"][^'"]+['"]\s*;?/g, '')
    .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '')
    .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
  code = code.replace(/((?:const|let)\s+\w+)\s*:\s*[^=]+=/g, '$1 =')
  const names = [...code.matchAll(/\b(?:const|let)\s+([A-Za-z_]\w*)\s*=/g)].map((match) => match[1])
  if (!names.length) return {}
  try {
    return new Function(
      `"use strict";
      const ref = (value) => value
      const computed = (fn) => fn()
      const reactive = (value) => value
      const watch = () => {}
      const onMounted = () => {}
      ${code}
      return { ${names.join(', ')} };`
    )() as Record<string, unknown>
  } catch {
    return {}
  }
}

const readPath = (source: unknown, pathExpr: string): unknown => {
  const parts = pathExpr.split('.')
  let current = source
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as object)) {
      current = (current as Record<string, unknown>)[part]
    } else return undefined
  }
  return current
}

const evalExpr = (
  expr: string,
  item: unknown,
  index: number,
  data: Record<string, unknown>
): unknown => {
  const trimmed = expr.trim()
  const literal = trimmed.match(/^(['"`])([\s\S]*)\1$/)
  if (literal) return literal[2]
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'index') return index + 1
  if (/^\d+(\.\d+)?$/.test(trimmed)) return trimmed
  if (trimmed.startsWith('item.')) return readPath(item, trimmed.slice(5))
  if (trimmed === 'item') return item
  if (trimmed in data) return data[trimmed]
  const field = trimmed.match(/^(?:item\.)?([A-Za-z_]\w*)$/)
  if (field && item && typeof item === 'object' && field[1] in (item as object)) {
    return (item as Record<string, unknown>)[field[1]]
  }
  return undefined
}

const bindDynamicAttrs = (openTag: string, item: unknown, index: number, data: Record<string, unknown>) =>
  openTag.replace(/\s+:([\w:-]+)="([^"]*)"/g, (_full, name: string, expr: string) => {
    if (name === 'key' || name === 'class' || name.startsWith('on')) return ''
    const value = evalExpr(expr, item, index, data)
    if (value == null || value === false) return ''
    const htmlName = name === 'html-for' || name === 'htmlFor' ? 'for' : name
    if (value === true) return ` ${htmlName}`
    return ` ${htmlName}="${escapeAttr(String(value))}"`
  })

const substitute = (source: string, item: unknown, index: number, data: Record<string, unknown>) =>
  source.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_full, expr: string) => {
    const value = evalExpr(expr, item, index, data)
    return value == null ? '' : escapeText(String(value))
  })

const expandVFor = (html: string, data: Record<string, unknown>) => {
  let guard = 0
  while (guard++ < 40) {
    const match = /<([A-Za-z][\w.-]*)\b[^>]*\sv-for="([^"]+)"/.exec(html)
    if (!match || match.index == null) break
    const tag = match[1]
    const openStart = match.index
    const openEnd = findTagEnd(html, openStart)
    if (openEnd < 0) break
    const open = html.slice(openStart, openEnd + 1)
    const selfClosing = /\/\s*>$/.test(open)
    let inner = ''
    let closeEnd = openEnd
    if (!selfClosing) {
      const found = findMatchingClose(html, openEnd + 1, tag)
      if (!found) break
      inner = html.slice(openEnd + 1, found.start)
      closeEnd = found.end
    }
    const listName = match[2].match(/\bin\s+([A-Za-z_]\w*)/)?.[1]
    const rawList = listName ? data[listName] : undefined
    const list = Array.isArray(rawList)
      ? rawList
      : rawList && typeof rawList === 'object' && Array.isArray((rawList as { value?: unknown }).value)
        ? ((rawList as { value: unknown[] }).value)
        : [{ id: '1', title: 'Example', label: 'Example', name: 'Example', content: 'Example content' }]
    const rendered = list.slice(0, 6).map((item, index) => {
      let nextOpen = open.replace(/\s+v-for="[^"]*"/, '').replace(/\s+:key="[^"]*"/, '')
      nextOpen = bindDynamicAttrs(nextOpen, item, index, data)
      const body = substitute(bindDynamicAttrs(inner, item, index, data), item, index, data)
      if (selfClosing) return nextOpen
      return `${nextOpen}${body}</${tag}>`
    })
    html = html.slice(0, openStart) + rendered.join('\n') + html.slice(closeEnd + 1)
  }
  return html
}

const specFor = (name: string, selfClosing: boolean): TagSpec => {
  if (TAGS[name]) return TAGS[name]
  const slot = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  if (selfClosing || /Icon$/.test(name) || /^(Chevron|Check|X|Plus|Minus|Search|Menu|Circle|Dot)/.test(name)) {
    return { tag: 'span', attrs: 'aria-hidden="true"', void: true }
  }
  return { tag: 'div', attrs: `data-slot="${slot}"` }
}

const mergeClass = (attrs: string, className?: string) => {
  if (!className) return ''
  const existing = attrs.match(/\sclass="([^"]*)"/)
  const value = existing ? `${existing[1]} ${className}` : className
  return ` class="${value}"`
}

const stripVueAttrs = (attrs: string) =>
  attrs
    .replace(/\sclass="[^"]*"/g, '')
    .replace(/\s(?:v-[\w:.-]+|:[\w:.-]+|@[\w:.-]+)(?:="[^"]*"|='[^']*')?/g, '')
    .replace(/\s+\/\s*$/g, '')

const rewriteTags = (html: string) =>
  html.replace(/<(\/?)([A-Z][A-Za-z0-9]*)\b([^>]*)>/g, (full, slash: string, name: string, attrs: string) => {
    const selfClosing = /\/\s*$/.test(attrs)
    const spec = specFor(name, selfClosing || slash === '/')
    if (slash) return spec.void ? '' : `</${spec.tag}>`
    const cleaned = stripVueAttrs(attrs).replace(/\shtml-for=/g, ' for=').replace(/\shtmlFor=/g, ' for=')
    const open = `<${spec.tag}${spec.attrs ? ` ${spec.attrs}` : ''}${mergeClass(attrs, spec.className)}${cleaned}>`
    if (spec.void) return open
    if (selfClosing) return `${open.slice(0, -1)}></${spec.tag}>`
    return open
  })

const vueToHtml = (vueSource: string) => {
  const script = vueSource.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] || ''
  const template = vueSource.match(/<template[^>]*>([\s\S]*?)<\/template>/)?.[1] || vueSource
  const data = extractData(script)
  let html = expandVFor(template.trim(), data)
  html = bindDynamicAttrs(html, undefined, 0, data)
  html = substitute(html, undefined, 0, data)
  html = rewriteTags(html)
  html = html
    .replace(/\s(?:v-[\w:.-]+|:[\w:.-]+|@[\w:.-]+)(?:="[^"]*"|='[^']*')?/g, '')
    .replace(/\{\{[\s\S]*?\}\}/g, '')
    .replace(/\$\{[^}]+\}/g, 'Example')
    .replace(/\s(?:collapsible|as-child|asChild|default-value|defaultValue)(?:="[^"]*")?/g, '')
    .replace(/\stype="(?:single|multiple)"/g, '')
    .replace(/\s+\/?>/g, (token) => (token.includes('/') ? ' />' : '>'))
  return `<div class="timui-html-demo space-y-4 p-4">\n${html.trim()}\n</div>\n`
}

const HTML_TO_WXML: Record<string, string> = {
  div: 'view',
  section: 'view',
  header: 'view',
  footer: 'view',
  nav: 'view',
  main: 'view',
  ul: 'view',
  ol: 'view',
  li: 'view',
  details: 'view',
  summary: 'view',
  dialog: 'view',
  span: 'text',
  p: 'text',
  h1: 'text',
  h2: 'text',
  h3: 'text',
  h4: 'text',
  h5: 'text',
  h6: 'text',
  label: 'text',
  a: 'navigator',
  caption: 'text',
  option: 'view',
  optgroup: 'view',
  table: 'view',
  thead: 'view',
  tbody: 'view',
  tfoot: 'view',
  tr: 'view',
  th: 'text',
  td: 'text',
  progress: 'progress',
  hr: 'view',
}

const htmlToWxml = (html: string) => {
  const withoutSvg = html.replace(/<svg[\s\S]*?<\/svg>/g, '')
  const converted = withoutSvg.replace(
    /<(\/?)([a-z][\w-]*)\b([^>]*)>/g,
    (_full, slash: string, tag: string, attrs: string) => {
      const next = HTML_TO_WXML[tag] || tag
      const cleaned = attrs
        .replace(/\sopen\b/g, '')
        .replace(/\sclassName=/g, ' class=')
        .replace(/\s+\/\s*$/g, '')
      return `<${slash}${next}${cleaned}>`
    }
  )
  return converted
    .replace(/<(\/?)template\b[^>]*>/g, '<$1view>')
    .replace(/<script[\s\S]*?<\/script>/g, '')
}

const ensureImport = (source: string, statement: string) => {
  if (source.includes(statement)) return source
  const match = source.match(/^(?:import[\s\S]*?\n)+/)
  if (!match) return `${statement}\n${source}`
  return `${match[0]}${statement}\n${source.slice(match[0].length)}`
}

const injectReactInteraction = (source: string) => {
  if (
    /useState|onClick=|onValueChange=|onCheckedChange=|onChange=|defaultValue=|defaultChecked=|onPressedChange=|onSelect=/.test(
      source
    )
  ) {
    return source
  }
  const candidates: Array<{ tag: string; kind: 'click' | 'text' | 'check' }> = [
    { tag: 'Input', kind: 'text' },
    { tag: 'Textarea', kind: 'text' },
    { tag: 'SelectNative', kind: 'text' },
    { tag: 'Checkbox', kind: 'check' },
    { tag: 'Switch', kind: 'check' },
    { tag: 'Button', kind: 'click' },
    { tag: 'DropdownMenuItem', kind: 'click' },
    { tag: 'Toggle', kind: 'click' },
    { tag: 'TabsTrigger', kind: 'click' },
    { tag: 'Badge', kind: 'click' },
    { tag: 'PaginationLink', kind: 'click' },
    { tag: 'Alert', kind: 'click' },
    { tag: 'Avatar', kind: 'click' },
    { tag: 'BreadcrumbLink', kind: 'click' },
    { tag: 'Banner', kind: 'click' },
    { tag: 'SelectTrigger', kind: 'click' },
    { tag: 'HoverCardTrigger', kind: 'click' },
    { tag: 'TableRow', kind: 'click' },
  ]
  let chosen: { tag: string; kind: 'click' | 'text' | 'check'; index: number } | undefined
  for (const candidate of candidates) {
    const index = source.search(new RegExp(`<${candidate.tag}\\b`))
    if (index >= 0 && (!chosen || index < chosen.index)) chosen = { ...candidate, index }
  }
  if (!chosen) return source
  const tag = chosen.tag
  const kind = chosen.kind
  let next = ensureImport(source, "import { useState } from 'react'")
  const state =
    kind === 'text'
      ? 'const [demoValue, setDemoValue] = useState("")'
      : kind === 'check'
        ? 'const [demoChecked, setDemoChecked] = useState(false)'
        : 'const [demoClicks, setDemoClicks] = useState(0)'
  const attr =
    kind === 'text'
      ? 'value={demoValue} onChange={(event) => setDemoValue(event.target.value)}'
      : kind === 'check'
        ? 'checked={demoChecked} onCheckedChange={(checked) => setDemoChecked(checked === true)}'
        : 'onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks}'
  next = next.replace(
    /export default function Component\([^)]*\)\s*\{/,
    (header) => `${header}\n  ${state}`
  )
  if (!next.includes(state)) return source
  return next.replace(new RegExp(`<${tag}\\b`), `<${tag} ${attr}`)
}

const injectVueInteraction = (source: string) => {
  const normalized = source
    .replace(/\s+@(click|input)="onDemoClick"/g, '')
    .replace(
      /\nconst demoClicks = ref\(0\)\nfunction onDemoClick\(\) \{\n  demoClicks\.value \+= 1\n\}\n?/g,
      '\n'
    )
  source = normalized
  if (/@click|@input|v-model|@change|@update:/.test(source)) return source
  const templateMatch = source.match(/<template\b[^>]*>([\s\S]*?)<\/template>/)
  if (!templateMatch) return source
  const template = templateMatch[1]
  const tag = template.match(
    /<(Button|Input|Textarea|Checkbox|Switch|Alert|Avatar|Badge|SelectNative|TabsTrigger|DropdownMenuItem|Banner|SelectTrigger)\b/
  )?.[1]
  const fallback = template.match(/<([A-Z][A-Za-z0-9]*)\b/)?.[1]
  const target = tag || fallback
  if (!target) return source
  let next = source
  if (!next.includes('onDemoClick')) {
    if (!next.includes('<script')) {
      next = `<script setup lang="ts">\nimport { ref } from 'vue'\nconst demoClicks = ref(0)\nfunction onDemoClick() {\n  demoClicks.value += 1\n}\n</script>\n\n${next}`
    } else {
      if (!/import\s*\{[^}]*\bref\b/.test(next) && !/\bref\(/.test(next)) {
        next = next.replace(/<script setup lang="ts">/, `<script setup lang="ts">\nimport { ref } from 'vue'`)
      } else if (!/import\s*\{[^}]*\bref\b/.test(next)) {
        next = next.replace(/<script setup lang="ts">/, `<script setup lang="ts">\nimport { ref } from 'vue'`)
      }
      next = next.replace(
        /<script setup lang="ts">([\s\S]*?)<\/script>/,
        (_full, body: string) =>
          `<script setup lang="ts">${body}\nconst demoClicks = ref(0)\nfunction onDemoClick() {\n  demoClicks.value += 1\n}\n</script>`
      )
    }
  }
  const replaceInTemplate = (content: string, attribute: string) => {
    const match = content.match(/<template\b[^>]*>([\s\S]*?)<\/template>/)
    if (!match) return content
    const updatedTemplate = match[1].replace(`<${target}`, `<${target} ${attribute}`)
    return content.replace(match[1], updatedTemplate)
  }
  if (target === 'Input' || target === 'Textarea' || target === 'SelectNative') {
    return replaceInTemplate(next, '@input="onDemoClick"')
  }
  return replaceInTemplate(next, '@click="onDemoClick"')
}

const writeAgentDemos = () => {
  const dir = path.join(DEMO_ROOT, 'agent-workbench')
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(
    path.join(dir, 'agent-workbench-01.tsx'),
    `'use client'

import { useState } from 'react'
import { AgentMessage, ApprovalCard } from '@timui/react/agent'

export default function Component() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  return (
    <div className="space-y-3">
      <AgentMessage role="user">Refund order 1842.</AgentMessage>
      <ApprovalCard
        title="Refund 48 dollars"
        description="Wait for a person before sending the refund."
        status={status}
        onApprove={() => setStatus('approved')}
        onReject={() => setStatus('rejected')}
      />
    </div>
  )
}
`
  )
  fs.writeFileSync(
    path.join(dir, 'agent-workbench-01.vue'),
    `<script setup lang="ts">
import { ref } from 'vue'
const status = ref<'pending' | 'approved' | 'rejected'>('pending')
</script>

<template>
  <div class="space-y-3">
    <article data-slot="agent-message" data-role="user" class="rounded-lg border px-3 py-2 text-sm">
      <p class="text-xs font-medium">You</p>
      <p>Refund order 1842.</p>
    </article>
    <section data-slot="approval-card" :data-status="status" class="grid gap-3 rounded-lg border p-3 text-sm">
      <div class="grid gap-1">
        <h3 class="font-medium leading-6">Refund 48 dollars</h3>
        <p class="leading-6 text-muted-foreground">Wait for a person before sending the refund.</p>
      </div>
      <div v-if="status === 'pending'" class="flex flex-wrap gap-2" role="group" aria-label="Approval actions">
        <button type="button" class="min-h-11 rounded-lg border px-4 font-medium" @click="status = 'rejected'">Reject</button>
        <button type="button" class="min-h-11 rounded-lg bg-primary px-4 font-medium text-primary-foreground" @click="status = 'approved'">Approve</button>
      </div>
      <p v-else aria-live="polite" class="text-xs font-medium">Receipt: {{ status === 'approved' ? 'Approved' : 'Rejected' }}</p>
    </section>
  </div>
</template>
`
  )
  fs.writeFileSync(
    path.join(dir, 'agent-workbench-01.html'),
    `<div class="timui-html-demo space-y-3 p-4">
  <p>Refund order 1842.</p>
  <section aria-labelledby="refund-title">
    <h2 id="refund-title">Refund 48 dollars</h2>
    <p>Wait for a person before sending the refund.</p>
    <button type="button" id="approve">Approve</button>
    <button type="button" id="reject">Reject</button>
    <p id="receipt" role="status"></p>
  </section>
  <script>
    const receipt = document.getElementById('receipt')
    document.getElementById('approve').addEventListener('click', () => {
      receipt.textContent = 'Receipt: Approved'
    })
    document.getElementById('reject').addEventListener('click', () => {
      receipt.textContent = 'Receipt: Rejected'
    })
  </script>
</div>
`
  )
  fs.writeFileSync(
    path.join(dir, 'agent-workbench-01.wxml'),
    `<view class="timui-demo">
  <text>Refund order 1842.</text>
  <view>
    <text>Refund 48 dollars</text>
    <text>Wait for a person before sending the refund.</text>
    <button bindtap="onApprove">Approve</button>
    <button bindtap="onReject">Reject</button>
    <text>{{receipt}}</text>
  </view>
</view>
`
  )
  fs.writeFileSync(
    path.join(dir, 'agent-workbench-01.js'),
    `Component({
  data: { receipt: '' },
  onApprove() {
    this.setData({ receipt: 'Receipt: Approved' })
  },
  onReject() {
    this.setData({ receipt: 'Receipt: Rejected' })
  },
})
`
  )
}

const patchIndex = () => {
  const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8')) as {
    items: Array<Record<string, unknown>>
  }
  for (const item of index.items) {
    const name = String(item.name || '')
    const type = typeof item.type === 'string' ? item.type : undefined
    const group =
      item.meta && typeof item.meta === 'object'
        ? String((item.meta as { demoCanonical?: { group?: string } }).demoCanonical?.group || '')
        : ''
    if (!item.description) item.description = describeRegistryItem(name, type, group || undefined)
  }
  if (!index.items.some((item) => item.name === 'agent-workbench-01')) {
    index.items.push({
      name: 'agent-workbench-01',
      type: 'registry:component',
      description: describeRegistryItem('agent-workbench-01', 'registry:component', 'agent-workbench'),
      registryDependencies: ['https://ui.timkit.cn/r/button.json'],
      meta: {
        tags: ['agent', 'approval'],
        frameworks: ['react', 'vue', 'html', 'weapp'],
        demoCanonical: {
          componentName: 'agent-workbench-01',
          group: 'agent-workbench',
          frameworks: {
            react: {
              sourceFramework: 'react',
              sourceMode: 'exact',
              matchedName: 'agent-workbench-01',
              path: 'registry/default/components/agent-workbench/agent-workbench-01.tsx',
            },
            vue: {
              sourceFramework: 'vue',
              sourceMode: 'exact',
              matchedName: 'agent-workbench-01',
              path: 'registry/default/components/agent-workbench/agent-workbench-01.vue',
            },
            html: {
              sourceFramework: 'html',
              sourceMode: 'exact',
              matchedName: 'agent-workbench-01',
              path: 'registry/default/components/agent-workbench/agent-workbench-01.html',
            },
            weapp: {
              sourceFramework: 'weapp',
              sourceMode: 'exact',
              matchedName: 'agent-workbench-01',
              path: 'registry/default/components/agent-workbench/agent-workbench-01.wxml',
            },
          },
        },
      },
      files: [
        {
          path: 'registry/default/components/agent-workbench/agent-workbench-01.tsx',
          type: 'registry:component',
        },
        {
          path: 'registry/default/components/agent-workbench/agent-workbench-01.vue',
          type: 'registry:component',
        },
        {
          path: 'registry/default/components/agent-workbench/agent-workbench-01.html',
          type: 'registry:component',
        },
        {
          path: 'registry/default/components/agent-workbench/agent-workbench-01.wxml',
          type: 'registry:component',
        },
      ],
    })
  }
  fs.writeFileSync(INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`)
}

const main = () => {
  const vueFiles = walk(DEMO_ROOT).filter((file) => file.endsWith('.vue'))
  for (const file of vueFiles) {
    const source = fs.readFileSync(file, 'utf8')
    const interactive = injectVueInteraction(source)
    if (interactive !== source) fs.writeFileSync(file, interactive)
    const html = vueToHtml(interactive)
    const target = file.replace(/\.vue$/, '')
    fs.writeFileSync(`${target}.html`, html)
    fs.writeFileSync(`${target}.wxml`, htmlToWxml(html))
  }
  const reactFiles = walk(DEMO_ROOT).filter((file) => file.endsWith('.tsx'))
  for (const file of reactFiles) {
    const source = fs.readFileSync(file, 'utf8')
    const next = injectReactInteraction(source)
    if (next !== source) fs.writeFileSync(file, next)
  }
  writeAgentDemos()
  patchIndex()
  console.log(`Rewrote ${vueFiles.length} HTML/WXML demos and patched registry descriptions.`)
}

main()
