// Add a new spinner to the global list of spinners
export const pushSpinner = function(spinner) {
  // eslint-disable-next-line fp/no-mutating-methods
  spinners.push(spinner)
  startSpinner(spinners[0])
}

// Remove a spinner to the global list of spinners
export const popSpinner = function(spinner) {
  stopSpinner(spinner)
  // eslint-disable-next-line fp/no-mutation
  spinners = spinners.filter(spinnerA => spinnerA !== spinner)
  startSpinner(spinners[0])
}

// When several `fetch-node-website` calls are done in parallel, we ensure
// only one spinner is shown at once
const startSpinner = function(spinner) {
  if (spinner === undefined || spinner.isSpinning) {
    return
  }

  spinner.start()
}

const stopSpinner = function(spinner) {
  if (!spinner.isSpinning) {
    return
  }

  spinner.stop()
}

// eslint-disable-next-line fp/no-let
let spinners = []
