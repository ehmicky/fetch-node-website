import { validate } from 'jest-validate'

import { getMirrorEnv } from './mirror.js'

// Normalize options and assign default values
export const getOpts = function(path, opts = {}) {
  validateBasic(path, opts)
  validate(opts, { exampleConfig: EXAMPLE_OPTS })

  const mirrorEnv = getMirrorEnv()
  const optsA = { ...DEFAULT_OPTS, ...mirrorEnv, ...opts }
  return optsA
}

const validateBasic = function(path) {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new TypeError(`Path must be a non-empty string: ${path}`)
  }
}

export const DEFAULT_OPTS = {
  progress: true,
  mirror: 'https://nodejs.org/dist',
}

export const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
}
