import { useState, useEffect } from 'react'
import './index.css'
import SideBar from './SideBar'
import Canvas from './Canvas'
import axios from 'axios'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Analyze({isUpdated, layout, setLayout, full, setFull, portfolio, setIsUpdated, report, setReport}) {
    console.log(layout)
    /*
    useEffect(() => {
        if (!isUpdated) {
            axios
            .post('http://localhost:3001/data', portfolio)
            .then(response => {
                setReport(response.data)
            })
            setIsUpdated(true);
        } else {
        }
    }, [])*/

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
                <ActionElement text='Preset' handleClick={() => changeSide('Preset')}/>
                <ActionElement text='Custom' handleClick={() => changeSide('Custom')}/>
                <ActionElement text='Clear' handleClick={() => changeSide('Undo')}/>
                <ActionElement text='Export' handleClick={() => true}/>
                </div>
                <FullButton />
            </div>
            <div style={{overflowY:"auto", paddingBottom:"100px", height:"100%"}}>
              <Canvas layout={layout} setLayout={setLayout} report={report} portfolio={portfolio}/>
            </div>
        </div>
        <SideBar type={side} layout={layout} setLayout={setLayout} />
      </div>
  )
}

export default Analyze