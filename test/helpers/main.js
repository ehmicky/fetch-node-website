import getStream from 'get-stream'

import fetchNodeWebsite from '../../src/main.js'

// Call the main code
export const fetchReleases = async function(url, opts) {
  const content = await fetchUrl(url, opts)
  const releases = JSON.parse(content)
  return releases
}

export const fetchUrl = async function(url, opts) {
  const response = await fetchNodeWebsite(url, opts)
  const content = await getStream(response)
  return content
}
