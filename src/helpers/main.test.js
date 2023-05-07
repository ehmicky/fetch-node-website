import { text } from 'node:stream/consumers'

import fetchNodeWebsite from 'fetch-node-website'

// Call the main code
export const fetchReleases = async (url, opts) => {
  const content = await fetchUrl(url, opts)
  const releases = JSON.parse(content)
  return releases
}

export const fetchUrl = async (url, opts) => {
  const response = await fetchNodeWebsite(url, opts)
  const content = await text(response)
  return content
}
