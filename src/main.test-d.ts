import { Stream } from 'node:stream'

import fetchNodeWebsite, { Options } from 'fetch-node-website'
import { expectError, expectAssignable } from 'tsd'

expectAssignable<Stream>(await fetchNodeWebsite('path'))
expectError(await fetchNodeWebsite())

await fetchNodeWebsite('path', {})
expectAssignable<Options>({})
expectError(await fetchNodeWebsite('path', true))

await fetchNodeWebsite('path', { mirror: 'https://example.com' })
expectAssignable<Options>({ mirror: 'https://example.com' })
expectError(await fetchNodeWebsite('path', { mirror: true }))

await fetchNodeWebsite('path', { progress: true })
expectAssignable<Options>({ progress: true })
expectError(await fetchNodeWebsite('path', { progress: 'true' }))
