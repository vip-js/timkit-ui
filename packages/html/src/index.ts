import { getHtmlCapabilityLevel, htmlAdapterTemplateNames } from './capabilities'
import { initAccordion } from './components/accordion.adapter'
import { initCollapsible } from './components/collapsible.adapter'
import { initDropdownMenu } from './components/dropdown-menu.adapter'
import { initHoverCard } from './components/hover-card.adapter'
import { initNavigationMenu } from './components/navigation-menu.adapter'
import { initPopover } from './components/popover.adapter'
import { initSheet } from './components/sheet.adapter'
import { initSwitch } from './components/switch.adapter'
import { initTabs } from './components/tabs.adapter'
import { initToast } from './components/toast.adapter'
import { initToggleGroup } from './components/toggle-group.adapter'
import { initToggle } from './components/toggle.adapter'
import { initTooltip } from './components/tooltip.adapter'
import {
  getHtmlInitializerName,
  HTML_RUNTIME_AUTO_ATTRIBUTE,
  HTML_RUNTIME_AUTO_VALUE,
  HTML_RUNTIME_ROOT_ATTRIBUTE,
  htmlRuntimeSelectorByName,
} from './runtime-metadata'
import { createHtmlRuntime } from './runtime-protocol'

const htmlRuntimeCapabilities = htmlAdapterTemplateNames.map((name) => ({
  name,
  level: getHtmlCapabilityLevel(name),
  selector: htmlRuntimeSelectorByName[name],
  initializer: getHtmlInitializerName(name),
}))

const runtime = createHtmlRuntime({
  capabilities: htmlRuntimeCapabilities,
  initializers: {
    accordion: initAccordion,
    collapsible: initCollapsible,
    'dropdown-menu': initDropdownMenu,
    'hover-card': initHoverCard,
    'navigation-menu': initNavigationMenu,
    popover: initPopover,
    sheet: initSheet,
    switch: initSwitch,
    tabs: initTabs,
    toast: initToast,
    toggle: initToggle,
    'toggle-group': initToggleGroup,
    tooltip: initTooltip,
  },
  protocol: {
    rootAttribute: HTML_RUNTIME_ROOT_ATTRIBUTE,
    autoAttribute: HTML_RUNTIME_AUTO_ATTRIBUTE,
    autoValue: HTML_RUNTIME_AUTO_VALUE,
  },
})

export { HTML_RUNTIME_ROOT_ATTRIBUTE, HTML_RUNTIME_AUTO_ATTRIBUTE, HTML_RUNTIME_AUTO_VALUE }
export { htmlRuntimeCapabilities }
export const htmlRuntimeComponentNames = runtime.componentNames
export const initHtmlComponent = runtime.initHtmlComponent
export const initHtmlRuntime = runtime.initHtmlRuntime
export const autoInitHtmlRuntime = runtime.autoInitHtmlRuntime

export default runtime
