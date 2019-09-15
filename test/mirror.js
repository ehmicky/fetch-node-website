import { env } from 'process'

import test from 'ava'
import { each } from 'test-each'

import { fetchReleases } from './helpers/main.js'

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
