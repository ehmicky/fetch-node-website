import { stderr } from 'node:process'
import { setTimeout as pSetTimeout } from 'node:timers/promises'

import { install } from '@sinonjs/fake-timers'
import test from 'ava'
import { stub } from 'sinon'
import { each } from 'test-each'

import { fetchUrl } from './helpers/main.test.js'

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
    test.serial(`Progress | ${title}`, async (t) => {
      const stubA = stub(stderr, 'write')

      await fetchUrl(path, opts)

      t.is(stubA.called, called)

      stubA.restore()
    })
  },
)

test.serial('Progress bars in parallel', async (t) => {
  const stubA = stub(stderr, 'write')

  await Promise.all(
    Array.from({ length: 10 }, () =>
      fetchUrl('index.json', { progress: true }),
    ),
  )

  t.true(stubA.called)

  stubA.restore()
})

test.serial('"signal" cancels the progress bars early', async (t) => {
  const stubA = stub(stderr, 'write')

  const signal = AbortSignal.abort()
  await t.throwsAsync(fetchUrl('index.json', { progress: true, signal }))

  t.false(stubA.called)

  stubA.restore()
})

test.serial('"signal" cancels the progress bars later', async (t) => {
  const stubA = stub(stderr, 'write')
  const clock = install()

  const controller = new AbortController()
  await t.throwsAsync(
    Promise.all([
      fetchUrl('index.json', { progress: true, signal: controller.signal }),
      waitThenAbort(controller, clock),
    ]),
  )

  t.true(stubA.args.some(isProgressBarLine))

  clock.uninstall()
  stubA.restore()
})

const isProgressBarLine = ([message]) => message.includes('Node.js')

const waitThenAbort = async (controller, clock) => {
  // Awaits `got.stream()`, to let `Multibar.create()` be called
  await pSetTimeout(0)
  // Let progress bar call `stderr.write()`
  clock.tick(SIGNAL_TIMEOUT)
  controller.abort()
}

// Long enough for `cli-progress` interval timer to call `stderr.write()`
const SIGNAL_TIMEOUT = 1e6
