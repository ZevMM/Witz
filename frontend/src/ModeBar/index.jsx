import { useState } from 'react'
import './index.css'

const ModeElement = ({text, status, handleClick}) => {
  if (status == text) {
    return (
      <span className="modeelement selected" onClick={handleClick}>
        {text}
        <div className="underline"></div>
      </span>
    )
    
  }
  return (
    <span className="modeelement" onClick={handleClick}>
    {text}
    <div className="other"></div>
    </span>
  )
} 

function ModeBar({mode, setMode, full}) {

  
  const changeMode = (choice) => {setMode(choice)}

  if (full) { return }

  return (
    <div id="modebar">
      <ModeElement text='Construct' status = {mode} handleClick={() => changeMode('Construct')}/>
      <ModeElement text='Analyze' status = {mode} handleClick={() => changeMode('Analyze')}/>
      <ModeElement text='Simulate' status = {mode} handleClick={() => changeMode('Simulate')}/>
    </div>
  )
}

export default ModeBar
