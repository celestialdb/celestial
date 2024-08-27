import {selectTasks} from "../celestial/tasksData";
import {createSelector} from "@reduxjs/toolkit";
import {StatusFilters} from "./utils";
import {selectCache} from "../celestial/cache";


export const selectFilteredTodos = createSelector(
    // First input selector: all todos
    selectTasks,
    // Second input selector: all filter values
    (state) => selectCache(state),
    // Output selector: receives both values
    (todos, filters) => {
        const { status, colors } = filters
        const showAllCompletions = status === StatusFilters.All
        if (showAllCompletions && colors.length === 0) {
            return todos
        }

        // Return either active or completed todos based on filter
        return todos.filter((todo) => {
            const statusMatches =
                showAllCompletions || todo.status === status
            const colorMatches = colors.length === 0 || colors.includes(todo.color)
            return statusMatches && colorMatches
        })
    }
)

export const selectFilteredTodoIds = createSelector(
    // Pass our other memoized selector as an input
    selectFilteredTodos,
    // And derive data in the output selector
    (filteredTodos) => filteredTodos.map((todo) => todo.id)
)

export const selectCompletedTodoIds = createSelector(
    selectTasks,
    // And derive data in the output selector
    (todos) => todos.filter((todo) => todo.status === StatusFilters.Completed).map((todo) => todo.id)
)