import { env } from 'process'

import fetch from 'cross-fetch'

// Make a HTTP GET request towards `https://nodejs.org/dist/...`
const fetchNodeWebsite = async function(path) {
  const url = getUrl(path)

  const response = await performFetch(url)

  if (!response.ok) {
    throw new Error(`Could not fetch ${url} (status ${response.status})`)
  }

  return response
}

const getUrl = function(path) {
  const domain = getDomain()
  const pathA = path.replace(STARTING_SLASH, '')
  return `${domain}/${pathA}`
}

const getDomain = function() {
  if (env.NODE_MIRROR !== undefined && env.NODE_MIRROR !== '') {
    return env.NODE_MIRROR
  }

  return DEFAULT_DOMAIN
}

const DEFAULT_DOMAIN = 'https://nodejs.org/dist'

const STARTING_SLASH = /^\/+/u

const performFetch = async function(url) {
  try {
    return await fetch(url)
  } catch (error) {
    throw new Error(`Could not fetch ${url}\n\n${error.stack}`)
  }
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = fetchNodeWebsite
