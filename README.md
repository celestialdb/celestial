<div align="center" padding=0px>
<h1 padding=0px>celestial: $\mathbf{\mathbf{\mathbf{\textcolor{black}{Managed} \space \textcolor{#764abc}{Redux \space Toolkit}}}}$</h1>
<!-- <h1 padding=0px>$\mathbf{\mathbf{\mathbf{\textcolor{black}{Managed} \space \textcolor{#764abc}{Redux \space Toolkit}}}}$</h1> -->
<h2 padding=0px>$\mathbf{Auto-generate \space RTK \space definitions \space from \space your \space OpenAPI \space Spec}$</h2>
</div>

Celestial generates RTK definitions for your backend with built-in support for caching and optimistic updates.

In other words, Celestial provides simple query and mutation hooks to interact with your backend with built-in support for caching and optimistic updates.

You get to directly use query and mutation hooks without writing any of the logic:
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
All data fetched is cached by default, and all mutations are optimistic by default.

Celestial also wraps away the complexity associated with state management. Managing local state is as simple as making function calls:
```js
// initialize cache to manage local state
useCacheInit("colors",[]);
useCacheInit("status", { All: 'all', Active: 3, Completed: 1,});

// update 
const cacheUpdate = useCacheUpdate();

const onStatusChange = (status) => {
    cacheUpdate("status", status)
}
```

## On this page
* [What is Celestial](#what-is-celestial)
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


# What is Celestial

[Redux Toolkit](https://github.com/reduxjs/redux-toolkit) provides a rich set of tools to build fast, snappy frontends. However, managing an in-house deployment is complex and requires expertise. Celestial gives you all the power of Redux Toolkit minus the hassle, making it simpler to build fast and snappy React apps.

**By generating your RTK definitions, Celestial wraps away the complexity of Redux Toolkit, exposing an intuitive hook-based interface for declarative server interaction and simplified state management.**


> * Auto-generated query and mutation hooks for your backend with built-in support for caching and optimistic update, and auto-syncing of client state with the server. 
> * All the power of Redux minus the boiler-plate and learning curve. Throw in any kind of state, structured however you want and manipulate it by simply calling `updateCache(stateVar, stateVarNewVal)`. 
> * Combine and tailor your data to your frontend models and access it via hook-based API. Derived state is cached and memoized by default. Changes to source state cascade down to the derived state including optimistic updates. 
> * Celestial acts as a unified state container for your entire UI state, guaranteeing deterministic state transitions for a consistent, bug-free UX.


Think of Celestial as a unified data layer on the frontend that contains your entire UI state and manages sync with the backend. It exposes hook-based API for you to plug into and declaratively manage data flow throughout your app, giving you an easy DX and consistent UX.

# Acknowledgements

Celestial relies heavily on Redux and its tooling. We extend our gratitude to the authors and maintainers for not only making these tools open source but also tirelessly tending the community since inception.


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

Read more [here]().

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
> Notice the pattern between the name of query hooks and their corresponding endpoint. Read more [here]().

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
> Notice the pattern between the name of mutation hook and the endpoint. Read more [here]().

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

You don't have to write your actions and reducers. Simply define your functions and add cacheUpdate at the end with the state var name and the key to update.