import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import TodoListItem from './TodoListItem'

// import {selectFilteredTodoIds, selectQueries, selectTodos} from '../../dataApi/redundant/todosSlice'
import {selectTodos, useGetTasksQuery, selectTodoIds, tasksApiSlice, selectFilteredTodoIds} from "../../dataApi/tasksApiSlice";
import {useGetColorsQuery} from "../../dataApi/colorsApiSlice";
import {useGetStatusQuery} from "../../dataApi/redundant/statusApiSlice";

const TodoList = () => {
  // const res = useSelector((state)=>state)
  // console.log("---- todo structure: ", res)
  //
  // const {data, error, isLoading, isError, isSuccess} = useGetTasksQuery()
  // console.log("---- data from rtk query in component2: ", data, isLoading, isError, isSuccess)
  //
  // const colorstemp = useGetColorsQuery()
  // const statustemp = useGetStatusQuery()
  //
  // let selectorTest = useSelector((state) => selectTodos(state))
  // console.log("---- selector test: ", selectorTest)
  // selectorTest = useSelector((state) => selectTodoIds(state))
  // console.log("---- selector test: ", selectorTest)
  //
  //
  const todoIds = useSelector(selectFilteredTodoIds)
  // console.log("---- filtered todoIds: ", todoIds)

  const loadingStatus = useGetTasksQuery().isLoading

  if (loadingStatus) {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
  // return <ul className="todo-list">Jellloo</ul>
}

export default TodoList
