import { promisify } from 'util'

import ora from 'ora'
// TODO: replace with `Stream.finished()` after dropping support for Node 8/9
import endOfStream from 'end-of-stream'

import { pushSpinner, popSpinner } from './state.js'
import { getText } from './text.js'

const pEndOfStream = promisify(endOfStream)

// Add CLI spinner showing download progress
export const addSpinner = async function(response, progress, path) {
  if (!progress) {
    return
  }

  const spinner = ora({ color: 'green', spinner: 'star', discardStdin: false })
  pushSpinner(spinner)

  response.on('downloadProgress', ({ percent }) => {
    updateSpinner(spinner, path, percent)
  })

  // TODO: use try/finally after dropping support for Node 8/9
  try {
    await pEndOfStream(response, { writable: false })
    popSpinner(spinner)
  } catch {
    // This happens when a network error happens in the middle of the download,
    // which is hard to simulate in tests
    // istanbul ignore next
    popSpinner(spinner)
  }
}

const updateSpinner = function(spinner, path, percent) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  spinner.text = getText(path, percent)
}
