import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const read = (relativePath: string) => fs.readFileSync(path.join(ROOT, relativePath), 'utf-8')

const assertIncludes = (relativePath: string, snippet: string, checkName: string) => {
  const source = read(relativePath)
  assert(source.includes(snippet), `${checkName} failed in ${relativePath}: missing "${snippet}"`)
}

const runSelectChecks = () => {
  assertIncludes(
    'packages/weapp/src/select/select.ts',
    "emitTimEvent(this, 'change', 'change'",
    'select emits TimEvent change'
  )
  assertIncludes(
    'packages/weapp/src/select/select.ts',
    'onTriggerTap()',
    'select exposes trigger tap handler'
  )
  assertIncludes(
    'packages/weapp/src/select/select.wxml',
    'bindtap="onTriggerTap"',
    'select trigger tap binding'
  )
  assertIncludes(
    'packages/weapp/src/select/select.wxml',
    'bindtap="onItemTap"',
    'select item tap binding'
  )
}

const runDialogChecks = () => {
  assertIncludes(
    'packages/weapp/src/dialog/use-dialog.ts',
    'emitTimEvent(',
    'dialog emits TimEvent openchange'
  )
  assertIncludes(
    'packages/weapp/src/dialog/use-dialog.ts',
    "'openchange'",
    'dialog uses dedicated openchange event name'
  )
  assertIncludes(
    'packages/weapp/src/dialog/dialog.wxml',
    'bindtap="onBackdropTap"',
    'dialog backdrop tap binding'
  )
  assertIncludes(
    'packages/weapp/src/dialog/dialog.wxml',
    'bindtap="onCloseTap"',
    'dialog close tap binding'
  )
}

const runTabsChecks = () => {
  assertIncludes(
    'packages/weapp/src/tabs/use-tabs.ts',
    "emitTimEvent(instance, 'change', 'change'",
    'tabs emits TimEvent change from state machine'
  )
  assertIncludes(
    'packages/weapp/src/tabs/index.wxml',
    'bindtap="handleTabClick"',
    'tabs trigger tap binding'
  )
}

const main = () => {
  console.log('Weapp semantics smoke: START')
  runSelectChecks()
  runDialogChecks()
  runTabsChecks()
  console.log('Weapp semantics smoke: PASS')
}

main()
