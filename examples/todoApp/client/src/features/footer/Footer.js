import React from 'react'
import { useSelector } from 'react-redux'

import { capitalize, StatusFilters } from '../../utils/utils'
import {selectColors} from "../../celestial";
import {selectCache, useCacheUpdate} from "../../celestial";
import {
    selectTasks, selectTasksIds, useDeleteTaskMutation, usePutTaskStatusMutation,
} from '../../celestial'
import {selectCompletedTodoIds} from "../../utils/selectors";

const RemainingTodos = ({ count }) => {
  const suffix = count === 1 ? '' : 's'

  return (
    <div className="todo-count">
      <h5>Remaining Todos</h5>
      <strong>{count}</strong> item{suffix} left
    </div>
  )
}

const StatusFilter = ({ value: status, onChange }) => {
  const renderedFilters = Object.keys(StatusFilters).map((key) => {
    const value = StatusFilters[key]
    const handleClick = () => onChange(value)
    const className = value === status ? 'selected' : ''

    return (
      <li key={value}>
        <button className={className} onClick={handleClick}>
          {key}
        </button>
      </li>
    )
  })

  return (
    <div className="filters statusFilters">
      <h5>Filter by Status</h5>
      <ul>{renderedFilters}</ul>
    </div>
  )
}

const ColorFilters = ({ value: colors, onChange }) => {
    // useSelector(state => selectColors(state))
    // Object.values(useColors())
  const renderedColors = Object.values(useSelector(selectColors)).map((color) => {
      const checked = colors.includes(color.id)
    const handleChange = () => {
      const changeType = checked ? 'removed' : 'added'
      onChange(color.id, changeType)
    }

    return (
      <label key={color.id}>
        <input
          type="checkbox"
          name={color.color}
          checked={checked}
          onChange={handleChange}
        />
        <span
          className="color-block"
          style={{
            backgroundColor: color.color,
          }}
        ></span>
        {capitalize(color.color)}
      </label>
    )
  })

  return (
    <div className="filters colorFilters">
      <h5>Filter by Color</h5>
      <form className="colorSelection">{renderedColors}</form>
    </div>
  )
}

const Footer = () => {
  const cacheUpdate = useCacheUpdate()
    const [updateTaskStatus]  = usePutTaskStatusMutation()
        const [deleteTask]  = useDeleteTaskMutation()
    const todoIds = useSelector(state => selectTasksIds(state))
    const completedTodoIds = useSelector(selectCompletedTodoIds)
    const todos = useSelector(selectTasks) || {}

  const todosRemainingTemp = Object.values(todos).filter((todo) => todo.status !== StatusFilters.Completed) || []
    const todosRemaining = todosRemainingTemp.length

  const { status, colors } = useSelector((state) => selectCache(state))

  const onMarkCompletedClicked = () => {
      todoIds.forEach((id) => {
          updateTaskStatus({updateTaskStatus:{task_id: id, status: StatusFilters.Completed}})
      })
  }
  const onClearCompletedClicked = () => {
        completedTodoIds.forEach((id) => {
            deleteTask({deleteTask: {task_id: id}})
        })
  }

  const newColors = (color, changeType) => {
      let temp = colors
      if (changeType === "added") {
        temp = [...temp, color]
      }
      if (changeType === "removed") {
        temp = temp.filter((existingColor) => existingColor !== color)
      }
      return temp
  }

    const onColorChange = (color, changeType) => {
        if (changeType === 'added') {
            cacheUpdate("colors", newColors(color, changeType))
        }
        if (changeType === 'removed') {
            cacheUpdate("colors", newColors(color, changeType))
        }
    }

  const onStatusChange = (status) => {
      cacheUpdate("status", status)
  }

  return (
    <footer className="footer">
      <div className="actions">
        <h5>Actions</h5>
        <button className="button" onClick={onMarkCompletedClicked}>
          Mark All Completed
        </button>
        <button className="button" onClick={onClearCompletedClicked}>
          Clear Completed
        </button>
      </div>

      <RemainingTodos count={todosRemaining} />
      <StatusFilter value={status} onChange={onStatusChange} />
      <ColorFilters value={colors} onChange={onColorChange} />
    </footer>
  )
}

export default Footer
