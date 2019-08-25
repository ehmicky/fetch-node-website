import { env, stderr } from 'process'

import test from 'ava'
import { each } from 'test-each'
import sinon from 'sinon'
import getStream from 'get-stream'

import fetchNodeWebsite from '../src/main.js'

const fetchReleases = async function(url, opts) {
  const response = await fetchNodeWebsite(url, opts)
  const content = await getStream(response)
  const releases = JSON.parse(content)
  return releases
}

each(
  [
    '\u0000',
    // This release does not exist. We make a request that looks legit so we are
    // not blocked.
    'v12.7.1/node-v12.7.1-linux-x64.tar.gz',
  ],
  ({ title }, url) => {
    test(`Error request | ${title}`, async t => {
      await t.throwsAsync(fetchReleases(url, { progress: false }))
    })
  },
)

each(['index.json', '/index.json'], ({ title }, url) => {
  test(`Success request | ${title}`, async t => {
    const releases = await fetchReleases(url, { progress: false })
    t.true(Array.isArray(releases))
  })
})

each(['', 'https://npm.taobao.org/mirrors/node'], ({ title }, mirror) => {
  test.serial(`Mirror website | ${title}`, async t => {
    // eslint-disable-next-line fp/no-mutation
    env.NODE_MIRROR = mirror

    const releases = await fetchReleases('index.json', { progress: false })
    t.true(Array.isArray(releases))

    // eslint-disable-next-line fp/no-delete
    delete env.NODE_MIRROR
  })
})

each(
  [
    { opts: { progress: false }, called: false },
    { opts: { progress: true }, called: true },
    { called: true },
  ],
  ({ title }, { opts, called }) => {
    test.serial(`Spinner | ${title}`, async t => {
      const spy = sinon.spy(stderr, 'write')

      await fetchReleases('index.json', opts)

      t.is(spy.called, called)

      spy.restore()
    })
  },
)
