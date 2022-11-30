import test from 'ava'
import { each } from 'test-each'

import { fetchReleases } from './helpers/main.test.js'

each(['index.json', '/index.json'], ({ title }, url) => {
  test(`Success request | ${title}`, async (t) => {
    const releases = await fetchReleases(url)
    t.true(Array.isArray(releases))
  })
})

each(
  [
    '\u0000',
    // This release does not exist. We make a request that looks legit so we are
    // not blocked.
    'v12.7.1/node-v12.7.1-linux-x64.tar.gz',
  ],
  [{}, { progress: true }],
  ({ title }, url, opts) => {
    test(`Error request | ${title}`, async (t) => {
      await t.throwsAsync(fetchReleases(url, opts))
    })
  },
)
