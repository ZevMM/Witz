import { useState } from 'react'
import './index.css'
import SideBar from './SideBar'
import Canvas from './Canvas'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Analyze({layout, setLayout, full, setFull, portfolio, setPortfolio}) {


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

    return (
      <div style={{display: "flex", height: "100%"}}>
        <div style={{display: "flex", flex: 4, flexDirection: "column"}}>
            <div id="actionbar">
                <div>
                <ActionElement text='Preset' handleClick={() => changeSide('Add')}/>
                <ActionElement text='Custom' handleClick={() => changeSide('Clear')}/>
                <ActionElement text='Clear' handleClick={() => changeSide('Undo')}/>
                <ActionElement text='Export' handleClick={() => changeSide('Redo')}/>
                </div>
                <FullButton />
            </div>
            <div style={{overflowY:"auto", paddingBottom:"100px", height:"100%"}}>
              <Canvas layout={layout} setLayout={setLayout}/>
            </div>
        </div>
        <SideBar type={side} layout={layout} setLayout={setLayout} />
      </div>
  )
}

export default Analyze