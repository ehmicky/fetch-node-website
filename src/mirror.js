import { env } from 'process'

// The `mirror` option can be specified using the environment variables used
// by popular Node.js version managers (nvm, n, nodist)
export const getMirrorEnv = function () {
  const mirrorName = MIRRORS.find(isDefinedEnv)

  if (mirrorName === undefined) {
    return {}
  }

  const mirror = env[mirrorName]
  return { mirror }
}

const isDefinedEnv = function (name) {
  return env[name] !== undefined && env[name].trim() !== ''
}

const MIRRORS = [
  'NODE_MIRROR',
  'NVM_NODEJS_ORG_MIRROR',
  'N_NODE_MIRROR',
  'NODIST_NODE_MIRROR',
]
