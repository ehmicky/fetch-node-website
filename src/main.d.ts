import type { Stream } from 'node:stream'

export interface Options {
  /**
   * Base URL.
   * Can be customized (for example `https://npmmirror.com/mirrors/node`).
   *
   * The following environment variables can also be used: `NODE_MIRROR`,
   * `NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.
   *
   * @default 'https://nodejs.org/dist'
   */
  mirror?: string

  /**
   * Show a progress bar.
   *
   * @default `false`
   */
  progress?: boolean

  /**
   * Cancels the release download when the signal is aborted.
   */
  signal?: AbortSignal
}

/**
 * Download release files available on
 * [`https://nodejs.org/dist/`](https://nodejs.org/dist/).
 *
 * @example
 * ```js
 * const stream = await fetchNodeWebsite('v12.8.0/node-v12.8.0-linux-x64.tar.gz')
 *
 * // Example with options
 * const otherStream = await fetchNodeWebsite(
 *   'v12.8.0/node-v12.8.0-linux-x64.tar.gz',
 *   {
 *     progress: true,
 *     mirror: 'https://npmmirror.com/mirrors/node',
 *     signal: new AbortController().signal,
 *   },
 * )
 * ```
 */
export default function fetchNodeWebsite(
  path: string,
  options?: Options,
): Promise<Stream>
