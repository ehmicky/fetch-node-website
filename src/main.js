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
  const mirror = MIRRORS.find(isDefinedEnv)

  if (mirror !== undefined) {
    return env[mirror]
  }

  return DEFAULT_BASE_URL
}

const MIRRORS = [
  'NODE_MIRROR',
  'NVM_NODEJS_ORG_MIRROR',
  'N_NODE_MIRROR',
  'NODIST_NODE_MIRROR',
]

const isDefinedEnv = function(name) {
  return env[name] !== undefined && env[name].trim() !== ''
}

const DEFAULT_BASE_URL = 'https://nodejs.org/dist'

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = fetchNodeWebsite
