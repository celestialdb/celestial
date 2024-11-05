import React from 'react'

import Header from './features/header/Header'
import TodoList from './features/todos/TodoList'
import Footer from './features/footer/Footer'

import {useCacheInit} from "./celestial"
import {StatusFilters} from "./utils/utils";
import {useSelector} from "react-redux";


function App() {


  console.log("---- state after rtk query: ", useSelector((state) => state))
  useCacheInit("colors",[]);
  useCacheInit("status",StatusFilters.All);

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
