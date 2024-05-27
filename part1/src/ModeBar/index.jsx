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
  return <span className="modeelement" onClick={handleClick}>{text}</span>
} 

function ModeBar({mode, setMode}) {

  
  const changeMode = (choice) => {setMode(choice)}

  return (
    <div id="modebar">
      <ModeElement text='Construct' status = {mode} handleClick={() => changeMode('Construct')}/>
      <ModeElement text='Visualize' status = {mode} handleClick={() => changeMode('Visualize')}/>
      <ModeElement text='Analyze' status = {mode} handleClick={() => changeMode('Analyze')}/>
      <ModeElement text='Simulate' status = {mode} handleClick={() => changeMode('Simulate')}/>
    </div>
  )
}

export default ModeBar