import { env, stderr } from 'process'

import test from 'ava'
import sinon from 'sinon'
import getStream from 'get-stream'

import fetchNodeWebsite from '../src/main.js'

const fetchReleases = async function(url, opts) {
  const response = await fetchNodeWebsite(url, opts)
  const content = await getStream(response)
  const releases = JSON.parse(content)
  return releases
}

test('Error request', async t => {
  await t.throwsAsync(fetchReleases('\u0000', { progress: false }))
})

test('Error response', async t => {
  // This release does not exist. We make a request that looks legit so we are
  // not blocked.
  await t.throwsAsync(
    fetchReleases('v12.7.1/node-v12.7.1-linux-x64.tar.gz', { progress: false }),
  )
})

test('Success', async t => {
  const releases = await fetchReleases('index.json', { progress: false })
  t.true(Array.isArray(releases))
})

test('Leading slashes', async t => {
  const releases = await fetchReleases('/index.json', { progress: false })
  t.true(Array.isArray(releases))
})

test.serial('Empty mirror website', async t => {
  // eslint-disable-next-line fp/no-mutation
  env.NODE_MIRROR = ''

  const releases = await fetchReleases('index.json', { progress: false })
  t.true(Array.isArray(releases))

  // eslint-disable-next-line fp/no-delete
  delete env.NODE_MIRROR
})

test.serial('Mirror website', async t => {
  // eslint-disable-next-line fp/no-mutation
  env.NODE_MIRROR = 'https://npm.taobao.org/mirrors/node'

  const releases = await fetchReleases('index.json', { progress: false })
  t.true(Array.isArray(releases))

  // eslint-disable-next-line fp/no-delete
  delete env.NODE_MIRROR
})

test.serial('Do not show spinner if opts.progress false', async t => {
  const spy = sinon.spy(stderr, 'write')

  await fetchReleases('index.json', { progress: false })

  t.true(spy.notCalled)

  spy.restore()
})

test.serial('Show spinner if opts.progress true', async t => {
  const spy = sinon.spy(stderr, 'write')

  await fetchReleases('index.json', { progress: true })

  t.true(spy.called)

  spy.restore()
})

test.serial('Show spinner by default', async t => {
  const spy = sinon.spy(stderr, 'write')

  await fetchReleases('index.json')

  t.true(spy.called)

  spy.restore()
})
