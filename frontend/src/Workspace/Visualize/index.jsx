import { useState } from 'react'
import './index.css'
import SideBar from './SideBar'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Visualize() {

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
            <ActionElement text='Preset' handleClick={() => changeSide('Preset')}/>
            <ActionElement text='Custom' handleClick={() => changeSide('Custom')}/>
            <ActionElement text='Animate' handleClick={() => changeSide('Animate')}/>
            <ActionElement text='Export' handleClick={() => changeSide('Export')}/>
        </span>
        <SideBar type={side} />
      </>
  )
}

export default Visualize