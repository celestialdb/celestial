import React from 'react'
import { useSelector } from 'react-redux'

import { ReactComponent as TimesSolid } from './times-solid.svg'

import { capitalize, StatusFilters } from '../../utils/utils'
import {
  selectColors,
  selectColorsById,
  useGetColorsQuery
} from "../../celestial";
import {
  selectTasksById, usePutTaskStatusMutation, useDeleteTaskMutation, usePutTaskColorMutation,
} from '../../celestial'


const TodoListItem = ({ id }) => {

  const todo = useSelector((state) => selectTasksById(state, id))
  const text = todo.text
  const status = todo.status === StatusFilters.Completed
  const color = useSelector((state) => selectColorsById(state, todo.color)) || {}
  useGetColorsQuery()
  const allColors = useSelector(selectColors) || []

  const [updateTaskColor, { temp1 }] = usePutTaskColorMutation()
  const [updateTaskStatus, { temp2 }]  = usePutTaskStatusMutation()
  const [deleteTask, { temp3 }]  = useDeleteTaskMutation()

  const handleCompletedChanged = (e) => {
    const newStatus = e.target.checked ? 1 : 3
    updateTaskStatus({updateTaskStatus: {task_id: todo.id, status:newStatus}})
  }

  const handleColorChanged = (e) => {
    const color = e.target.value
    const colorId = Object.values(allColors).find((item) => item.color === color).id
    updateTaskColor({updateTaskColor: {task_id: todo.id, color: colorId }})
  }

  const onDelete = () => {
    deleteTask({deleteTask: {task_id: todo.id}})
  }

  // useSelector(state => selectColors(state))
  const colorOptions = Object.values(allColors).map((item) => (
      <option key={item.id} id={item.id} value={item.color}>
        {capitalize(item.color)}
      </option>
  ))

  return (
    <li>
      <div className="view">
        <div className="segment label">
          <input
            className="toggle"
            type="checkbox"
            checked={status}
            onChange={handleCompletedChanged}
          />
          <div className="todo-text">{text}</div>
        </div>
        <div className="segment buttons">
          <select
              className="colorPicker"
              value={color.color}
              style={{color: color.color}}
              onChange={handleColorChanged}
          >
            <option value=""></option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={onDelete}>
            <TimesSolid/>
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoListItem
