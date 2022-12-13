import isPlainObj from 'is-plain-obj'

import { getDefaultMirror } from './mirror.js'

// Normalize options and assign default values
export const getOpts = (path, opts = {}) => {
  validateBasic(path, opts)
  const { progress = false, mirror = getDefaultMirror() } = opts
  validateProgress(progress)
  validateMirror(mirror)
  return { progress, mirror }
}

const validateBasic = (path, opts) => {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new TypeError(`Path must be a non-empty string: ${path}`)
  }

  if (!isPlainObj(opts)) {
    throw new TypeError(`Options must be a plain object: ${opts}`)
  }
}

const validateProgress = (progress) => {
  if (typeof progress !== 'boolean') {
    throw new TypeError(`Option "progress" must be a boolean: ${progress}`)
  }
}

const validateMirror = (mirror) => {
  if (typeof mirror !== 'string') {
    throw new TypeError(`Option "mirror" must be a string: ${mirror}`)
  }
}
