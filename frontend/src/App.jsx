import { useState, useEffect } from 'react'
import './App.css'
import NavBar from './NavBar'
import ModeBar from './ModeBar'
import Workspace from './Workspace'
import axios from 'axios'

function App() {

  const [mode, setMode] = useState('')
  const [full, setFull] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Run your cleanup or logging function here
      console.log('Window is closing!');

      axios
      .post('http://localhost:3001/deleteuser', {name: "user123"})
      
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

  }, []);

  useEffect(() => {
      axios
      .post('http://localhost:3001/adduser', {name: "user123"})
  }, []);

  return (
    <div id="container">
      <NavBar full={full}/>
      <ModeBar mode={mode} setMode={setMode} full={full}/>
      <Workspace mode={mode} full={full} setFull={setFull} />
    </div>
  )
}

export default App
