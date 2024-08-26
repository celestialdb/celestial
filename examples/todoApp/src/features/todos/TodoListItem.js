import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ReactComponent as TimesSolid } from './times-solid.svg'

import { capitalize } from '../../dataApi/colors'
import {selectColorById, selectColors} from "../../dataApi/colorsApiSlice";
import {
  todoUpdateColor,
  todoDelete,
  todoUpdateStatus,
  selectTodoById, useAddTaskMutation, useUpdateTaskStatusMutation, useDeleteTaskMutation, useUpdateTaskColorMutation,
} from '../../dataApi/tasksApiSlice'
import {StatusFilters} from "../../dataApi/filtersSlice";

// Destructure `props.id`, since we just need the ID value
const TodoListItem = ({ id }) => {
  const colorLoadingStatus = useSelector((state) => state.colors.status)

  // Call our `selectTodoById` with the state _and_ the ID value
  const todo = useSelector((state) => selectTodoById(state, id))
  // console.log("---- Selected todo: ", todo)
  const text = todo.text

  const status = todo.status === StatusFilters.Completed ? true : false

  const color = useSelector((state) => selectColorById(state, todo.color))
    // console.log("---- Selected color: ", color)
  const todoColor = color === undefined ? 'black' : color.color
  // console.log("---- Selected todoColor: ", todoColor)
  const allColors = useSelector((state) => selectColors(state))
    // console.log("---- testing selectors: ", testing)

  const [updateTaskColor, { temp1 }] = useUpdateTaskColorMutation()
  const [updateTaskStatus, { temp2 }]  = useUpdateTaskStatusMutation()
  const [deleteTask, { temp3 }]  = useDeleteTaskMutation()

  const dispatch = useDispatch()

  const handleCompletedChanged = (e) => {
    const newStatus = e.target.checked ? 1 : 3
    updateTaskStatus({task_id: todo.id, status:newStatus})
    // dispatch(todoUpdateStatus(todo.id, newStatus))
  }

  const handleColorChanged = (e) => {
    const color = e.target.value
    const colorId = allColors.find((item) => item.color === color).id
    updateTaskColor({task_id: todo.id, color:colorId})
    // dispatch(todoUpdateColor(todo.id, colorId))
  }

  const onDelete = () => {
    deleteTask({task_id: todo.id})
    // dispatch(todoDelete(todo.id))
  }

  const onSave = () => {
    // dispatch(todoSaveChanges(todo.id))
  }

  const colorOptions = useSelector(state => selectColors(state)).map((item) => (
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
              value={todoColor}
              style={{color: todoColor}}
              onChange={handleColorChanged}
          >
            <option value=""></option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={onDelete}>
            <TimesSolid/>
          </button>
          <button onClick={onSave}>
            {"Save"}
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoListItem
