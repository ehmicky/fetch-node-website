// eslint-disable-next-line node/no-extraneous-import
import fetchNodeWebsite from 'fetch-node-website'
import getStream from 'get-stream'

// Call the main code
export const fetchReleases = async function (url, opts) {
  const content = await fetchUrl(url, opts)
  const releases = JSON.parse(content)
  return releases
}

export const fetchUrl = async function (url, opts) {
  const response = await fetchNodeWebsite(url, opts)
  const content = await getStream(response)
  return content
}
