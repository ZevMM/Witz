import { useState } from 'react'
import './index.css'
import SideBar from './SideBar'
import Canvas from './Canvas'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Simulate({username, full, setFull, report, portfolio, simprops, levs}) {
    console.log(portfolio)
    
    const [side, setSide] = useState('')
 

    const changeSide = (active) => {
        if (side == active) {
            setSide('')
        } else {
            setSide(active)
        }
    }

    const FullButton = () => {
        if (full) {
            return <ActionElement text='∨' handleClick={() => setFull(false)} />
        }
        return <ActionElement text='∧' handleClick={() => setFull(true)} />
    }

    //options: ↩↪↶↷↺↻
    //more options: ⨇⨈⩔⩕⩖⩢⩣⩠⩞Ø🚫➕✖️🟰✕⇊⇈
    
    return (
      <div style={{display: "flex", height: "100%"}}>
        <div style={{display: "flex", flex: "4 4", flexDirection: "column", height:"100%"}}>
            <div id="actionbar">
                <div>
                <ActionElement text='Add' handleClick={() => changeSide('Add')}/>
                <ActionElement text='Control' handleClick={() => changeSide('Control')}/>
                <ActionElement text='Clear' handleClick={() => changeSide('Clear')}/>
                <ActionElement text='Undo' handleClick={() => changeSide('Undo')}/>
                <ActionElement text='Redo' handleClick={() => changeSide('Redo')}/>
                </div>
                <FullButton />
            </div>
            <div style={{display:"flex", flex:"1", overflowY:"auto", flexDirection:"column"}}>
            <Canvas simprops={simprops} />
            </div>
        </div>
        
        <SideBar  username={username} type={side} portfolio={portfolio}  simprops={simprops} levs={levs}/>
      </div>
  )
}

export default Simulate