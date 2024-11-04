# Usage Finer Points

## On this page







# Data Fetching



# Grouping endpoints

### Add Celestial keys to the OpenAPI spec

To each endpoint, you must add `x-celestial-grouping` key. We recomment you set it to the resource of the base path of the URL.



# Indexing endpoints

If you want to index the data, then you must add `x-celestial-index-endpoint` and set it to `true`, like so `x-celestial-index-endpoint: true`. Typically, this will be the get endpoint that gets a list of all the resources, such as /tasks or /colors. It will not be for /task/task_id and so forth.



# Naming Conventions

### Formula for `Placeholder`

For each endpoint, 

1. `Placeholder` is the `operationId` in camel case, if `operationId` is present in the OpenAPI spec.
2. If `operationId` is not present in the OpenAPI spec, a reasonable name is generated from the HTTP verb and the path. For ex. `GetTasks`, `GetTaskByTaskId`, `PutTask`, `PutTaskColor`,`PutTaskByTaskId`.

## Hooks



## Selectors
