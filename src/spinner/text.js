// Retrieve the text shown next to the spinner
export const getText = function(path, transferred) {
  return `${getPrefix(path)} ${getMegabytes(transferred)}`
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

const getMegabytes = function(transferred) {
  const size = Math.floor(transferred / BYTES_TO_MEGABYTES)
  return `${String(size).padStart(2)}MB`
}

// eslint-disable-next-line no-magic-numbers
const BYTES_TO_MEGABYTES = 1024 ** 2
