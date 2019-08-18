import ora from 'ora'

export const addSpinner = function({ body }, progress) {
  if (!progress) {
    return
  }

  const spinner = startSpinner(TEXT)

  // eslint-disable-next-line fp/no-let
  let size = 0
  body.on('data', buffer => {
    // eslint-disable-next-line fp/no-mutation
    size += buffer.length
    updateSpinner(spinner, size)
  })

  body.on('end', () => {
    stopSpinner(spinner)
  })
}

const startSpinner = function() {
  const spinner = ora({ color: 'green', spinner: 'star' })
  spinner.start()
  return spinner
}

const updateSpinner = function(spinner, size) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  spinner.text = `${TEXT} ${getMegabytes(size)}`
}

const TEXT = 'Downloading Node.js...'

const stopSpinner = function(spinner) {
  spinner.stop()
}

const getMegabytes = function(size) {
  const sizeA = Math.floor(size / BYTES_TO_MEGABYTES)
  return `${String(sizeA).padStart(2)}MB`
}

// eslint-disable-next-line no-magic-numbers
const BYTES_TO_MEGABYTES = 1024 ** 2
