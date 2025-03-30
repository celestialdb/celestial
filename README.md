<div align="center" padding=0px>
<h1 padding=0px>CxAg</h1>
<h2 padding=0px>$\mathbf{Generates \space RTK \space definitions \space from \space your \space OpenAPI \space Spec}$</h2>
</div>

CxAg generates the backend wiring required to connect your frontend to your backend, by generating hooks that wrap the fetch calls to your backend API. The hooks generated have built-in support for caching, duplicate request handling, request cancellation. 

```js
// call the hooks
useGetColorsQuery()
useGetTasksQuery()

// inject data
const todo = useSelector(selectTasksById(id))
const todoColor = useSelector(selectColorsById(todo.colorId))
const allColors = useSelector(selectColors)
```
Updates are just as simple:
```js
const [ addTask ] = usePostTasksMutation()

// this will issue a POST on /tasks endpoint
addTask({newTask: {text: "my new todo"}})
```
CxAg also generates generic primitives for state management.
```js
// initialize cache to manage local state
useCacheInit("colors",[]);
useCacheInit("status", { All: 'all', Active: 3, Completed: 1,});

// update 
const cacheUpdate = useCacheUpdate();

const onStatusChange = (status) => {
    cacheUpdate("status", status)
}

// use local state
const { status } = useSelector(selectCache)
```

The data fetched from the backend and local state of the application are stored in the same state container, allowing you to combine data using the Selector primitive.

```javascript
// combine data fetched from backend with local state data
export const selectCompletedTodoIds = createSelector(
    selectTasks,
  	selectCache,
    (todos, cache) => Object.values(todos).filter((todo) => todo.status === cache.status.Completed).map((todo) => todo.id)
)

// use custom selector in component
const completedTodoIds = useSelector(selectCompletedTodoIds)
```



## On this page

* [CxAg](#cxag)
* [Acknowledgements](#acknowledgements)
* [Code Samples](#code-samples)
  * [ToDo App](#todo-app)
  * [Jira Clone](#jira-clone)
  * [Shopping App](#shopping-app)
* [Usage](#usage)
  * [Installation](#installation)
  * [Annotate the OpenAPI Spec](#annotate-the-openapi-spec)
  * [Generate RTK Definitions](#generate-rtk-definitions)
  * [Connect your app](#connect-your-app)
  * [Data fetching and injecting data in components](#data-fetching-and-injecting-data-in-components)
  * [Performing mutations](#performing-mutations)
  * [State Management](#state-management)


# CxAg

CxAG streamlines backend integration for your application by generating the necessary wiring code containing fetch calls to the API, error handling, etc.

It is based on the [RTK](https://github.com/reduxjs/redux-toolkit) framework which provides rich tooling for a fast and snappy user experience, such as loading state management, duplicate fetch calls, caching, optimistic updates.

While RTK is powerful, it can be complex and requires boilerplate code, presenting a learning curve. By generating your RTK definitions, CxAg abstracts away this complexity, providing an intuitive hook-based interface for declarative server interaction and simplified state management. 

Here's what you gain by using CxAG to generate your backend wiring:


> * Query and mutation hooks with built-in support for caching and auto-syncing of client state with the server. 
> * A unified container for your entire UI state, containing both the data fetched from backend and local application data.
> * Simplified management of local application state.
> * Combine and tailor the state data to your frontend models and access it via hook-based API.
> *  Derived state is cached and memoized by default. Changes to source state cascade down to the derived state.
> * Deterministic state transitions for a consistent, bug-free UX.



# Acknowledgements

CxAg wraps the tools provided by the RTK ecosystem. We extend our gratitude to the authors and maintainers for not only making these tools open source but also tirelessly tending the community since inception.


# Code Samples

## ToDo App
See [ToDo App](https://github.com/celestialdb/celestial/tree/main/examples/todoApp).

## Jira Clone
See [Jira Clone](https://github.com/celestialdb/celestial/tree/main/examples/jira_clone).

## Shopping App
See [Shopping App](https://github.com/celestialdb/celestial/tree/main/examples/shopping_cart).


# Usage

## Installation
```bash
npm install @celestial-labs/celestial --save-dev
```

## Annotate the OpenAPI Spec

Add the following information to your Open API spec:

* `x-celestial-grouping`
* `tags`
* `x-celestial-index-endpoint`
* `x-celestial-index-endpoint-by-key`
* `x-celestial-updateByKey`

Read more [here](https://github.com/celestialdb/celestial/blob/main/docs/README.md#annotate-openapi-spec).

## Generate RTK Definitions

```bash
npx celestial openAPISpec.json outputPath
```

You can see all the hooks and selectors you have available in `outputPath/index.js`.

## Connect your app
```js
import { store } from 'celestial/store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}> // provide the RTK store to the app
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## Data fetching and injecting data in components
```js
import { selectColors, selectColorsById, useGetColorsQuery} from "./celestial";
import { selectTasksById } from './celestial'

// call hook at the top of the component
// this will issue GET on the /colors endpoint
useGetColorsQuery()
// this will issue GET on the /tasks endpoint
useGetTasksQuery()

// anywhere in the component
const todo = useSelector(selectTasksById(id))
const todoColor = useSelector(selectColorsById(todo.colorId))
const allColors = useSelector(selectColors)
```
> Notice the pattern between the name of query hooks and their corresponding endpoint. Read more [here](https://github.com/celestialdb/celestial/blob/main/docs/README.md#query--mutation-hooks).

You don't have to write the data fetching code or handle failure cases. 

## Performing mutations
```js
import { usePostTasksMutation } from './celestial'

// call hook at the top of the component
// this will issue a POST on /tasks endpoint
const [ addTask ] = usePostTasksMutation()

// we call the mutation using arguments required by the POST endpoint
addTask({newTask: {text: trimmedText}})
```
> Notice the pattern between the name of mutation hook and the endpoint. Read more [here](https://github.com/celestialdb/celestial/blob/main/docs/README.md#query--mutation-hooks).

You don't have to write the code to update the backend. When the backend is updated, by default, everywhere this data is being used is updated as well, without you having to write refetch logic yourself.

## State Management
```js
import { useCacheInit } from "./celestial"

useCacheInituseCacheInit("stateVar1",[]);
useCacheInit("stateVar2","stateVarVal");
```

```js
import { selectCache } from "./celestial";

// anywhere in your component
const { stateVars } = useSelector(selectCache)
```

```js
import { useCacheUpdate } from "./celestial";

// at the top of your component to abide by rules of React Hooks
const cacheUpdate = useCacheUpdate()

// anywhere in your component
cacheUpdate("stateVar1", ['a'])
cacheUpdate("stateVar2", "newValue")
```

You don't have to write your actions and reducers. Simply define your functions and add `cacheUpdate` at the end with the state var name and the key to update.