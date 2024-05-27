import { useState } from 'react'
import './App.css'
import NavBar from './NavBar'
import ModeBar from './ModeBar'
import Workspace from './Workspace'

function App() {

  const [mode, setMode] = useState('')
  const [full, setFull] = useState(false)

  return (
    <div id="container">
      <NavBar full={full}/>
      <ModeBar mode={mode} setMode={setMode} full={full}/>
      <Workspace mode={mode} full={full} setFull={setFull} />
    </div>
  )
}

export default App
