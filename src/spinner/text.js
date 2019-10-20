// Retrieve the text shown next to the spinner
export const getText = function(path, percent) {
  const percentage = getPercentage(percent)
  return `${getPrefix(path)} ${percentage}`
}

const getPrefix = function(path) {
  const version = VERSION_TEXT_REGEXP.exec(path)

  if (version !== null) {
    return `${VERSION_TEXT} ${version[1]}...`
  }

  if (INDEX_TEXT_REGEXP.test(path)) {
    return INDEX_TEXT
  }

  return DEFAULT_TEXT
}

const VERSION_TEXT_REGEXP = /^\/?v([\d.]+)\//u
const INDEX_TEXT_REGEXP = /^\/?index.(json|tab)$/u

const VERSION_TEXT = 'Downloading Node.js'
const INDEX_TEXT = 'Downloading list of Node.js versions...'
const DEFAULT_TEXT = 'Downloading Node.js...'

const getPercentage = function(percent) {
  const percentage = Math.floor(percent * NUM_TO_PERCENTAGE)
  const percentageA = String(percentage).padStart(PERCENTAGE_WIDTH)
  return `${percentageA}%`
}

const NUM_TO_PERCENTAGE = 1e2
const PERCENTAGE_WIDTH = 3
