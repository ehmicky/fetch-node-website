import filterObj from 'filter-obj'
import { validate } from 'jest-validate'

import { getMirrorEnv } from './mirror.js'

// Normalize options and assign default values
export const getOpts = function (path, opts = {}) {
  validateBasic(path, opts)
  validate(opts, { exampleConfig: EXAMPLE_OPTS })

  const optsA = filterObj(opts, isDefined)
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

const isDefined = function (key, value) {
  return value !== undefined
}
