# Usage Guide

## On this page

* [Caveats](#caveats)
* [RTK Definitions Generated](#rtk-definitions-generated)
  * [Query & Mutation Hooks](#query--mutation-hooks)
  * [Default Selectors](#default-selectors)
  * [Cache Structure](#cache-structure)
* [Usage](#usage)
  * [Installation](#installation)
  * [Annotate OpenAPI Spec](#annotate-openapi-spec)
  * [Generation](#generation)
  * [Connect your React app](#connect-your-react-app)
  * [Injecting data into components](#injecting-data-into-components)
  * [Performing mutations](#performing-mutations)
  * [State Management](#state-management)

**For usage with an example, see [here]().**

# Caveats

1. Does not support RTK definitions for authentication endpoints or any other auth related capabilities such as auth headers.
2. No support for pagination (yet).
3. Optimistic updates are not supported for bulk update endpoints. Optimistic updates work only for modifying a single resource.
4. Optimistic updates supported only on PUT, POST and DELETE endpoints.
5. Optimistic update assumptions
   1. POST: contents of the request body are *inserted* into the cache at a placehold id
   2. PUT: contents of the request body are *upserted* into the cache at the provided id
   3. DELETE: entity associated with provided id is *deleted* from cache. 


# RTK Definitions Generated

## Query & Mutation Hooks

For each `GET` endpoint, a `usePlaceholderQuery()` hook is generated. Here, `Placeholder` is the camel-case of the **concatenation of the HTTP verb GET and the endpoint**.

For ex., for `/tasks`, the hook will be `useGetTasksQuery()` and for `/issues/issue_id`, the hook will be `useGetIssuesByIssueIdQuery()`. See example [here]().

For each of the `PUT`, `POST` and `DELETE` endpoints, a `usePlaceholderMutation()` hook is generated. See examples [here]().

## Default Selectors

Data fetched from the API calls is provided to the application using **Selectors**. Selectors is RTK's functionality to perform computations. You can think about them as functions. Read more about Selectors [here](https://redux.js.org/usage/deriving-data-selectors#calculating-derived-data-with-selectors).

Celestial generated three default selectors for each [**collection**]() of endpoints:

1. `selectCollection` which returns an array of all items fetched for this collection. More details about this below.
2. `selectCollectionById` which returns an item by id.
3. `selectCollectionIds` which returns an array of ids of all items fetched.

These selectors can be combined to create new selectors. The selector rules defined by [RTK](https://redux-toolkit.js.org/api/createSelector) and [Reselect](https://reselect.js.org/introduction/getting-started#basic-usage) carry over.

### Collections

Collections are at the core of Celestial's auto-generation. **Celestial requires that each endpoint be associated with a collection.** 

You can classify endpoints into collections based on the server resource each endpoint accesses. For ex. `/tasks` and `task/color` endpoints are grouped into the `tasks` collection; and `/colors` and `/colors/color_id` (if this endpoint existed) are grouped into the `colors` collection. Basically, collection of an endpoint will be the base part of the endpoint's URL. 

Only data fetched from one endpoint per collection will be cached. A collection may have multiple GET endpoints, but only response from only one of the GET endpoints will be cached. 

To get the most of caching functionality, we recommend that **the endpoint to cache be the endpoint that returns a collection of resources** (Collection Endpoint in REST) and not a specific resource (Instance Endpoint in REST). For ex. between `/tasks` and `/tasks/task_id`, `/tasks` will be cached and results for `/tasks/task_id` will be served from the cache. 

## Cache Structure

When you call a query hook, the corresponding API call is made and the response is cached in the RTK store, under the hook's (endpoint's) collection key. Additionally, for access optimization, the response is indexed by `id` column in the cache.

```json
// Redux store
{
  ...,
  "queryHookCollection" : {
    "entities": {
      id1: {...},
      id2: {...}
  },
    "ids": ["id1", "id2"]
  },
  ...
}
```

The cached data can be accessed using selectors:

```js
useSelector(state);
useSelector((state) => state.queryHookCollection);
```

Besides the cached query data, the state for UI is also stored in the RTK store under the `cache` key.

# Usage

## Installation

```bash
npm install @celestial-labs/celestial --save-dev
```

## Annotate OpenAPI Spec

First, annotate your open api spec with celestial related information

* `x-celestial-grouping`, *required, string*: This is where you define the endpoint's collection. When any endpoint in a collection sees an update, data for all other endpoints in the collection will be refetched automatically. See example 1.
* `tags`,*required, string[]*: This should be the same as the endpoint's `x-celestial-grouping`, only in array form. See example 1.
* `x-celestial-index-endpoint`, *boolean*: This is where you define the endpoint that must be cached. One GET endpoint in each collection must have this set to true. This endpoint must have a primary key column called`id`. See example 1.
* `x-celestial-index-endpoint-by-key`, *string*: This is where you define the key of the response JSON object where data to be cached will be present. By default the entire response object will be cached. Only required for endpoints which have the `x-celestial-index-endpoint` set. See example 1.
* `x-celestial-updateByKey`, *string*: When you perform an update, you send the primary key of the resource to update to the backend, along with other information. This is the location of the primary key of the resource being updated. If the primary key is present in `parameters`, specify `parameters.camelCase(primaryKey)`. If the primary key is present in the `requestBody`, specify `requestBody.primaryKey`. This must be the same as the `id` column returned by `x-celeted-index-endpoint`. Required for PUT and DELETE endpoints. See example 2.

#### Example 1.

```json
"/cart/items": {
      "get": {
        "summary": "Get cart items",
        "tags": ["cart"],
        "x-celestial-grouping": "cart",
        "x-celestial-index-endpoint": true,
        "x-celestial-index-endpoint-by-key": "cart", // response is of the form {"cart":[], "meta":{}}
        "operationId": "getCartItems",
        "responses": {
          "200": {
            "description": "Cart items",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "cart": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/CartLineitem"
                      }
                    }
                  },
                  "required": ["cart"]
                }
              }
            }
          },
        }
      }
    },
```



#### Example 2

```json
    "/cart/{action}": {
      "put": {
        "summary": "Add or remove item in cart",
        "tags": ["cart"],
        "x-celestial-grouping": "cart",
        "x-celestial-updateByKey": "requestBody.item_id", // or `parameters.itemId`: note the camelCase
        "operationId": "putCartAction",
        "parameters": [
          {
            "name": "action",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "enum": ["add", "remove"]
            },
            "description": "Action to perform on the cart (add or remove an item)"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "item_id": {
                    "type": "integer",
                    "description": "ID of the item to add or remove"
                  }
                },
                "required": ["item_id"]
              }
            }
          }
        },
      }
    }
```



## Generation

Generate your RTK definitions using

```js
npx celestial openAPISpec.json outputPath
```

`outputPath` need to be the root of your project. Typically, this contains the index.js that loads your root component.

> Generation of auth is not supported

**Tip:** You can use ChatGPT to generate your OpenAPI specification.



## Connect your React app 

For folks who are familiar with RTK, nothing changes. For folks new to the RTK way of doing things, this section and below offer a quick guide.

```js
import { store } from './celestial/store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}> // provide the RTK store to the app
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## Injecting data into components

Simply call the hook and then the selector like so.

```js
// import hook
import { usePlaceholderQuery } from "..."

// call the hook at the top of the component
usePlaceholderQuery()

// anywhere in the component
const allData = useSelector(selectCollection)
const allIds = useSelector(selectCollectionIds) 
const item = useSelector(selectCollectionById("id"))
const data = useSelector(selectCustomSelector)
```

If you have called the hook in a previously loaded component, you can simply call the selectors without the hook.

An example can be found [here]().


## Performing mutations

Simply call the mutation hook with arguments required by the corresponding API endpoint. All mutations are optimistic by default.

```js
// import hook
import { usePlaceholderMutation } from "./celestial"

// call the hook at the top of the component
const [updateCall] = usePlaceholderMutation()

// anywhere in the component
// call the mutation with arguments required for the API call
updateCall(...)
```

An example can be found [here]().




## State Management

**Step 1**: Initialize your state variables like so

```js
import { useCacheInit } from "./celestial"

useCacheInit("stateVar1",[]);
useCacheInit("stateVar2","stateVarVal");
```

An example can be found [here]().

**Step 2**: Access your state variables like so

```js
import { selectCache } from "./celestial";

// anywhere in your component
const { stateVars } = useSelector(selectCache)
```

An example can be found [here]().

**Step 3**: Update your state variables like so

```js
import { useCacheUpdate } from "./celestial";

// at the top of your component to abide by rules of React Hooks
const cacheUpdate = useCacheUpdate()

// anywhere in your component
cacheUpdate("stateVar1", ['a'])
cacheUpdate("stateVar2", "newValue")
```

An example can be found [here]().
