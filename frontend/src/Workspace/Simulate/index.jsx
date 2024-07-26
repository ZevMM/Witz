import { useState } from 'react'
import './index.css'
import SideBar from './SideBar'
import Canvas from './Canvas'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Simulate({full, setFull, report, portfolio, setPortfolio}) {
    const [pall, setPall] = useState([
        {x: 0, y: 0, w:1, h:1, i:"block0"},
        {x: 1, y: 0, w:1, h:1, i:"block1"},
        {x: 2, y: 0, w:1, h:1, i:"block2"}
    ])

    const [pevents, setPevents] = useState({"block0": {asset:"AAPL", quantity:50, side:"sell", type: "limit", limit: {price:180, exp: 12}},
        "block1": {asset:"AAPL", quantity:50, side:"sell", type: "limit", limit: {price:180, exp: 12}},
        "block2": {asset:"AAPL", quantity:50, side:"sell", type: "limit", limit: {price:180, exp: 12}}
        })

    const [mall, setMall] = useState([
        {x: 0, y: 0, w:1, h:1, i:"block0"},
        {x: 1, y: 0, w:1, h:1, i:"block1"},
        {x: 2, y: 0, w:1, h:1, i:"block2"}
    ])

    const [mevents, setMevents] = useState({"block0": {subj:"S&P", pct:60.05},
    "block1": {subj:"Oil", pct:60.02},
    "block2": {subj:"USD", pct:-50.00}
    })
    
    const [side, setSide] = useState('')
    const [simData, setSimData] = useState(Array(50).fill({
        "name": "Page A",
        "value": 0,
      }))
    const [numSteps, setNumSteps] = useState(50)

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
                <ActionElement text='Control' handleClick={() => changeSide('Control')}/>
                <ActionElement text='Clear' handleClick={() => changeSide('Clear')}/>
                <ActionElement text='Undo' handleClick={() => changeSide('Undo')}/>
                <ActionElement text='Redo' handleClick={() => changeSide('Redo')}/>
                </div>
                <FullButton />
            </div>
            <Canvas data={simData} numSteps={numSteps} mall={mall} setMall={setMall} mevents={mevents} setMevents={setMevents} pall={pall} setPall={setPall} pevents={pevents} setPevents={setPevents}/>
        </div>
        
        <SideBar type={side} portfolio={portfolio} setSimData={setSimData} pall={pall} pevents={pevents} mall={mall} mevents={mevents} setMevents={setMevents} setPevents={setPevents}/>
      </div>
  )
}

export default Simulate