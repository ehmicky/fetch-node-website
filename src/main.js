import got from 'got'

import { getOpts } from './options.js'
import { addProgress } from './progress.js'

// Make a HTTP GET request towards `https://nodejs.org/dist/...`
const fetchNodeWebsite = async function(path, opts) {
  const { mirror, progress } = getOpts(path, opts)

  const pathA = path.replace(LEADING_SLASH_REGEXP, '')
  const response = await got(pathA, { prefixUrl: mirror, stream: true })

  addProgress(response, progress, path)

  return response
}

const LEADING_SLASH_REGEXP = /^\//u

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = fetchNodeWebsite
