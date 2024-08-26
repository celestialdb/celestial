import type { ConfigFile } from '@celestial_labs/codegen-openapi'

const config: ConfigFile = {
    schemaFile: '/Users/kriti/celestial/ex/celestial-server/open_api_spec.json',
    apiFile: './emptyApi.ts',
    apiImport: 'emptySplitApi',
    outputFile: './petApi.ts',
    exportName: 'petApi',
    hooks: true,
    tag: true,
    identifier: 'pets',
    basePath: '/Users/kriti/celestial/ex/celestial-code-gen-test'
}

export default config;