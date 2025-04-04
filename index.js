#!/usr/bin/env node
import { generateRTKDefs } from '@celestial-labs/codegen-openapi';

import fs from 'fs';

if (process.argv.length < 4) {
    console.log("Usage: node index.js <openApiSpecFile> <destinationFolder>")
    process.exit(1)
}

const openApiSpecFile = process.argv[2]
const destinationFolder = process.argv[3]

// create destination folder if it doesn't exist
if (!fs.existsSync(destinationFolder)){
    fs.mkdirSync(destinationFolder, { recursive: true });
}

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

await generateRTKDefs(tags, openApiSpecFile, destinationFolder)
