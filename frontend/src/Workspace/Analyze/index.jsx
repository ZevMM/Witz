import { useState, useEffect } from 'react'
import './index.css'
import SideBar from './SideBar'
import Canvas from './Canvas'
import axios from 'axios'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Analyze({isUpdated, layout, setLayout, full, setFull, portfolio, setIsUpdated, report, setReport}) {

    useEffect(() => {
        if (!isUpdated) {
            console.log("need to update");
            axios
            .post('http://localhost:3001/data', portfolio) //eventually needs to become post
            .then(response => {
                setReport(response.data)
            })
            setIsUpdated(true);
        } else {
            console.log("already updated")
        }
    }, [])

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
              <Canvas layout={layout} setLayout={setLayout} report={report}/>
            </div>
        </div>
        <SideBar type={side} layout={layout} setLayout={setLayout} />
      </div>
  )
}

export default Analyze