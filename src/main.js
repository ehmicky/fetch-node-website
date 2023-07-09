import { got } from 'got'

import { getOpts } from './options.js'
import { addProgress } from './progress.js'

// Make a HTTP GET request towards `https://nodejs.org/dist/...`
const fetchNodeWebsite = async (path, opts) => {
  const { mirror, progress, signal } = getOpts(path, opts)

  const pathA = path.replace(LEADING_SLASH_REGEXP, '')
  const response = await got.stream(pathA, { prefixUrl: mirror, signal })

  addProgress({ response, progress, path, signal })

  return response
}

export default fetchNodeWebsite

const LEADING_SLASH_REGEXP = /^\//u
