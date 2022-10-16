import { env } from 'process'

// The `mirror` option can be specified using the environment variables used
// by popular Node.js version managers (nvm, n, nodist)
export const getDefaultMirror = function () {
  return MIRRORS.map(getEnv).find(Boolean) ?? DEFAULT_MIRROR
}

const MIRRORS = [
  'NODE_MIRROR',
  'NVM_NODEJS_ORG_MIRROR',
  'N_NODE_MIRROR',
  'NODIST_NODE_MIRROR',
]

const getEnv = function (name) {
  return env[name]
}

const DEFAULT_MIRROR = 'https://nodejs.org/dist'
