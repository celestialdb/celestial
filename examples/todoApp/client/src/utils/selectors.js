import {selectTasks} from "../celestial";
import {createSelector} from "@reduxjs/toolkit";
import {StatusFilters} from "./utils";
import {selectCache} from "../celestial";
import {selectColors} from "../celestial";


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
            return Object.values(todos)
        }

        // Return either active or completed todos based on filter
        return Object.values(todos).filter((todo) => {
            const statusMatches =
                showAllCompletions || todo.status === status
            const colorMatches = colors.length === 0 || colors.includes(todo.color)
            return statusMatches && colorMatches
        })
    }
)

export const selectFilteredTodoIds = createSelector(
    selectFilteredTodos,
    (filteredTodos) => filteredTodos.map((todo) => todo.id)
)

export const selectCompletedTodoIds = createSelector(
    selectTasks,
    (todos) => Object.values(todos).filter((todo) => todo.status === StatusFilters.Completed).map((todo) => todo.id)
)

// useSelector((state) => selectColorId(state, color))
export const selectColorId = createSelector(
    selectColors,
        (state, color) => color,
    (colors, color) => {
        if (colors.length === 0 || Object.keys(color).length === 0) {
            return 0
        }
        return colors.find((item) => item.color === color.color).id
    }
)

