import { env, stderr } from 'process'

import test from 'ava'
import { each } from 'test-each'
import sinon from 'sinon'
import getStream from 'get-stream'

import fetchNodeWebsite from '../src/main.js'

const fetchReleases = async function(url, opts) {
  const content = await fetchUrl(url, opts)
  const releases = JSON.parse(content)
  return releases
}

const fetchUrl = async function(url, opts) {
  const response = await fetchNodeWebsite(url, opts)
  const content = await getStream(response)
  return content
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

each(
  ['', 'https://npm.taobao.org/mirrors/node'],
  [
    'NODE_MIRROR',
    'NVM_NODEJS_ORG_MIRROR',
    'N_NODE_MIRROR',
    'NODIST_NODE_MIRROR',
  ],
  ({ title }, mirror, envName) => {
    test.serial(`Mirror website | ${title}`, async t => {
      // eslint-disable-next-line fp/no-mutation
      env[envName] = mirror

      const releases = await fetchReleases('index.json', { progress: false })
      t.true(Array.isArray(releases))

      // eslint-disable-next-line fp/no-delete
      delete env[envName]
    })
  },
)

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
