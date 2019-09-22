import { stderr } from 'process'

import test from 'ava'
import { each } from 'test-each'
import sinon from 'sinon'

import { fetchUrl } from './helpers/main.js'

each(
  [
    { opts: { progress: false }, called: false },
    { opts: { progress: true }, called: true },
    { called: true },
  ],
  [
    'index.json',
    '/index.json',
    'v10.0.0/node-v10.0.0-headers.tar.xz',
    'npm/npm-1.1.0-1.zip',
  ],
  ({ title }, { opts, called }, path) => {
    test.serial(`Spinner | ${title}`, async t => {
      const spy = sinon.spy(stderr, 'write')

      await fetchUrl(path, opts)

      t.is(spy.called, called)

      spy.restore()
    })
  },
)

test('Spinners in parallel', async t => {
  const spy = sinon.spy(stderr, 'write')

  await Promise.all(Array.from({ length: 10 }, () => fetchUrl('index.json')))

  t.is(spy.called, true)

  spy.restore()
})
