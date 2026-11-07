// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { componentNames, type ComponentName } from '@timui/core'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'
import { Alert, AlertTitle } from './alert'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'
import { Avatar, AvatarFallback } from './avatar'
import { Badge } from './badge'
import { Banner, BannerTitle } from './banner'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from './breadcrumb'
import { Button } from './button'
import { Calendar } from './calendar'
import { Card, CardTitle } from './card'
import { Checkbox } from './checkbox'
import { CheckboxTree } from './checkbox-tree'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'
import { Combobox, ComboboxInput, ComboboxLabel } from './combobox'
import { Command, CommandInput, CommandList } from './command'
import { DatePicker } from './date-picker'
import { DateField, DateInput } from './datefield'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { Form } from './form'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'
import { Cropper, CropperDescription } from './image-cropper'
import { Input } from './input'
import { Label } from './label'
import { MultipleSelector } from './multiselect'
import { Navbar, NavbarBrand } from './navbar'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from './navigation-menu'
import { Notification, NotificationTitle } from './notification'
import { NumberField, NumberFieldInput } from './number-field'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from './pagination'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Progress } from './progress'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable'
import { ScrollArea } from './scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { SelectNative } from './select-native'
import { Separator } from './separator'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './sheet'
import { Slider } from './slider'
import { Stepper, StepperItem, StepperTitle } from './stepper'
import { Switch } from './switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { TagsInput, TagsInputControl, TagsInputInput, TagsInputItem } from './tags-input'
import { Textarea } from './textarea'
import { Timeline, TimelineItem, TimelineTitle } from './timeline'
import { Toast, ToastTitle } from './toast'
import { Toggle } from './toggle'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { Tree } from './tree'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

function SaveButton() {
  const [saved, setSaved] = useState(false)
  return <Button onClick={() => setSaved(true)}>{saved ? 'Saved' : 'Save'}</Button>
}

function CheckProbe() {
  const [checked, setChecked] = useState(false)
  return (
    <Checkbox
      id="accept"
      aria-label="Accept"
      checked={checked}
      onCheckedChange={(event) => {
        const detail = (event as { detail?: { checked?: boolean } }).detail
        setChecked(detail?.checked === true)
      }}
    />
  )
}

function SwitchProbe() {
  const [checked, setChecked] = useState(false)
  return (
    <Switch
      id="alerts"
      aria-label="Alerts"
      checked={checked}
      onCheckedChange={(event) => {
        const detail = (event as { detail?: { checked?: boolean } }).detail
        setChecked(detail?.checked === true)
      }}
    />
  )
}

function TagsProbe() {
  const [tags, setTags] = useState<string[]>(['red'])
  return (
    <TagsInput
      id="tags"
      value={tags}
      aria-label="Tags"
      onValueChange={(event) => {
        const next = (event as { detail?: { value?: string[] } }).detail?.value
        if (next) setTags(next)
      }}
    >
      <TagsInputControl>
        {tags.map((tag, index) => (
          <TagsInputItem key={tag} index={index} value={tag} />
        ))}
        <TagsInputInput placeholder="Add tag" />
      </TagsInputControl>
    </TagsInput>
  )
}

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (node: ReactNode) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() => {
    root.render(node)
  })
  mounted.push({ root, host })
  return host
}

const flush = async () => {
  await act(async () => {
    await Promise.resolve()
    await Promise.resolve()
  })
}

const clickText = async (text: string) => {
  const el = [...document.querySelectorAll('button, a, [role="button"]')].find(
    (node) => node.textContent?.trim() === text
  )
  expect(el, text).toBeTruthy()
  await act(async () => {
    if (el instanceof HTMLElement) el.focus()
    el?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    ;(el as HTMLElement).click()
  })
  await flush()
}

