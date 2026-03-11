import fs from 'fs'
import path from 'path'

import { componentNames } from '../packages/core/src/shared/component-names'

const ROOT = path.resolve(__dirname, '..')
const WEAPP_SRC_ROOT = path.join(ROOT, 'packages/weapp/src')

const REQUIRED_TIM_EVENT_FILES = [
  'packages/weapp/src/button/button.ts',
  'packages/weapp/src/input/input.ts',
  'packages/weapp/src/textarea/textarea.ts',
  'packages/weapp/src/checkbox/use-checkbox.ts',
  'packages/weapp/src/switch/switch.ts',
  'packages/weapp/src/slider/slider.ts',
  'packages/weapp/src/tabs/use-tabs.ts',
  'packages/weapp/src/select/select.ts',
  'packages/weapp/src/select-native/select-native.ts',
  'packages/weapp/src/radio-group/use-radio-group.ts',
  'packages/weapp/src/pagination/pagination.ts',
  'packages/weapp/src/stepper/stepper.ts',
  'packages/weapp/src/number-input/number-input.ts',
  'packages/weapp/src/tags-input/tags-input.ts',
  'packages/weapp/src/accordion/accordion.ts',
  'packages/weapp/src/collapsible/collapsible.ts',
  'packages/weapp/src/toggle/toggle.ts',
  'packages/weapp/src/toggle-group/toggle-group.ts',
  'packages/weapp/src/combobox/combobox.ts',
  'packages/weapp/src/multiselect/multiselect.ts',
  'packages/weapp/src/navigation-menu/navigation-menu.ts',
  'packages/weapp/src/resizable/resizable.ts',
  'packages/weapp/src/datefield/datefield.ts',
  'packages/weapp/src/image-cropper/image-cropper.ts',
  'packages/weapp/src/checkbox-tree/checkbox-tree.ts',
  'packages/weapp/src/command/command.ts',
  'packages/weapp/src/dropdown-menu/dropdown-menu.ts',
  'packages/weapp/src/dropdown-menu-checkbox-item/dropdown-menu-checkbox-item.ts',
  'packages/weapp/src/dropdown-menu-radio-item/dropdown-menu-radio-item.ts',
  'packages/weapp/src/popover/use-popover.ts',
  'packages/weapp/src/tooltip/use-tooltip.ts',
  'packages/weapp/src/dialog/use-dialog.ts',
  'packages/weapp/src/alert-dialog/use-alert-dialog.ts',
  'packages/weapp/src/sheet/sheet.ts',
  'packages/weapp/src/toast/index.ts',
] as const

const REQUIRED_INTERACTIVE_COMPONENT_FILES = [
  'packages/weapp/src/button/button.ts',
  'packages/weapp/src/input/input.ts',
  'packages/weapp/src/textarea/textarea.ts',
  'packages/weapp/src/checkbox/checkbox.ts',
  'packages/weapp/src/switch/switch.ts',
  'packages/weapp/src/slider/slider.ts',
  'packages/weapp/src/tabs/index.ts',
  'packages/weapp/src/select/select.ts',
  'packages/weapp/src/select-native/select-native.ts',
  'packages/weapp/src/radio-group/radio-group.ts',
  'packages/weapp/src/pagination/pagination.ts',
  'packages/weapp/src/stepper/stepper.ts',
  'packages/weapp/src/number-input/number-input.ts',
  'packages/weapp/src/tags-input/tags-input.ts',
  'packages/weapp/src/accordion/accordion.ts',
  'packages/weapp/src/collapsible/collapsible.ts',
  'packages/weapp/src/toggle/toggle.ts',
  'packages/weapp/src/toggle-group/toggle-group.ts',
  'packages/weapp/src/combobox/combobox.ts',
  'packages/weapp/src/multiselect/multiselect.ts',
  'packages/weapp/src/navigation-menu/navigation-menu.ts',
  'packages/weapp/src/resizable/resizable.ts',
  'packages/weapp/src/datefield/datefield.ts',
  'packages/weapp/src/image-cropper/image-cropper.ts',
  'packages/weapp/src/checkbox-tree/checkbox-tree.ts',
  'packages/weapp/src/command/command.ts',
  'packages/weapp/src/dropdown-menu/dropdown-menu.ts',
  'packages/weapp/src/popover/popover.ts',
  'packages/weapp/src/tooltip/index.ts',
  'packages/weapp/src/dialog/dialog.ts',
  'packages/weapp/src/alert-dialog/alert-dialog.ts',
  'packages/weapp/src/sheet/sheet.ts',
  'packages/weapp/src/toast/index.ts',
] as const

