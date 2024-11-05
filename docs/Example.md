# TODO App Example

## On this page

* [A TODO App]()
  * [Backend APIs]()
* [Generated RTK Definitions]()
  * [Generated Query Hooks]()
  * [Generated Mutation Hooks]()
  * [Cache Structure]()
  * [Default Selectors]()
* [Usage]()
  * [Connect your React app ]()
  * [State Management]()
    * [Initializing Cache]()
    * [Accessing cached data]()
    * [Updating cache]()
  * [Performing Updates]()
  * [Data Fetching and display]()
  * [Combing data to suit component]()
  


# A TODO App

We will use the following very simple ToDo app to demonstrate the usage of the generated RTK definitions.  

![ToDo App](/Users/kriti/celestial/ex/code-gen-test/docs/files/todo app.png)

The app displays all the ToDos along with their status and colour codes. At the top, the user can submit a new todo.

![ToDo App](/Users/kriti/celestial/ex/code-gen-test/docs/files/todo app color selection.png)

The user can mark a task as done (or undone) and can also select the color code of a task from a fixed selection.

![ToDo App](/Users/kriti/celestial/ex/code-gen-test/docs/files/todo app filtering capabilities.png)

The app provides additional buttons (far left), a counter (mid-left) and filtering facilities based on status (mid-right) and color (far right).

## Backend APIs

The backend provides the following APIs that the frontend must integrate. 

1. GET on /tasks: returns all the tasks in the database
2. POST on /tasks: for creating a new task
3. PUT on /task/color: for updating the color of a task
4. PUT on /task/status: for updating the status of a task
5. DELETE on /task: for deleting a task
6. GET on /colors: returns all possible colors a task can have
7. GET on /status: returns all possible status a task can have

# Generated RTK Definitions

## Generated Query Hooks

A query hook is generated for each  `GET` endpoint.

* useGetTasksQuery(): Performs a GET on /tasks
* useGetColorsQuery(): Performs a GET on /colors
* useGetStatusQuery(): Performs a GET on /status

> Notice the pattern between the names of the hooks and their corresponding endpoints. Read more [here]().

## Generated Mutation Hooks

For each POST, PUT and DELETE endpoints, a mutation hook is generated.

* Tasks:
  * usePostTasksMutation(): Performs a POST on /tasks
  * usePutTaskColorMutation(): Performs a PUT on /task/color
  * usePutTaskStatusMutation(): Performs a PUT on /task/status
  * useDeleteTaskMutation(): Performs a DELETE on /task

Since the colors and status collections don't have update endpoints, no mutation hooks are generated for these collections either.

> Notice the pattern between the names of the hooks and their corresponding endpoints. Read more [here]().

## Default Selectors

Data fetched from the API calls is provided to the application using **Selectors**. Selectors is RTK's functionality to perform computations. You can think about them as functions. Read more about Selectors [here]().

Three selectors are generated for each **collection** of endpoints. Celestial groups endpoints into **collections** based on the server resource each endpoint accesses. For ex. `/tasks` and `task/color` endpoints are grouped into the `tasks` collection; and `/colors` and `/colors/color_id` (if this endpoint existed) are grouped into the `colors` collection. Read more about collections [here]().

// Add a note

For the ToDo app, the following default selectors are generated:

* Tasks
  * selectTasks: returns an array of all tasks objects fetched from the backend
  * selectTasksIds: returns an array of ids of the task objects fetched from the backend
  * selectTasksById: returns a task object having a particular id.
* Colors
  * selectColors
  * selectColorsIds
  * selectColorsById
* Status
  * selectStatus
  * selectStatusIds
  * selectStatusById

## Cache Structure

RTK caches the response of API calls in the Redux store. The data from a given API call (query hook) will be cached in the Redux store under the hook's (endpoint's) **collection** name. 

The following is the structure of the data cached on frontend. The `cache` key stores any local UI state. All other keys store data fetched from the backend.

```json
{
  "cache":{"var1":[], "var2":{}, "var3":"someVal"},
  "tasks":{"entities":{"id1":{}, "id2":{}}, "ids": ["id1", "id2"] },
  "colors":{"entities":{}, "ids": [] },
  "status":{"entities":{}, "ids": [] }
}
```

The cached data can be accessed using selectors:

```js
const accessingStateEx = createSelector(
  state,
  (state) => state.tasks.ids
)
```

Internally, the default selectors described in the previous section also work the same way. 

# Usage

## Connect your React app 

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

## State Management

### Initializing Cache

```js
import { useCacheInit } from "./celestial/cache"

useCacheInit("colors",[]);
useCacheInit("status", { All: 'all', Active: 3, Completed: 1,});
```

### Accessing cached data

```js
import { selectCache } from "../../celestial/cache";

const { status } = useSelector(selectCache)
```

### Updating cache

```js
import { useCacheUpdate } from "../../celestial/cache";

// at the top of the component
const cacheUpdate = useCacheUpdate()

// anywhere in the component
const onStatusChange = (status) => {
      cacheUpdate("status", status)
  }
```

## Data Fetching and display

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

## Performing Updates

```js
import { usePostTasksMutation } from '../../celestial/tasksData'

// call hook at the top of the component
const [ addTask ] = usePostTasksMutation()

// this will issue a POST on /tasks endpoint
// we call the mutation using arguments required by the POST endpoint
addTask({newTask: {text: trimmedText}})
```

## Combing data to suit component

```js
// create a selector to filter a subset of todos
export const selectCompletedTodoIds = createSelector(
    selectTasks,
    (todos) => Object.values(todos).filter((todo) => todo.status === StatusFilters.Completed).map((todo) => todo.id)
)

// use custom selector in component
const completedTodoIds = useSelector(selectCompletedTodoIds)
```

You can also combine data from different API endpoints.

```js
// create a selector to add colors to the todos object using the color id key 
export const selectTasksJoinColors = createSelector(
    selectTasks,
    selectColors,
    (todos, colors) => {
        return Object.values(todos).map((todo) => {
            return {
                ...todo,
                color: colors.find((item) => item.id === todo.color).color
            }
        })
    }
)
```
