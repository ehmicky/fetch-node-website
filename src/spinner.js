import { promisify } from 'util'

import ora from 'ora'
// TODO: replace with `Stream.finished()` after dropping support for Node 8/9
import endOfStream from 'end-of-stream'

const pEndOfStream = promisify(endOfStream)

// Add CLI spinner showing download progress
export const addSpinner = async function(response, progress) {
  if (!progress) {
    return
  }

  const spinner = ora({ color: 'green', spinner: 'star' })
  spinner.start()

  response.on('downloadProgress', ({ transferred }) => {
    updateSpinner(spinner, transferred)
  })

  // TODO: use try/finally after dropping support for Node 8/9
  try {
    await pEndOfStream(response, { writable: false })
    spinner.stop()
  } catch {
    // This happens when a network error happens in the middle of the download,
    // which is hard to simulate in tests
    // istanbul ignore next
    spinner.stop()
  }
}

const updateSpinner = function(spinner, transferred) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  spinner.text = `${TEXT} ${getMegabytes(transferred)}`
}

const TEXT = 'Downloading Node.js...'

const getMegabytes = function(size) {
  const sizeA = Math.floor(size / BYTES_TO_MEGABYTES)
  return `${String(sizeA).padStart(2)}MB`
}

// eslint-disable-next-line no-magic-numbers
const BYTES_TO_MEGABYTES = 1024 ** 2
