<div style="text-align: center;padding: 0px">
<h1 style="padding: 0px">celestial</h1>
<h2 style="padding: 0px">Managed <t style="color: #764abc">Redux Toolkit</t></h2>
<h3 style="padding: 0px">Auto-generate RTK definitions from your OpenAPI Spec</h3>
</div>

###

Celestial generates RTK definitions for your backend with built-in support for caching and optimistic updates.

For those who don't know Redux Toolkit, Celestial provides simple query and mutation hooks to interact with your backend with built-in support for caching and optimistic updates.

After generating the RTK definitions, you only have to do the following. No need to write data fetching logic, no need to write reducers, no need to write action creators, no need to write selectors, no need to write middleware, no need to write store configuration, no need to write tests for all of these.
```js
// call the hooks
useGetColorsQuery()
useGetTasksQuery()

// inject data
const todo = useSelector(selectTasksById(id))
const todoColor = useSelector(selectColorsById(todo.colorId))
const allColors = useSelector(selectColors)
```
Updating the backend is just as simple:
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
* [Celestial]()
* [DX with Celestial]()
* [Usage]()
  * [Installation]()
  * [Generate RTK Definitions]()
  * [Provide RTK Definitions to your app]()
  * [Data fetching and injecting data in components]()
  * [Performing mutations]()
  * [State Management]()
* [Acknowledgements]()
* [Features]()
* [Code Samples]()
  * [ToDo App]()
  * [Jira Clone]()


# Celestial

[Redux Toolkit](https://github.com/reduxjs/redux-toolkit) is a  provides a rich set of tools to build fast, snappy frontends. However, managing an in-house deployment is complex and requires expertise. Celestial gives you all the power of Redux Toolkit minus the hassle, making it simpler to build fast and snappy React apps.

**Celestial wraps away the complexity of Redux Toolkit, exposing an intuitive hook-based interface for declarative server interaction and simplified state management.**


> * Auto-generated query and mutation hooks for your backend with built in support for caching and optimistic update, and auto-syncing of client state with the server. 
> * All the power of Redux minus the boiler-plate and learning curve. Throw in any kind of state, structured however you want and manipulate it by simply calling `updateCache(stateVar, stateVarNewVal)`. 
> * Combine and tailor your data to your frontend models and access it via hook-based API. Derived state is cached and memoized by default. Changes to source state cascade down to the derived state including optimistic updates. 
> * Celestial acts as a unified state container for your entire UI state, guaranteeing deterministic state transitions for a consistent, bug-free UX.


Think of Celestial as a unified data layer on the frontend that contains your entire UI state and manages sync with the backend. It exposes hook-based API for you to plug into and declaratively manage data flow throughout your app, giving you an easy DX and consistent UX.

# DX with Celestial

# Usage

## Installation
```bash
npm install @celestial-labs/celestial --save-dev
```

## Generate RTK Definitions
```bash
npx celestial openAPISpec.json outputPath
```

## Provide RTK Definitions to your app
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
import { selectColors, selectColorsById, useGetColorsQuery} from "../../celestial/colorsData";
import { selectTasksById } from '../../celestial/tasksData'

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

## Performing mutations
```js
import { usePostTasksMutation } from '../../celestial/tasksData'

// call hook at the top of the component
const [ addTask ] = usePostTasksMutation()

// this will issue a POST on /tasks endpoint
// we call the mutation using arguments required by the POST endpoint
addTask({newTask: {text: trimmedText}})
```

## State Management
```js
import { useCacheInit } from "./celestial/cache"

useCacheInituseCacheInit("stateVar1",[]);
useCacheInit("stateVar2","stateVarVal");
```

```js
import { selectCache } from "../../celestial/cache";

// anywhere in your component
const { stateVars } = useSelector(selectCache)
```

```js
import { useCacheUpdate } from "../../celestial/cache";

// at the top of your component to abide by rules of React Hooks
const cacheUpdate = useCacheUpdate()

// anywhere in your component
cacheUpdate("stateVar1", ['a'])
cacheUpdate("stateVar2", "newValue")
```

# Acknowledgements
Celestial relies heavily on Redux and its tooling. We extend our gratitude to the authors and maintainers for not only making these tools open source but also tirelessly tending the community since inception.


# Code Samples

## ToDo App

## Jira Clone