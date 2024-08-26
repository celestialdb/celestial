import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAddTaskMutation } from '../../dataApi/tasksApiSlice'

const Header = () => {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const dispatch = useDispatch()
  const [addTask, { addTaskLoading }] = useAddTaskMutation()

  const handleChange = (e) => setText(e.target.value)

  const handleKeyDown = async (e) => {
    // If the user pressed the Enter key:
    const trimmedText = text.trim()
    if (e.which === 13 && trimmedText) {
      // Create and dispatch the thunk function itself
      setStatus('loading')
      console.log("----- addTask: ", trimmedText )
      await addTask({text: trimmedText})
      // And clear out the text input
      setText('')
      setStatus('idle')
    }
  }
  //
  let isLoading = addTaskLoading // status === 'loading'
  let placeholder = isLoading ? '' : 'What needs to be done?'
  let loader = isLoading ? <div className="loader" /> : null

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {loader}
    </header>
  )
}

export default Header
