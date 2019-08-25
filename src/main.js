import { env } from 'process'

import got from 'got'

import { addSpinner } from './spinner.js'

// Make a HTTP GET request towards `https://nodejs.org/dist/...`
const fetchNodeWebsite = async function(path, { progress = true } = {}) {
  const baseUrl = getBaseUrl()
  const response = await got(path, { baseUrl, stream: true })

  addSpinner(response, progress)

  return response
}

const getBaseUrl = function() {
  if (env.NODE_MIRROR !== undefined && env.NODE_MIRROR !== '') {
    return env.NODE_MIRROR
  }

  return DEFAULT_BASE_URL
}

const DEFAULT_BASE_URL = 'https://nodejs.org/dist'

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = fetchNodeWebsite
