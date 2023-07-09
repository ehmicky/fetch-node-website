import type { Stream } from 'node:stream'

import fetchNodeWebsite, { type Options } from 'fetch-node-website'
import { expectAssignable } from 'tsd'

expectAssignable<Stream>(await fetchNodeWebsite('path'))
// @ts-expect-error
await fetchNodeWebsite()

await fetchNodeWebsite('path', {})
expectAssignable<Options>({})
// @ts-expect-error
await fetchNodeWebsite('path', true)

await fetchNodeWebsite('path', { mirror: 'https://example.com' })
expectAssignable<Options>({ mirror: 'https://example.com' })
// @ts-expect-error
await fetchNodeWebsite('path', { mirror: true })

await fetchNodeWebsite('path', { progress: true })
expectAssignable<Options>({ progress: true })
// @ts-expect-error
await fetchNodeWebsite('path', { progress: 'true' })

await fetchNodeWebsite('path', { signal: AbortSignal.abort() })
expectAssignable<Options>({ signal: AbortSignal.abort() })
// @ts-expect-error
await fetchNodeWebsite('path', { signal: 'signal' })
