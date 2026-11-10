import assert from 'node:assert/strict'

import { demoKindFromName } from '../apps/docs/lib/demo-layout'
import { disambiguateDemoTitles } from '../apps/docs/lib/demo-title'

const cases: Array<[string, string]> = [
  ['button-01', 'control'],
  ['form-demo', 'form'],
  ['input-03', 'form'],
  ['select-native', 'form'],
  ['table-01', 'data'],
  ['data-table-01', 'data'],
  ['card-02', 'data'],
  ['timeline-09', 'data'],
  ['dialog-01', 'overlay'],
  ['alert-dialog', 'overlay'],
  ['dropdown-menu-04', 'overlay'],
  ['sheet', 'overlay'],
  ['popover-01', 'overlay'],
  ['tooltip-09', 'overlay'],
  ['registry/default/components/slider/slider-06.tsx', 'form'],
  ['calendar-rac', 'form'],
]

for (const [name, kind] of cases) {
  assert.equal(demoKindFromName(name), kind, name)
}

assert.equal(demoKindFromName(''), 'control')

const titled = disambiguateDemoTitles([
  { title: 'Input · With label', sourceName: 'input-01' },
  { title: 'Input · With label', sourceName: 'input-12' },
  { title: 'Button · Basic button', sourceName: 'button-01' },
])
assert.deepEqual(
  titled.map((item) => item.title),
  ['Input · With label · 01', 'Input · With label · 12', 'Button · Basic button']
)

console.log(`demo-layout ${cases.length} cases ok`)
