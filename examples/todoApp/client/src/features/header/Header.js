import React, { useState } from 'react'

import { usePostTasksMutation } from '../../celestial'

const Header = () => {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const [addTask, { addTaskLoading }] = usePostTasksMutation()

  const handleChange = (e) => setText(e.target.value)

  const handleKeyDown = async (e) => {
    // If the user pressed the Enter key:
    const trimmedText = text.trim()
    if (e.which === 13 && trimmedText) {
      // Create and dispatch the thunk function itself
      setStatus('loading')
      await addTask({newTask: {text: trimmedText}})
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
