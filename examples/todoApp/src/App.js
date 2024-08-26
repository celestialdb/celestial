import React from 'react'

import Header from './features/header/Header'
import TodoList from './features/todos/TodoList'
import Footer from './features/footer/Footer'

import {tasksApiSlice, useGetTasksQuery} from "./dataApi/tasksApiSlice";
import {useSelector} from "react-redux";
import {isRejected} from "@reduxjs/toolkit";
import {useGetColorsQuery} from "./dataApi/colorsApiSlice";
import {useGetStatusQuery} from "./dataApi/redundant/statusApiSlice";
import {useGetTestQuery} from "./dataApi/testApiSlice";


function App() {

  const {data, error, isLoading, isError, isSuccess} = useGetTasksQuery()
    const colorstemp = useGetColorsQuery()
    const statustemp = useGetStatusQuery()
  console.log("---- state after rtk query: ", useSelector((state) => state))

  useGetTestQuery()


  return (
    <div className="App">
      <nav>
        <section>
          <h1>Queue with Redux</h1>
        </section>
      </nav>
      <main>
        <section className="medium-container">
          <h2>Todos</h2>
          <div className="todoapp">
            <Header />
            <TodoList />
            <Footer />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