const STATE_CHANGE_EVENT_EXPECTATIONS = [
  {
    file: 'packages/weapp/src/dialog/use-dialog.ts',
    eventName: "'openchange'",
  },
  {
    file: 'packages/weapp/src/popover/use-popover.ts',
    eventName: "'openchange'",
  },
  {
    file: 'packages/weapp/src/tooltip/use-tooltip.ts',
    eventName: "'openchange'",
  },
  {
    file: 'packages/weapp/src/alert-dialog/use-alert-dialog.ts',
    eventName: "'openchange'",
  },
  {
    file: 'packages/weapp/src/sheet/sheet.ts',
    eventName: "'openchange'",
  },
  {
    file: 'packages/weapp/src/dropdown-menu/dropdown-menu.ts',
    eventName: "'openchange'",
  },
  {
    file: 'packages/weapp/src/toast/index.ts',
    eventName: "'statuschange'",
  },
] as const

const failures: string[] = []

const addFailure = (message: string) => {
  failures.push(message)
}

const read = (relativePath: string) => {
  const absolutePath = path.join(ROOT, relativePath)
  return fs.readFileSync(absolutePath, 'utf-8')
}

const walkFiles = (directory: string): string[] => {
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  return entries.flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      return walkFiles(absolutePath)
    }
    return [absolutePath]
  })
}

const relativeFromRoot = (absolutePath: string) =>
  path.relative(ROOT, absolutePath).split(path.sep).join('/')

const parseConstStringArray = (source: string, constName: string): string[] => {
  const match = source.match(new RegExp(`export const ${constName} = \\[(.*?)\\] as const`, 's'))

  if (!match) {
    addFailure(`Unable to parse ${constName} from source`)
    return []
  }

  return Array.from(match[1].matchAll(/'([^']+)'|"([^"]+)"/g)).map((item) => item[1] || item[2])
}

const getComponentFiles = () =>
  walkFiles(WEAPP_SRC_ROOT)
    .filter((absolutePath) => absolutePath.endsWith('.ts'))
    .filter((absolutePath) => fs.readFileSync(absolutePath, 'utf-8').includes('Component({'))

const usesWeappTemplateHelper = (source: string) => source.includes('createWeappOptions(')
const hasStyleIsolation = (source: string) =>
  source.includes('styleIsolation:') || usesWeappTemplateHelper(source)
const hasPureDataPattern = (source: string) =>
  source.includes('pureDataPattern:') || source.includes('createWeappOptions({ pureData: true })')
const hasExternalClasses = (source: string) =>
  source.includes('externalClasses:') || source.includes('WEAPP_EXTERNAL_CLASSES')
const hasExtClassProp = (source: string) =>
  source.includes('extClass:') || source.includes('createWeappBaseProps(')
const hasIdProp = (source: string) =>
  source.includes('id:') || /createWeappBaseProps\(['"][^'"]+['"]\)/.test(source)

const checkNoLegacyJsSources = () => {
  const legacyJsFiles = walkFiles(WEAPP_SRC_ROOT)
    .filter((absolutePath) => absolutePath.endsWith('.js'))
    .map(relativeFromRoot)

  if (legacyJsFiles.length > 0) {
    addFailure(`Legacy .js source files remain in weapp/src: ${legacyJsFiles.join(', ')}`)
  }
}

const checkComponentCoverage = () => {
  for (const name of componentNames) {
    const componentDirectory = path.join(WEAPP_SRC_ROOT, name)
    if (!fs.existsSync(componentDirectory)) {
      addFailure(`Missing weapp component directory for core component "${name}"`)
    }
  }
}

const checkManifestAndRegistry = () => {
  const manifestSource = read('packages/weapp/src/manifest.ts')
  const registrySource = read('packages/weapp/registry.ts')

  if (!manifestSource.includes("framework: 'weapp'")) {
    addFailure('packages/weapp/src/manifest.ts must declare framework "weapp"')
  }

  if (!manifestSource.includes('components: componentNames')) {
    addFailure('packages/weapp/src/manifest.ts must source components from core componentNames')
  }

  if (!registrySource.includes('weappComponentNames = [...componentNames] as const')) {
    addFailure(
      'packages/weapp/registry.ts must derive registry components from core componentNames'
    )
  }

  const manifestExtras = parseConstStringArray(manifestSource, 'extraComponents')
  const registryExtras = parseConstStringArray(registrySource, 'weappExtraComponentNames')

  if (JSON.stringify(manifestExtras) !== JSON.stringify(registryExtras)) {
    addFailure(
      `Weapp manifest extras ${JSON.stringify(manifestExtras)} do not match registry extras ${JSON.stringify(registryExtras)}`
    )
  }

  for (const extra of manifestExtras) {
    const extraDirectory = path.join(WEAPP_SRC_ROOT, extra)
    if (!fs.existsSync(extraDirectory)) {
      addFailure(`Missing weapp extra component directory "${extra}"`)
    }
  }
}

