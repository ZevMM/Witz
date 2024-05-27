import { useState } from 'react'
import './index.css'
import SideBar from './SideBar'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Analyze() {

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
            <ActionElement text='Technical' handleClick={() => changeSide('Technical')}/>
            <ActionElement text='Macro' handleClick={() => changeSide('Macro')}/>
            <ActionElement text='Custom' handleClick={() => changeSide('Custom')}/>
        </span>
        <SideBar type={side} />
      </>
  )
}

export default Analyze