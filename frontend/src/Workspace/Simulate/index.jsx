import { useState } from 'react'
import './index.css'
import SideBar from './SideBar'
import Canvas from './Canvas'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Simulate({full, setFull, report, portfolio, setPortfolio}) {

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
        <div style={{display: "flex", flex: "4 4", flexDirection: "column"}}>
            <div id="actionbar">
                <div>
                <ActionElement text='Add' handleClick={() => changeSide('Add')}/>
                <ActionElement text='Clear' handleClick={() => changeSide('Clear')}/>
                <ActionElement text='Undo' handleClick={() => changeSide('Undo')}/>
                <ActionElement text='Redo' handleClick={() => changeSide('Redo')}/>
                <ActionElement text='Collapse' handleClick={() => changeSide('Clear')}/>
                </div>
                <FullButton />
            </div>
            <Canvas data={report["data2"]} />
        </div>
        
        <SideBar type={side} portfolio={portfolio} setPortfolio={setPortfolio} />
      </div>
  )
}

export default Simulate