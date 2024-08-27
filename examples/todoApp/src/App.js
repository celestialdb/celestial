import React, {useEffect} from 'react'

import Header from './features/header/Header'
import TodoList from './features/todos/TodoList'
import Footer from './features/footer/Footer'

import {useGetTasksQuery} from "./celestial/tasksData";
import {updateCache} from "./celestial/cache"
import {useDispatch, useSelector} from "react-redux";
import {StatusFilters} from "./utils/utils";
import {useGetColorsQuery} from "./celestial/colorsData";
import {useGetStatusQuery} from "./celestial/statusData";


function App() {

  useGetTasksQuery()
    useGetColorsQuery()
    useGetStatusQuery()
    console.log("---- state after rtk query: ", useSelector((state) => state))


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateCache("colors",[]));
    dispatch(updateCache("status",StatusFilters.All));
  }, []);

  // useDispatch()(updateCache("colors",{}))
  // useDispatch()(updateCache("status",StatusFilters.All))

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
