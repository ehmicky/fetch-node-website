import got from 'got'

import { getOpts } from './options.js'
import { addSpinner } from './spinner.js'

// Make a HTTP GET request towards `https://nodejs.org/dist/...`
const fetchNodeWebsite = async function(path, opts) {
  const { mirror, progress } = getOpts(path, opts)

  const response = await got(path, { baseUrl: mirror, stream: true })

  addSpinner(response, progress, path)

  return response
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = fetchNodeWebsite
