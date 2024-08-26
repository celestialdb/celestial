/*
import { generateEndpoints, generateStoreConfig, generateBasicRTKSlice } from '../celestial-codegen/lib/index.js'

await generateEndpoints({
    schemaFile: '/Users/kriti/celestial/ex/celestial-server/open_api_spec.json',
    key: 'tasks',
    // this is the concat of endpoint capitalized and the open. For ex. get and Tasks
    endpointToIndex: 'getTasks',
    hooks: true,
    tag: true,
})

await generateStoreConfig()

await generateBasicRTKSlice()
 */


import { generateEndpoints, generateStoreConfig, generateBasicRTKSlice } from '../celestial-codegen/lib/index.js'
import fs from 'fs';

// '/Users/kriti/celestial/ex/celestial-server/open_api_spec.json'

if (process.argv.length < 4) {
    console.log("Usage: node index.js <openApiSpecFile> <destinationFolder>")
    process.exit(1)
}

const openApiSpecFile = process.argv[2]

const destinationFolder = process.argv[3]

console.log("Generating definitions for Open API Spec at ", openApiSpecFile)

// Load the OpenAPI spec
const openApiSpec = JSON.parse(fs.readFileSync(openApiSpecFile, 'utf8'));

// Extract tags from each endpoint
let tags = [];
Object.keys(openApiSpec.paths).forEach((path) => {
    const pathItem = openApiSpec.paths[path]
    Object.keys(pathItem).forEach((method) => {
        const tag = pathItem[method]["x-celestial-grouping"]
        tags.indexOf(tag) === -1 ? tags.push(tag) : null
    })
})

console.log("---- Tags: ", tags)
// tags = ["Status"]
for (let tag of tags) {
    await generateEndpoints({
        schemaFile: openApiSpecFile,
        outputFolder: destinationFolder,
        key: tag.toLowerCase(),
        hooks: true,
        tag: true,
    })
}

await generateStoreConfig({outputFolder: destinationFolder})

await generateBasicRTKSlice({outputFolder: destinationFolder})
