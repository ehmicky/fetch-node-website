import { env } from 'process'

import test from 'ava'
import { each } from 'test-each'

import { fetchReleases } from './helpers/main.js'

const MIRROR_PATH = 'https://npm.taobao.org/mirrors/node'

each(
  ['', MIRROR_PATH],
  [
    'NODE_MIRROR',
    'NVM_NODEJS_ORG_MIRROR',
    'N_NODE_MIRROR',
    'NODIST_NODE_MIRROR',
  ],
  ({ title }, mirror, envName) => {
    test.serial(
      `Mirror website as environment variable | ${title}`,
      async t => {
        // eslint-disable-next-line fp/no-mutation
        env[envName] = mirror

        const releases = await fetchReleases('index.json')
        t.true(Array.isArray(releases))

        // eslint-disable-next-line fp/no-delete
        delete env[envName]
      },
    )
  },
)

test(`Mirror website as option`, async t => {
  const releases = await fetchReleases('index.json', { mirror: MIRROR_PATH })
  t.true(Array.isArray(releases))
})
