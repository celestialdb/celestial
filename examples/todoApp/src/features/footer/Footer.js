import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { capitalize } from '../../dataApi/colors'
import { selectColors } from "../../dataApi/colorsApiSlice";
import {
    StatusFilters,
    // colorFilterChanged,
    // statusFilterChanged,
} from '../../dataApi/filtersSlice'
import {
  completedTodosCleared,
  allTodosCompleted,
  selectTodos,
} from '../../dataApi/tasksApiSlice'
import {colorFilterChanged, statusFilterChanged} from "../../utils";

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
  const renderedColors = useSelector(state => selectColors(state)).map((color) => {
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
  const dispatch = useDispatch()

  const todosRemaining = useSelector((state) => {
    const uncompletedTodos = selectTodos(state).filter(
      (todo) => todo.status != StatusFilters.Completed
    )
    return uncompletedTodos.length
  })

  const { status, colors } = useSelector((state) => state.filters)

  const onMarkCompletedClicked = () => dispatch(allTodosCompleted())
  const onClearCompletedClicked = () => dispatch(completedTodosCleared())

  const onColorChange = (color, changeType) =>
    dispatch(colorFilterChanged(color, changeType))
    // dispatch({type: 'colorFilterChanged', color, changeType})

  const onStatusChange = (status) => dispatch(statusFilterChanged(status)) // dispatch({type: 'statusFilterChanged', status}) // dispatch(statusFilterChanged(status))


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
