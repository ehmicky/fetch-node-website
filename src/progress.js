import { finished } from 'node:stream'
import { promisify } from 'node:util'

import { MultiBar } from 'cli-progress'
import colorsOption from 'colors-option'
import figures from 'figures'

// TODO: use `stream/promises` instead once dropping support for Node <15.0.0
const pFinished = promisify(finished)

const { green } = colorsOption()

// Add CLI progress bar.
// If there are several downloads in parallel, several bars are shown.
export const addProgress = async (response, progress, path) => {
  if (!progress || !showsBar()) {
    return
  }

  const bar = startBar(path)

  response.on('downloadProgress', ({ percent }) => {
    bar.update(percent)
  })

  try {
    await pFinished(response, { writable: false })
  } catch {}

  stopBar(bar)
}

const MULTIBAR_OPTS = {
  format: `  ${green(figures.nodejs)}  {prefix}  {bar}`,
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
const startBar = (path) => {
  const bar = multibar.create()
  const prefix = getPrefix(path)
  bar.start(1, 0, { prefix })
  return bar
}

// `cli-progress` does nothing when not inside a TTY
const showsBar = () => multibar.terminal.isTTY()

// Retrieve the text shown before the progress bar
const getPrefix = (path) => {
  const version = VERSION_TEXT_REGEXP.exec(path)

  if (version !== null) {
    return `${VERSION_TEXT} ${version[1].padEnd(VERSION_PADDING)}`
  }

  if (INDEX_TEXT_REGEXP.test(path)) {
    return INDEX_TEXT
  }

  return DEFAULT_TEXT
}

const VERSION_TEXT_REGEXP = /^\/?v([\d.]+)\//u
const INDEX_TEXT_REGEXP = /^\/?index.(json|tab)$/u
const VERSION_PADDING = 7

const VERSION_TEXT = 'Node.js'
const INDEX_TEXT = 'List of Node.js versions'
const DEFAULT_TEXT = 'Node.js'

// Remove a new progress bar when a download is complete
const stopBar = (bar) => {
  bar.stop()
  multibar.remove(bar)

  // Otherwise the progress bar is creating an empty line
  if (multibar.bars.length === 0) {
    multibar.stop()
  }
}
