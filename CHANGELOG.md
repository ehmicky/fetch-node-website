# 2.1.0

## Features

- Add alternative names for `NODE_MIRROR`: `NVM_NODEJS_ORG_MIRROR`,
  `N_NODE_MIRROR` and `NODIST_NODE_MIRROR`.

# 2.0.0

## Features

- Retry downloading the Node.js binaries on network errors.

## Breaking changes

- The return value now resolves to a stream, not to a fetch `Response`.

# 1.1.0

## Features

- Add a loading spinner. Can be disabled with the `progress` option.