const checkComponentTemplateFields = () => {
  for (const absolutePath of getComponentFiles()) {
    const relativePath = relativeFromRoot(absolutePath)
    const source = fs.readFileSync(absolutePath, 'utf-8')
    const componentSource = source.slice(source.indexOf('Component({'))

    if (!hasStyleIsolation(source)) {
      addFailure(`${relativePath} defines Component() without styleIsolation`)
    }

    if (!hasExternalClasses(source)) {
      addFailure(`${relativePath} defines Component() without externalClasses support`)
    }

    if (!hasPureDataPattern(source)) {
      addFailure(`${relativePath} defines Component() without pureDataPattern`)
    }

    if (!hasExtClassProp(source)) {
      addFailure(`${relativePath} defines Component() without extClass prop`)
    }

    const extClassIndex = componentSource.indexOf('extClass:')
    const propertiesIndex = componentSource.indexOf('properties:')
    if (extClassIndex !== -1 && propertiesIndex !== -1 && extClassIndex < propertiesIndex) {
      addFailure(`${relativePath} defines extClass outside properties block`)
    }
  }
}

const checkComponentStructure = () => {
  const componentDirectories = fs
    .readdirSync(WEAPP_SRC_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(WEAPP_SRC_ROOT, entry.name))
    .filter((directory) =>
      fs
        .readdirSync(directory)
        .some(
          (name) =>
            name.endsWith('.ts') &&
            fs.readFileSync(path.join(directory, name), 'utf-8').includes('Component({')
        )
    )

  for (const directory of componentDirectories) {
    const relativeDirectory = relativeFromRoot(directory)
    const extensions = new Set(fs.readdirSync(directory).map((name) => path.extname(name)))

    for (const requiredExtension of ['.ts', '.wxml', '.wxss', '.json']) {
      if (!extensions.has(requiredExtension)) {
        addFailure(`${relativeDirectory} is missing required ${requiredExtension} component file`)
      }
    }
  }
}

const checkInteractiveComponentIds = () => {
  for (const relativePath of REQUIRED_INTERACTIVE_COMPONENT_FILES) {
    const source = read(relativePath)
    if (!hasIdProp(source)) {
      addFailure(`${relativePath} is missing an id prop for TimEvent targeting`)
    }
  }
}

const checkTimEventProtocol = () => {
  for (const relativePath of REQUIRED_TIM_EVENT_FILES) {
    const source = read(relativePath)
    if (!source.includes('emitTimEvent(') && !source.includes('createTimEvent(')) {
      addFailure(`${relativePath} is missing TimEvent emission`)
    }
  }

  for (const expectation of STATE_CHANGE_EVENT_EXPECTATIONS) {
    const source = read(expectation.file)
    if (!source.includes(expectation.eventName)) {
      addFailure(
        `${expectation.file} must emit ${expectation.eventName} for TimEvent compatibility`
      )
    }
  }
}

const checkSmokeScripts = () => {
  const semanticsSource = read('scripts/goal-smoke-weapp-semantics.ts')
  const runtimeSource = read('scripts/goal-smoke-weapp-runtime.ts')

  if (semanticsSource.includes('tabs/index.js') || runtimeSource.includes('tabs/index.js')) {
    addFailure('Weapp smoke scripts still reference deleted tabs/index.js legacy implementation')
  }
}

const main = () => {
  console.log('Weapp CI checks: START')

  checkNoLegacyJsSources()
  checkComponentCoverage()
  checkManifestAndRegistry()
  checkComponentTemplateFields()
  checkComponentStructure()
  checkInteractiveComponentIds()
  checkTimEventProtocol()
  checkSmokeScripts()

  if (failures.length > 0) {
    throw new Error(`Weapp CI checks failed:\n- ${failures.join('\n- ')}`)
  }

  console.log('Weapp CI checks: PASS')
}

main()
