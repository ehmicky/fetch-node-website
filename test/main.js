import { env, stderr } from 'process'

import test from 'ava'
import sinon from 'sinon'

import fetchNodeWebsite from '../src/main.js'

test('Error request', async t => {
  await t.throwsAsync(fetchNodeWebsite('\u0000', { progress: false }))
})

test('Error response', async t => {
  // This release does not exist. We make a request that looks legit so we are
  // not blocked.
  await t.throwsAsync(
    fetchNodeWebsite('v12.7.1/node-v12.7.1-linux-x64.tar.gz', {
      progress: false,
    }),
  )
})

test('Success', async t => {
  const response = await fetchNodeWebsite('index.json', { progress: false })
  const releases = await response.json()
  t.true(Array.isArray(releases))
})

test('Leading slashes', async t => {
  const response = await fetchNodeWebsite('/index.json', { progress: false })
  const releases = await response.json()
  t.true(Array.isArray(releases))
})

test.serial('Empty mirror website', async t => {
  // eslint-disable-next-line fp/no-mutation
  env.NODE_MIRROR = ''

  const response = await fetchNodeWebsite('index.json', { progress: false })
  const releases = await response.json()
  t.true(Array.isArray(releases))

  // eslint-disable-next-line fp/no-delete
  delete env.NODE_MIRROR
})

test.serial('Mirror website', async t => {
  // eslint-disable-next-line fp/no-mutation
  env.NODE_MIRROR = 'https://npm.taobao.org/mirrors/node'

  const response = await fetchNodeWebsite('index.json', { progress: false })
  const releases = await response.json()
  t.true(Array.isArray(releases))

  // eslint-disable-next-line fp/no-delete
  delete env.NODE_MIRROR
})

test.serial('Do not show spinner if opts.progress false', async t => {
  const spy = sinon.spy(stderr, 'write')

  const response = await fetchNodeWebsite('index.json', { progress: false })
  await response.json()

  t.true(spy.notCalled)

  spy.restore()
})

test.serial('Show spinner if opts.progress true', async t => {
  const spy = sinon.spy(stderr, 'write')

  const response = await fetchNodeWebsite('index.json', { progress: true })
  await response.json()

  t.true(spy.called)

  spy.restore()
})

test.serial('Show spinner by default', async t => {
  const spy = sinon.spy(stderr, 'write')

  const response = await fetchNodeWebsite('index.json')
  await response.json()

  t.true(spy.called)

  spy.restore()
})
