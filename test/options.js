import test from 'ava'
import { each } from 'test-each'

import { fetchReleases } from './helpers/main.js'

each(
  [
    [],
    [''],
    [' '],
    [true],
    ['/path', { mirror: true }],
    ['/path', { progress: 'invalid' }],
  ],
  ({ title }, path, opts) => {
    test(`Invalid parameters | ${title}`, async t => {
      await t.throwsAsync(fetchReleases(path, opts))
    })
  },
)
