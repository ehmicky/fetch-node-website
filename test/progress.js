import { stderr } from 'process'

import test from 'ava'
import { each } from 'test-each'
import sinon from 'sinon'

import { fetchUrl } from './helpers/main.js'

// Tests are not run in an interactive terminal, i.e. progress bars does not
// show up unless we patch this.
// eslint-disable-next-line fp/no-mutation
stderr.isTTY = true

each(
  [
    { opts: { progress: true }, called: true },
    { opts: { progress: false }, called: false },
    { called: false },
  ],
  [
    'index.json',
    '/index.json',
    'v10.0.0/node-v10.0.0-headers.tar.xz',
    'npm/npm-1.1.0-1.zip',
  ],
  ({ title }, { opts, called }, path) => {
    test.serial(`Progress | ${title}`, async t => {
      const spy = sinon.spy(stderr, 'write')

      await fetchUrl(path, opts)

      t.is(spy.called, called)

      spy.restore()
    })
  },
)

test('Progress bars in parallel', async t => {
  const spy = sinon.spy(stderr, 'write')

  await Promise.all(
    Array.from({ length: 10 }, () =>
      fetchUrl('index.json', { progress: true }),
    ),
  )

  t.is(spy.called, true)

  spy.restore()
})