const fixtures: Record<ComponentName, { node: ReactNode; text: string }> = {
  accordion: {
    text: 'Section',
    node: (
      <Accordion id="sections" type="single" defaultValue={['one']}>
        <AccordionItem value="one">
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent>Details</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Billing</AccordionTrigger>
          <AccordionContent>Invoice</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  alert: { text: 'Saved', node: <Alert><AlertTitle>Saved</AlertTitle></Alert> },
  'alert-dialog': {
    text: 'Open alert',
    node: (
      <AlertDialog>
        <AlertDialogTrigger>Open alert</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  avatar: { text: 'AD', node: <Avatar><AvatarFallback>AD</AvatarFallback></Avatar> },
  badge: { text: 'New', node: <Badge>New</Badge> },
  banner: { text: 'Notice', node: <Banner><BannerTitle>Notice</BannerTitle></Banner> },
  breadcrumb: {
    text: 'Home',
    node: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  },
  button: { text: 'Save', node: <SaveButton /> },
  calendar: { text: '', node: <Calendar /> },
  card: { text: 'Title', node: <Card><CardTitle>Title</CardTitle></Card> },
  checkbox: { text: '', node: <CheckProbe /> },
  'checkbox-tree': {
    text: 'Leaf',
    node: (
      <CheckboxTree
        className="tree"
        tree={{ id: 'root', label: 'Root', children: [{ id: 'leaf', label: 'Leaf' }] }}
        renderNode={({ node, children, isChecked, onCheckedChange }) => (
          <div key={node.id}>
            <button type="button" aria-pressed={isChecked === true} onClick={() => onCheckedChange()}>
              {node.label}
            </button>
            {children}
          </div>
        )}
      />
    ),
  },
  collapsible: {
    text: 'More',
    node: (
      <Collapsible>
        <CollapsibleTrigger>More</CollapsibleTrigger>
        <CollapsibleContent>Hidden</CollapsibleContent>
      </Collapsible>
    ),
  },
  combobox: {
    text: 'City',
    node: (
      <Combobox id="city">
        <ComboboxLabel>City</ComboboxLabel>
        <ComboboxInput aria-label="City" />
      </Combobox>
    ),
  },
  command: {
    text: '',
    node: (
      <Command>
        <CommandInput placeholder="Search commands" />
        <CommandList />
      </Command>
    ),
  },
  'date-picker': { text: '', node: <DatePicker /> },
  datefield: {
    text: '',
    node: (
      <DateField aria-label="Date" defaultValue="2026-02-14">
        <DateInput aria-label="Date" />
      </DateField>
    ),
  },
  dialog: {
    text: 'Open dialog',
    node: (
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog title</DialogTitle>
        </DialogContent>
      </Dialog>
    ),
  },
  form: {
    text: 'Submit',
    node: (
      <Form
        fields={[{ name: 'email', label: 'Email', rules: [{ kind: 'required', message: 'Email is required' }] }]}
        onSubmit={() => undefined}
      />
    ),
  },
  'dropdown-menu': {
    text: 'Menu',
    node: (
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  'hover-card': {
    text: 'Hover',
    node: (
      <HoverCard>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>Card</HoverCardContent>
      </HoverCard>
    ),
  },
  'image-cropper': {
    text: 'Crop photo',
    node: (
      <Cropper image="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">
        <CropperDescription>Crop photo</CropperDescription>
      </Cropper>
    ),
  },
  input: { text: '', node: <Input aria-label="Email" defaultValue="ada" /> },
  label: { text: 'Email', node: <Label htmlFor="email">Email</Label> },
  multiselect: {
    text: '',
    node: <MultipleSelector defaultOptions={[{ value: 'react', label: 'React' }]} placeholder="Pick" />,
  },
  navbar: { text: 'Timkit', node: <Navbar><NavbarBrand>Timkit</NavbarBrand></Navbar> },
  'navigation-menu': {
    text: 'Docs',
    node: (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
  },
  notification: { text: 'Saved', node: <Notification><NotificationTitle>Saved</NotificationTitle></Notification> },
  'number-field': { text: '', node: <NumberField defaultValue={2} aria-label="Count"><NumberFieldInput /></NumberField> },
  pagination: {
    text: '1',
    node: (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#1">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
  },
  popover: {
    text: 'Open popover',
    node: (
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    ),
  },
  progress: { text: '', node: <Progress value={40} aria-label="Loading" /> },
  'radio-group': {
    text: '',
    node: (
      <RadioGroup id="plan" defaultValue="a" aria-label="Plan">
        <RadioGroupItem value="a" aria-label="Plan A" />
      </RadioGroup>
    ),
  },
  resizable: {
    text: 'Left',
    node: (
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>Left</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>
    ),
  },
  'scroll-area': { text: 'Scroll', node: <ScrollArea>Scroll</ScrollArea> },
  select: {
    text: 'Choose',
    node: (
      <Select>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  'select-native': {
    text: 'Apple',
    node: (
      <SelectNative aria-label="Fruit" defaultValue="apple">
        <option value="apple">Apple</option>
      </SelectNative>
    ),
  },
  separator: { text: '', node: <Separator /> },
  sheet: {
    text: 'Open sheet',
    node: (
      <Sheet>
        <SheetTrigger>
          <button type="button">Open sheet</button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet title</SheetTitle>
        </SheetContent>
      </Sheet>
    ),
  },
  slider: { text: '', node: <Slider id="volume" defaultValue={[20]} /> },
  stepper: {
    text: 'Account',
    node: (
      <Stepper id="account" defaultValue="1">
        <StepperItem step={1}>
          <StepperTitle>Account</StepperTitle>
        </StepperItem>
      </Stepper>
    ),
  },
  switch: { text: '', node: <SwitchProbe /> },
  table: {
    text: 'Name',
    node: (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
  tabs: {
    text: 'Account',
    node: (
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="password">Password panel</TabsContent>
      </Tabs>
    ),
  },
  'tags-input': {
    text: '',
    node: (
      <TagsProbe />
    ),
  },
  textarea: { text: '', node: <Textarea aria-label="Note" defaultValue="Hello" /> },
  timeline: {
    text: 'Shipped',
    node: (
      <Timeline>
        <TimelineItem step={1}>
          <TimelineTitle>Shipped</TimelineTitle>
        </TimelineItem>
      </Timeline>
    ),
  },
  toast: { text: 'Saved', node: <Toast><ToastTitle>Saved</ToastTitle></Toast> },
  toggle: { text: 'Bold', node: <Toggle aria-label="Bold">Bold</Toggle> },
  'toggle-group': {
    text: 'Left',
    node: (
      <ToggleGroup type="single" defaultValue="left" aria-label="Align">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
      </ToggleGroup>
    ),
  },
  tooltip: {
    text: 'Tip',
    node: (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Tip</TooltipTrigger>
          <TooltipContent>Help</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  tree: { text: 'Files', node: <Tree aria-label="Files">Files</Tree> },
}

const behaviors: Record<ComponentName, () => Promise<void>> = {
  accordion: async () => {
    const contents = () => document.querySelectorAll('[data-slot="accordion-content"]')
    expect(contents()[0]?.hasAttribute('hidden')).toBe(false)
    await clickText('Billing')
    expect(contents()[0]?.hasAttribute('hidden')).toBe(true)
    expect(contents()[1]?.hasAttribute('hidden')).toBe(false)
    expect(document.body.textContent).toContain('Invoice')
  },
  alert: async () => {
    expect(document.querySelector('[role="alert"]')?.textContent).toContain('Saved')
  },
  'alert-dialog': async () => {
    await clickText('Open alert')
    expect(document.body.textContent).toContain('Confirm')
  },
  avatar: async () => {
    expect(document.querySelector('span')?.textContent).toContain('AD')
  },
  badge: async () => {
    expect(document.body.textContent).toContain('New')
  },
  banner: async () => {
    expect(document.body.textContent).toContain('Notice')
  },
  breadcrumb: async () => {
    expect(document.querySelector('nav')?.textContent).toContain('Home')
  },
  button: async () => {
    await clickText('Save')
    expect(document.body.textContent).toContain('Saved')
  },
  calendar: async () => {
    expect(document.querySelector('[data-slot="calendar"]')).toBeTruthy()
  },
  card: async () => {
    expect(document.body.textContent).toContain('Title')
  },
  checkbox: async () => {
    const box = document.querySelector('[data-slot="checkbox"]') as HTMLElement
    expect(box).toBeTruthy()
    await act(async () => {
      box.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      box.click()
    })
    await flush()
    expect(document.querySelector('[data-slot="checkbox"]')?.getAttribute('data-state')).toBe('checked')
    expect(document.querySelector('input[aria-label="Accept"]')).toBeTruthy()
  },
  'checkbox-tree': async () => {
    const leaf = [...document.querySelectorAll('button')].find((node) => node.textContent === 'Leaf')
    expect(leaf?.getAttribute('aria-pressed')).toBe('false')
    await clickText('Leaf')
    expect(leaf?.getAttribute('aria-pressed')).toBe('true')
  },
  collapsible: async () => {
    await clickText('More')
    expect(document.querySelector('[data-slot="collapsible-content"]')?.getAttribute('data-state')).toBe('open')
  },
  combobox: async () => {
    expect(document.querySelector('input[aria-label="City"]')).toBeTruthy()
  },
  command: async () => {
    expect(document.querySelector('input')?.getAttribute('placeholder')).toBe('Search commands')
  },
  'date-picker': async () => {
    expect(document.querySelector('[data-slot="date-picker"], button, input')).toBeTruthy()
  },
  datefield: async () => {
    const input = document.querySelector('input') as HTMLInputElement
    expect(input.value).toContain('2026-02-14')
  },
  dialog: async () => {
    await clickText('Open dialog')
    expect(document.body.textContent).toContain('Dialog title')
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    await flush()
    expect(document.body.textContent).not.toContain('Dialog title')
  },
  form: async () => {
    const form = document.querySelector('form')
    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(document.body.textContent).toContain('Email is required')
  },
  'dropdown-menu': async () => {
    await clickText('Menu')
    expect(document.body.textContent).toContain('Item')
  },
  'hover-card': async () => {
    await clickText('Hover')
    expect(document.body.textContent).toContain('Hover')
  },
  'image-cropper': async () => {
    expect(document.body.textContent).toContain('Crop photo')
  },
  input: async () => {
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('ada')
  },
  label: async () => {
    expect(document.querySelector('label')?.getAttribute('for')).toBe('email')
  },
  multiselect: async () => {
    expect(document.querySelector('input')?.getAttribute('placeholder')).toBe('Pick')
  },
  navbar: async () => {
    expect(document.body.textContent).toContain('Timkit')
  },
  'navigation-menu': async () => {
    expect(document.querySelector('a')?.textContent).toContain('Docs')
  },
  notification: async () => {
    expect(document.body.textContent).toContain('Saved')
  },
  'number-field': async () => {
    expect(document.querySelector('[data-slot="number-field"] input, input')).toBeTruthy()
  },
  pagination: async () => {
    expect(document.querySelector('a')?.textContent).toContain('1')
  },
  popover: async () => {
    await clickText('Open popover')
    expect(document.body.textContent).toContain('Popover body')
  },
  progress: async () => {
    expect(document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('40')
  },
  'radio-group': async () => {
    const item = document.querySelector('[aria-label="Plan A"]') as HTMLElement
    await act(async () => {
      item.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      item.click()
    })
    await flush()
    expect(item.getAttribute('data-state') === 'checked' || item.getAttribute('aria-checked') === 'true').toBe(true)
  },
  resizable: async () => {
    expect(document.body.textContent).toContain('Left')
  },
  'scroll-area': async () => {
    expect(document.body.textContent).toContain('Scroll')
  },
  select: async () => {
    await clickText('Choose')
    expect(document.body.textContent).toContain('Apple')
  },
  'select-native': async () => {
    expect((document.querySelector('select') as HTMLSelectElement).value).toBe('apple')
  },
  separator: async () => {
    expect(document.querySelector('[role="none"]')).toBeTruthy()
  },
  sheet: async () => {
    await clickText('Open sheet')
    expect(document.body.textContent).toContain('Sheet title')
  },
  slider: async () => {
    const thumb = document.querySelector('[role="slider"]') as HTMLElement
    expect(thumb).toBeTruthy()
    const before = Number(thumb.getAttribute('aria-valuenow'))
    await act(async () => {
      thumb.focus()
      thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    })
    await flush()
    expect(Number(thumb.getAttribute('aria-valuenow'))).toBeGreaterThan(before)
  },
  stepper: async () => {
    expect(document.body.textContent).toContain('Account')
  },
  switch: async () => {
    const control = document.querySelector('[data-slot="switch"]') as HTMLElement
    await act(async () => {
      control.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      control.click()
    })
    await flush()
    expect(document.querySelector('[data-slot="switch"]')?.getAttribute('data-state')).toBe('checked')
    expect(document.querySelector('input[aria-label="Alerts"]')).toBeTruthy()
  },
  table: async () => {
    expect(document.querySelector('td')?.textContent).toContain('Ada')
  },
  tabs: async () => {
    expect(document.body.textContent).toContain('Account panel')
    await clickText('Password')
    expect(document.body.textContent).toContain('Password panel')
  },
  'tags-input': async () => {
    expect(document.body.textContent).toContain('red')
  },
  textarea: async () => {
    expect((document.querySelector('textarea') as HTMLTextAreaElement).value).toBe('Hello')
  },
  timeline: async () => {
    expect(document.body.textContent).toContain('Shipped')
  },
  toast: async () => {
    expect(document.body.textContent).toContain('Saved')
  },
  toggle: async () => {
    await clickText('Bold')
    expect(document.querySelector('[aria-label="Bold"]')?.getAttribute('aria-pressed')).toBe('true')
  },
  'toggle-group': async () => {
    await clickText('Left')
    expect(document.body.textContent).toContain('Left')
  },
  tooltip: async () => {
    expect(document.body.textContent).toContain('Tip')
  },
  tree: async () => {
    expect(document.querySelector('[data-slot="tree"]')?.textContent).toContain('Files')
  },
}

describe('every named component', () => {
  it('covers the full component list', () => {
    expect(Object.keys(fixtures).sort()).toEqual([...componentNames].sort())
    expect(Object.keys(behaviors).sort()).toEqual([...componentNames].sort())
  })

  it.each(componentNames)('%s renders and completes its primary behavior', async (name) => {
    const fixture = fixtures[name]
    const host = show(fixture.node)
    await flush()
    if (fixture.text) expect(host.textContent).toContain(fixture.text)
    else expect(host.querySelector('[data-slot], [role], button, input, select, textarea, nav')).toBeTruthy()
    await behaviors[name]()
  })
})
