import { useState } from 'react'
import './App.css'
import NavBar from './NavBar'
import ModeBar from './ModeBar'
import Workspace from './Workspace'

function App() {

  const [mode, setMode] = useState('')
  const [full, setFull] = useState(false)

  if (full) {
    return <Workspace mode={mode} full={full} setFull={setFull}/>
  }

  return (
    <div id="container">
      <NavBar />
      <ModeBar mode={mode} setMode={setMode} />
      <Workspace mode={mode} full={full} setFull={setFull} />
    </div>
  )
}

export default App
