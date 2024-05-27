import { useState } from 'react'
import './index.css'
import SideBar from './SideBar'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Simulate() {

    const [side, setSide] = useState('')

    const changeSide = (active) => {
        if (side == active) {
            setSide('')
        } else {
            setSide(active)
        }
    }

    return (
      <>
        <span id="actionbar">
            <ActionElement text='Parameters' handleClick={() => changeSide('Parameters')}/>
            <ActionElement text='Control' handleClick={() => changeSide('Control')}/>
            <ActionElement text='Display' handleClick={() => changeSide('Display')}/>
        </span>
        <SideBar type={side} />
      </>
  )
}

export default Simulate