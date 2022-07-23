import { excludeKeys } from 'filter-obj'
import { validate } from 'jest-validate'

import { getMirrorEnv } from './mirror.js'

// Normalize options and assign default values
export const getOpts = function (path, opts = {}) {
  validateBasic(path, opts)
  validate(opts, { exampleConfig: EXAMPLE_OPTS })

  const optsA = excludeKeys(opts, isUndefined)
  const mirrorEnv = getMirrorEnv()
  const optsB = { ...DEFAULT_OPTS, ...mirrorEnv, ...optsA }
  return optsB
}

const validateBasic = function (path) {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new TypeError(`Path must be a non-empty string: ${path}`)
  }
}

export const DEFAULT_OPTS = {
  progress: false,
  mirror: 'https://nodejs.org/dist',
}

export const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
}

const isUndefined = function (key, value) {
  return value === undefined
}
