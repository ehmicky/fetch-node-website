import { promisify } from 'util'

import { MultiBar } from 'cli-progress'
// TODO: replace with `Stream.finished()` after dropping support for Node 8/9
import endOfStream from 'end-of-stream'

const pEndOfStream = promisify(endOfStream)

// Add CLI progress bar.
// If there are several downloads in parallel, several bars are shown.
export const addProgress = async function(response, progress, path) {
  if (!progress) {
    return
  }

  const bar = startBar(path)

  response.on('downloadProgress', ({ percent }) => {
    bar.update(percent)
  })

  try {
    await pEndOfStream(response, { writable: false })
  } finally {
    stopBar(bar)
  }
}

const MULTIBAR_OPTS = {
  format: '  {prefix}   {bar}  {percentage}%',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  stopOnComplete: true,
  clearOnComplete: true,
  hideCursor: true,
}

// MultiBar is just a low-memory plain object that does not interact with the
// CLI when no bar has been started yet, or when all bars are complete, so it's
// safe as a global variable. We need it as a global variable so concurrent
// calls use the same MultiBar.
const multibar = new MultiBar(MULTIBAR_OPTS)

// Ad a new progress bar when a download starts
const startBar = function(path) {
  const bar = multibar.create()
  const prefix = getPrefix(path)
  bar.start(1, 0, { prefix })
  return bar
}

// Retrieve the text shown before the progress bar
const getPrefix = function(path) {
  const version = VERSION_TEXT_REGEXP.exec(path)

  if (version !== null) {
    return `${VERSION_TEXT} ${version[1].padStart(VERSION_PADDING)}`
  }

  if (INDEX_TEXT_REGEXP.test(path)) {
    return INDEX_TEXT
  }

  return DEFAULT_TEXT
}

const VERSION_TEXT_REGEXP = /^\/?v([\d.]+)\//u
const INDEX_TEXT_REGEXP = /^\/?index.(json|tab)$/u
const VERSION_PADDING = 7

const VERSION_TEXT = 'Downloading Node.js'
const INDEX_TEXT = 'Downloading list of Node.js versions'
const DEFAULT_TEXT = 'Downloading Node.js'

// Remove a new progress bar when a download is complete
const stopBar = function(bar) {
  bar.stop()
  multibar.remove(bar)
}
