import assert from 'node:assert/strict'

import {
  isLoadPreviewMessage,
  isPreviewOutgoingMessage,
  isUpdatePropsMessage,
  PREVIEW_PROTOCOL_VERSION,
} from '../packages/core/src/shared/preview-protocol'

const main = () => {
  console.log('Preview protocol smoke: START')

  const validLoad = {
    type: 'LOAD_PREVIEW',
    version: PREVIEW_PROTOCOL_VERSION,
    requestId: 'req-preview-1',
    framework: 'vue',
    componentName: 'accordion-01',
    props: { size: 'sm' },
  }
  assert.equal(isLoadPreviewMessage(validLoad), true, 'valid LOAD_PREVIEW should pass')

  const invalidLoad = {
    type: 'LOAD_PREVIEW',
    version: '0.0.0',
    requestId: 'req-preview-2',
    framework: 'vue',
  }
  assert.equal(isLoadPreviewMessage(invalidLoad), false, 'version mismatch should fail')

  const validUpdate = {
    type: 'UPDATE_PROPS',
    version: PREVIEW_PROTOCOL_VERSION,
    requestId: 'req-preview-3',
    props: { disabled: true },
  }
  assert.equal(isUpdatePropsMessage(validUpdate), true, 'valid UPDATE_PROPS should pass')

  const rendered = {
    type: 'PREVIEW_RENDERED',
    version: PREVIEW_PROTOCOL_VERSION,
    requestId: 'req-preview-4',
    framework: 'react',
    componentPath: 'components/button',
  }
  assert.equal(isPreviewOutgoingMessage(rendered), true, 'valid PREVIEW_RENDERED should pass')

  const brokenFailed = {
    type: 'PREVIEW_FAILED',
    version: PREVIEW_PROTOCOL_VERSION,
    requestId: 'req-preview-5',
    framework: 'html',
  }
  assert.equal(
    isPreviewOutgoingMessage(brokenFailed),
    false,
    'PREVIEW_FAILED without message should fail'
  )

  console.log('Preview protocol smoke: PASS')
}

main()
